import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { supabaseAdmin } from "@/lib/supabase";
import { auth } from "@/auth";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim());

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const BG_COLORS = ["#f0eedc", "#dce8f5", "#e8dcf5", "#dcf5e8", "#f5e8dc", "#f5dcdc"];

// 검색 쿼리 묶음 — 주(week) 번호로 순환하여 다양한 영역을 커버
const SEARCH_QUERIES = [
  "재가복지 장기요양 최신 뉴스 정책",
  "노인요양 장기요양보험 제도 변경",
  "방문요양 복지용구 노인돌봄 최신 소식",
  "요양보호사 노인복지 정책 변화",
];

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
    // ── 1. Tavily로 최신 재가복지 뉴스 검색 ───────────────────────────────
    const weekIdx = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000)) % SEARCH_QUERIES.length;
    const query = SEARCH_QUERIES[weekIdx];

    const articles = await searchRecentNews(query);

    // 뉴스 컨텍스트 구성 (Claude에게 전달할 참고 자료)
    const newsContext = articles.length > 0
      ? articles
          .map((a, i) => [
            `[기사 ${i + 1}] ${a.title}`,
            a.published_date ? `게재일: ${a.published_date}` : "",
            a.content,
            `출처: ${a.url}`,
          ].filter(Boolean).join("\n"))
          .join("\n\n---\n\n")
      : "최근 관련 뉴스를 찾지 못했습니다. 일반적인 재가복지 정보로 작성해주세요.";

    // ── 2. Claude로 글 + 이미지 프롬프트 생성 ────────────────────────────
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: "당신은 재가복지 전문 블로그 작가입니다. 실제 최신 뉴스를 바탕으로 어르신과 그 가족이 쉽게 이해할 수 있는 정보성 글을 씁니다.",
      messages: [
        {
          role: "user",
          content: `아래 최신 뉴스·정책 자료를 참고하여 재가복지 블로그 글을 작성해주세요.
순수 JSON만 반환하세요 (코드블록·설명 없이).

== 참고 뉴스 자료 ==
${newsContext}
== 참고 끝 ==

반환 형식:
{
  "title": "제목 (40자 이내, 최신 소식임을 드러내도록)",
  "category": "공지 또는 서비스 중 하나",
  "content": "HTML 본문",
  "imagePrompts": ["영어 프롬프트1", "영어 프롬프트2", "영어 프롬프트3", "영어 프롬프트4", "영어 프롬프트5"]
}

HTML 본문 규칙:
- 총 글자수: HTML 태그 제외 1400~1600자
- 위 뉴스 내용을 충실히 반영하되, 독자에게 실질적으로 도움이 되는 해설 추가
- 구조: <h2>도입 제목</h2> → <p>도입 2~3줄</p> → <img src="[IMAGE_1]"> → <h3>소주제1</h3> → 내용 + <img src="[IMAGE_2]"> → <h3>소주제2</h3> → 내용 + <img src="[IMAGE_3]"> → <h3>소주제3</h3> → 내용 + <img src="[IMAGE_4]"> → <blockquote>핵심 요약 1~2문장</blockquote> → <p>마무리</p> → <img src="[IMAGE_5]">
- <ul>, <ol>, <strong>, <em> 적극 활용하여 가독성 높게
- [IMAGE_1]~[IMAGE_5] 자리표시자를 정확히 삽입
- 출처 표기: 참고한 뉴스 출처는 본문 마지막 <p>에 "참고: [출처명]" 형식으로 명시

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
      category: parsed.category ?? "공지",
      title: parsed.title,
      content: processedContent,
      thumbnail,
      bg,
      date: todayStr(),
    });

    if (insertError) throw new Error(insertError.message);

    return NextResponse.json({ ok: true, title: parsed.title });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "알 수 없는 오류";
    console.error("[auto-post]", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
