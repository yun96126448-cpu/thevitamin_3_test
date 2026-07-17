import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@/auth";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim());

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const BG_COLORS = ["#f0eedc", "#dce8f5", "#e8dcf5", "#dcf5e8", "#f5e8dc", "#f5dcdc"];

// 검색을 허용할 신뢰 출처(공식 기관) 도메인 화이트리스트 — 일반 블로그·출처 불명 매체 배제
const TRUSTED_DOMAINS = [
  "mohw.go.kr",       // 보건복지부
  "longtermcare.or.kr", // 국민건강보험공단 노인장기요양보험
  "nhis.or.kr",        // 국민건강보험공단
  "law.go.kr",         // 국가법령정보센터
  "moleg.go.kr",        // 법제처
  "easylaw.go.kr",      // 찾기 쉬운 생활법령정보
  "korea.kr",          // 대한민국 정책브리핑
];

// 콘텐츠 유형 A: 최신 뉴스 · 법/제도 개정 — 시의성이 중요, 전문성 어필
const NEWS_LAW_QUERIES = [
  "장기요양보험 제도 개정 보건복지부",
  "재가복지 방문요양 정책 변경 공고",
  "노인장기요양보험법 개정 시행",
  "요양보호사 자격 기준 변경 고시",
];

// 콘텐츠 유형 B: 기초 상식 · 주의사항 — 상시성 정보, 흥미를 끄는 제목
const BASICS_CAUTION_QUERIES = [
  "장기요양등급 신청 방법 기준",
  "방문요양 재가급여 이용 절차",
  "재가급여 종류 이용 대상 안내",
  "요양보호사 방문요양 이용 시 주의사항",
];

type ContentType = "news_law" | "basics_caution";

function pickContentType(): ContentType {
  // 화요일 = 뉴스·법 개정, 금요일(그 외) = 기초상식·주의사항. cron: 화/금 주 2회 실행 기준.
  const day = new Date().getDay(); // KST 기준 (UTC 0시 실행 = KST 9시, 같은 요일)
  return day === 2 ? "news_law" : "basics_caution";
}

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

type TavilyResult = { title: string; content: string; url: string; published_date?: string };

async function searchRecentNews(query: string): Promise<TavilyResult[]> {
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query,
      search_depth: "basic",
      max_results: 5,
      include_raw_content: false,
      days: 30, // 최근 30일 이내 뉴스
      include_domains: TRUSTED_DOMAINS, // 공식 기관 도메인만 검색 — 신빙성 없는 출처 배제
    }),
  });

  if (!res.ok) throw new Error(`Tavily 검색 실패: ${res.status}`);
  const data = await res.json() as { results?: TavilyResult[] };
  return data.results ?? [];
}

async function uploadImageToSupabase(imageUrl: string, filename: string): Promise<string> {
  const res = await fetch(imageUrl);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { data, error } = await supabaseAdmin.storage
    .from("post-images")
    .upload(filename, buffer, { contentType: "image/png", upsert: true });

  if (error) throw new Error(`이미지 업로드 실패: ${error.message}`);

  const { data: urlData } = supabaseAdmin.storage
    .from("post-images")
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

export async function GET(req: Request) {
  // Vercel Cron 또는 관리자 로그인 확인
  const authHeader = req.headers.get("authorization");
  const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  if (!isCron) {
    const session = await auth();
    const isAdmin = ADMIN_EMAILS.includes(session?.user?.email ?? "");
    if (!isAdmin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // ── 1. 콘텐츠 유형 결정 + Tavily로 신뢰 출처만 검색 ───────────────────
    const contentType = pickContentType();
    const queries = contentType === "news_law" ? NEWS_LAW_QUERIES : BASICS_CAUTION_QUERIES;
    const weekIdx = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)) % queries.length;
    const query = queries[weekIdx];

    const articles = await searchRecentNews(query);

    // 뉴스 컨텍스트 구성 (Claude에게 전달할 참고 자료) — 신뢰 출처에서 못 찾으면 생성을 포기(추측 서술 방지)
    if (articles.length === 0) {
      return NextResponse.json(
        { error: "신뢰 출처(공식 기관)에서 참고할 자료를 찾지 못해 발행을 건너뛰었습니다." },
        { status: 200 }
      );
    }

    const newsContext = articles
      .map((a, i) => [
        `[자료 ${i + 1}] ${a.title}`,
        a.published_date ? `게재일: ${a.published_date}` : "",
        a.content,
        `출처: ${a.url}`,
      ].filter(Boolean).join("\n"))
      .join("\n\n---\n\n");

    const typeConfig = contentType === "news_law"
      ? {
          systemPrompt: "당신은 재가복지 전문 기관의 블로그 작가입니다. 보건복지부·국민건강보험공단·법제처 등 공식 출처의 최신 뉴스·법령/제도 개정 소식을 근거로, 일반인이 이해하기 쉬우면서도 전문성이 느껴지는 해설 글을 씁니다. 참고자료에 없는 사실·수치·날짜는 절대 지어내지 말고, 원문 그대로 정확히 인용하세요.",
          titleGuide: "제목 (40자 이내, 최신 소식·제도 변경임을 명확히 드러내도록)",
          defaultCategory: "정책소식",
        }
      : {
          systemPrompt: "당신은 재가복지 전문 기관의 블로그 작가입니다. 사람들이 잘 모르는 재가복지·요양 관련 기초 상식이나 주의사항을 참고자료(공식 기관)에 근거해 흥미롭게 풀어씁니다. 클릭하고 싶어지는 제목을 쓰되, 과장·낚시성 허위정보는 절대 금지하며 참고자료에 없는 사실은 지어내지 않습니다.",
          titleGuide: "제목 (40자 이내, 호기심을 자극하되 과장되지 않게. 예: '~하면 손해보는 이유', '의외로 모르는 ~')",
          defaultCategory: "생활정보",
        };

    // ── 2. Claude로 글 + 이미지 프롬프트 생성 ────────────────────────────
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: typeConfig.systemPrompt,
      messages: [
        {
          role: "user",
          content: `아래 공식 기관 참고자료만 근거로 재가복지 블로그 글을 작성해주세요.
순수 JSON만 반환하세요 (코드블록·설명 없이).

== 참고 자료 (공식 기관 출처) ==
${newsContext}
== 참고 끝 ==

반환 형식:
{
  "title": "${typeConfig.titleGuide}",
  "category": "${typeConfig.defaultCategory}",
  "content": "HTML 본문",
  "imagePrompts": ["영어 프롬프트1", "영어 프롬프트2", "영어 프롬프트3", "영어 프롬프트4", "영어 프롬프트5"]
}

HTML 본문 규칙:
- 총 글자수: HTML 태그 제외 1400~1600자
- 위 참고자료 내용을 충실히 반영하되, 독자에게 실질적으로 도움이 되는 해설 추가
- 구조: <h2>도입 제목</h2> → <p>도입 2~3줄</p> → <img src="[IMAGE_1]"> → <h3>소주제1</h3> → 내용 + <img src="[IMAGE_2]"> → <h3>소주제2</h3> → 내용 + <img src="[IMAGE_3]"> → <h3>소주제3</h3> → 내용 + <img src="[IMAGE_4]"> → <blockquote>핵심 요약 1~2문장</blockquote> → <p>마무리</p> → <img src="[IMAGE_5]">
- <ul>, <ol>, <strong>, <em> 적극 활용하여 가독성 높게
- [IMAGE_1]~[IMAGE_5] 자리표시자를 정확히 삽입
- 출처 표기: 참고한 자료의 기관명과 링크를 본문 마지막 <p>에 "출처: [기관명] ([URL])" 형식으로 명시

imagePrompts 규칙:
- 영어로 작성
- photorealistic, warm natural lighting, South Korean elderly care setting
- 프롬프트1(대표이미지): 주제를 대표하는 감성적인 장면
- 프롬프트2~5: 본문 소주제별 구체적인 장면`,
        },
      ],
    });

    const rawText = (message.content[0] as { type: string; text: string }).text.trim();
    const jsonText = rawText.startsWith("```")
      ? rawText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "")
      : rawText;

    const parsed = JSON.parse(jsonText) as {
      title: string;
      category: string;
      content: string;
      imagePrompts: string[];
    };

    // ── 3. DALL-E 3로 이미지 5개 생성 → Supabase Storage 업로드 ──────────
    const timestamp = Date.now();
    let processedContent = parsed.content;

    for (let i = 1; i <= 5; i++) {
      try {
        const imgRes = await openai.images.generate({
          model: "dall-e-3",
          prompt: parsed.imagePrompts[i - 1],
          n: 1,
          size: "1024x1024",
          quality: "standard",
        });

        const tempUrl = imgRes.data![0].url!;
        const permanentUrl = await uploadImageToSupabase(
          tempUrl,
          `${timestamp}_${i}.png`
        );
        processedContent = processedContent.replace(`[IMAGE_${i}]`, permanentUrl);
      } catch {
        processedContent = processedContent.replace(
          new RegExp(`<img[^>]*src="\\[IMAGE_${i}\\]"[^>]*>`, "g"),
          ""
        );
      }
    }

    // ── 4. 썸네일 추출 & Supabase 저장 ──────────────────────────────────
    const thumbnailMatch = processedContent.match(/<img[^>]+src="([^"]+)"/);
    const thumbnail = thumbnailMatch?.[1];
    const bg = BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)];

    const { error: insertError } = await supabaseAdmin.from("notices").insert({
      category: parsed.category ?? typeConfig.defaultCategory,
      title: parsed.title,
      content: processedContent,
      thumbnail,
      bg,
      date: todayStr(),
      status: "draft", // 관리자 승인 전까지 비공개 — 공지사항 페이지의 "검토 대기" 목록에서 승인/거절
    });

    if (insertError) throw new Error(insertError.message);

    return NextResponse.json({ ok: true, title: parsed.title, status: "draft" });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "알 수 없는 오류";
    console.error("[auto-post]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
