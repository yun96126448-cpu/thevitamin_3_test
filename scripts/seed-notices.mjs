// 공지사항 9개 발행 스크립트 (1회용 시드)
// 실행: node scripts/seed-notices.mjs
// 필요 env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
//  - .env.local 파일에 있으면 자동으로 읽음. 없으면 셸 환경변수 사용.
//
// 안전장치: 같은 제목이 이미 있으면 건너뜀(중복 삽입 방지). 여러 번 돌려도 안전.

import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// ── .env.local 간단 파서 (dotenv 없이) ─────────────────────────────
function loadEnvLocal() {
  try {
    const raw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const key = m[1];
      let val = m[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = val;
    }
  } catch {
    // .env.local 없으면 무시 (셸 환경변수 사용)
  }
}
loadEnvLocal();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !service) {
  console.error("❌ 환경변수 없음: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  console.error("   .env.local 에 넣거나 셸에서 설정 후 다시 실행하세요.");
  process.exit(1);
}

const supabase = createClient(url, service);

const BG_COLORS = ["#f0eedc", "#dce8f5", "#e8dcf5", "#dcf5e8", "#f5e8dc", "#f5dcdc"];

// 출처 공통 링크
const SRC = {
  ltc: "노인장기요양보험(longtermcare.or.kr)",
  ltcUrl: "https://www.longtermcare.or.kr",
  mohw: "보건복지부(mohw.go.kr)",
  mohwUrl: "https://www.mohw.go.kr",
  nhis: "국민건강보험공단(nhis.or.kr)",
  nhisUrl: "https://www.nhis.or.kr",
};

function srcLine(items) {
  const inner = items.map((i) => `${i.name} (${i.url})`).join(" · ");
  return `<p><em>출처: ${inner}</em></p>`;
}

// ── 9개 글 ─────────────────────────────────────────────────────────
const posts = [
  {
    category: "정책소식",
    title: "2026년 장기요양보험, 무엇이 달라지나요?",
    date: "2026.07.18",
    content: `
<h2>새해, 장기요양 제도의 변화를 미리 확인하세요</h2>
<p>장기요양보험은 매년 수가·본인부담·급여 한도 등이 조정됩니다. 어르신과 가족이 실제로 체감하는 부분 위주로 핵심만 정리했습니다. 정확한 최신 금액은 아래 공식 출처에서 꼭 확인하세요.</p>
<h3>1. 급여 수가와 월 한도액</h3>
<p>방문요양·방문목욕 등 재가급여의 시간당 수가와 등급별 월 이용 한도액은 매년 고시로 조정됩니다. 한도액이 오르면 같은 등급이라도 이용 가능한 서비스 시간이 늘어날 수 있습니다.</p>
<h3>2. 본인부담금 구조</h3>
<ul>
<li><strong>재가급여</strong>: 총액의 <strong>15%</strong> 본인부담</li>
<li><strong>시설급여</strong>: 총액의 <strong>20%</strong> 본인부담</li>
<li><strong>기초생활수급자</strong>: 본인부담 <strong>면제</strong>, 그 외 감경 대상은 40~60% 경감</li>
</ul>
<h3>3. 신청·판정 절차는 그대로</h3>
<p>국민건강보험공단에 인정 신청 → 방문조사 → 등급판정위원회 심의라는 큰 틀은 동일합니다. 다만 서식이나 제출 서류가 간소화되는 경우가 있으니 신청 전 공단에 확인하는 것이 좋습니다.</p>
<blockquote>제도는 매년 조금씩 바뀝니다. "작년엔 이랬는데"가 아니라, 신청·갱신 시점에 공식 안내를 다시 확인하는 습관이 손해를 막습니다.</blockquote>
<p>더비타민 재가복지센터는 제도 변경 사항을 반영해 어르신께 가장 유리한 이용 방법을 안내해 드립니다. 궁금한 점은 언제든 문의하세요.</p>
${srcLine([{ name: SRC.mohw, url: SRC.mohwUrl }, { name: SRC.ltc, url: SRC.ltcUrl }])}
`.trim(),
  },
  {
    category: "정보",
    title: "장기요양등급, 이렇게 신청하세요 (A to Z)",
    date: "2026.07.15",
    content: `
<h2>처음이라 막막한 장기요양등급 신청, 5단계로 끝</h2>
<p>부모님을 모시게 되면 가장 먼저 부딪히는 것이 "장기요양등급"입니다. 등급이 있어야 방문요양·복지용구 같은 서비스를 국가 지원으로 이용할 수 있습니다. 절차를 순서대로 알려드립니다.</p>
<h3>1단계 · 인정 신청</h3>
<p>국민건강보험공단 지사(노인장기요양보험 운영센터)에 신청합니다. 방문·우편·팩스·인터넷·모바일(The건강보험 앱) 모두 가능하며, 만 65세 이상 또는 65세 미만이라도 노인성 질병(치매·뇌혈관질환 등)이 있으면 신청할 수 있습니다.</p>
<h3>2단계 · 방문조사</h3>
<p>공단 직원이 댁으로 방문해 심신 상태(거동, 인지, 간호 필요도 등)를 조사합니다.</p>
<h3>3단계 · 의사소견서 제출</h3>
<p>의료기관에서 발급받은 의사소견서를 제출합니다(대상에 따라 생략 가능).</p>
<h3>4단계 · 등급판정</h3>
<p>등급판정위원회가 조사 결과와 소견서를 종합해 <strong>1~5등급 또는 인지지원등급</strong>을 판정합니다. 신청서 접수 후 보통 30일 이내에 결과가 나옵니다.</p>
<h3>5단계 · 표준장기요양이용계획서 확인</h3>
<p>등급이 나오면 함께 오는 이용계획서를 보고, 센터와 상담해 서비스를 시작합니다.</p>
<blockquote>서류가 부담된다면 센터가 신청 단계부터 동행·대행을 도와드릴 수 있습니다. 혼자 끙끙 앓지 마세요.</blockquote>
${srcLine([{ name: SRC.ltc, url: SRC.ltcUrl }, { name: SRC.nhis, url: SRC.nhisUrl }])}
`.trim(),
  },
  {
    category: "정보",
    title: "재가급여 6가지, 우리 어르신은 무엇을 받을 수 있을까?",
    date: "2026.07.11",
    content: `
<h2>집에서 받는 돌봄, '재가급여' 총정리</h2>
<p>재가급여는 어르신이 <strong>시설이 아닌 집에서</strong> 생활하며 받는 서비스입니다. 종류가 다양해 헷갈리기 쉬운데, 하나씩 짚어보겠습니다.</p>
<h3>재가급여의 종류</h3>
<ol>
<li><strong>방문요양</strong> — 요양보호사가 방문해 신체활동·가사·일상생활을 지원</li>
<li><strong>방문목욕</strong> — 이동식 욕조 등을 갖춘 차량으로 방문해 목욕 지원</li>
<li><strong>방문간호</strong> — 간호사 등이 의사 지시서에 따라 간호·처치 제공</li>
<li><strong>주·야간보호</strong> — 낮 동안 센터에서 돌봄·기능훈련·프로그램 제공</li>
<li><strong>단기보호</strong> — 일정 기간 시설에서 단기간 보호</li>
<li><strong>복지용구(기타 재가급여)</strong> — 전동침대·보행기 등 구입·대여 지원</li>
</ol>
<h3>어떻게 조합하나요?</h3>
<p>등급별 <strong>월 이용 한도액</strong> 안에서 여러 서비스를 조합할 수 있습니다. 예를 들어 평일 방문요양 + 주 1회 방문목욕 + 복지용구를 함께 이용하는 식입니다.</p>
<blockquote>정답은 어르신의 상태와 가족의 생활 리듬에 달려 있습니다. 조합 설계는 센터 상담이 가장 빠릅니다.</blockquote>
<p>더비타민은 어르신 상태에 맞춰 한도액을 알뜰하게 쓰는 이용 계획을 함께 짜드립니다.</p>
${srcLine([{ name: SRC.ltc, url: SRC.ltcUrl }])}
`.trim(),
  },
  {
    category: "정보",
    title: "방문요양 본인부담금, 얼마나 내나요?",
    date: "2026.07.08",
    content: `
<h2>비용이 걱정되시나요? 본인부담금의 진실</h2>
<p>"방문요양 받으면 돈이 많이 들까?" 가장 많이 받는 질문입니다. 결론부터 말하면, 대부분의 비용을 <strong>국가(장기요양보험)</strong>가 부담하고 이용자는 일부만 냅니다.</p>
<h3>재가급여 본인부담률</h3>
<ul>
<li>일반 대상자: 총 급여비용의 <strong>15%</strong></li>
<li>감경 대상(보험료 기준): <strong>6% 또는 9%</strong> 수준으로 경감</li>
<li>기초생활수급자: <strong>0원(면제)</strong></li>
</ul>
<h3>예시로 이해하기</h3>
<p>월 이용 급여비용이 100만 원이라면, 일반 대상자는 약 15만 원만 부담하고 나머지는 보험에서 지원됩니다. 감경 대상이라면 부담은 더 줄어듭니다.</p>
<h3>추가로 알아둘 점</h3>
<p>한도액을 초과해 이용한 부분은 전액 본인부담이 됩니다. 그래서 <strong>한도 안에서 계획적으로 쓰는 것</strong>이 중요합니다.</p>
<blockquote>감경 대상 여부는 건강보험료 순위로 정해집니다. 내가 감경 대상인지 모른다면 공단이나 센터에 꼭 확인하세요 — 모르면 손해입니다.</blockquote>
${srcLine([{ name: SRC.ltc, url: SRC.ltcUrl }, { name: SRC.nhis, url: SRC.nhisUrl }])}
`.trim(),
  },
  {
    category: "정보",
    title: "복지용구, 연 160만 원까지 지원받는 법",
    date: "2026.07.04",
    content: `
<h2>사는 것보다 싸게, 복지용구 급여 활용법</h2>
<p>전동침대, 보행기, 욕창예방매트리스… 어르신 돌봄에 꼭 필요한 용품들. 이걸 제값 다 주고 사고 계셨다면 손해입니다. 장기요양등급이 있으면 <strong>복지용구 급여</strong>로 지원받을 수 있습니다.</p>
<h3>연 한도와 본인부담</h3>
<p>수급자 1인당 <strong>연간 한도액(약 160만 원)</strong> 범위에서, 구입 또는 대여 방식으로 이용합니다. 본인부담은 일반적으로 <strong>15%</strong>이며 감경·수급 대상은 더 낮거나 면제됩니다.</p>
<h3>구입 품목 vs 대여 품목</h3>
<ul>
<li><strong>구입 품목</strong>: 이동변기, 목욕의자, 안전손잡이, 지팡이 등</li>
<li><strong>대여 품목</strong>: 전동·수동침대, 휠체어, 욕창예방매트리스 등</li>
<li>일부 품목은 구입·대여를 선택할 수 있습니다.</li>
</ul>
<h3>이용 방법</h3>
<p>공단에 등록된 <strong>복지용구 사업소</strong>에서 표준장기요양이용계획서를 제시하고 이용합니다. 아무 데서나 산다고 지원되는 것이 아니라는 점을 기억하세요.</p>
<blockquote>필요 없는 품목을 권하는 곳도 있습니다. 어르신 상태에 정말 맞는 품목인지 센터와 먼저 상의하세요.</blockquote>
${srcLine([{ name: SRC.ltc, url: SRC.ltcUrl }])}
`.trim(),
  },
  {
    category: "정보",
    title: "치매 어르신을 위한 '인지활동형 방문요양'",
    date: "2026.06.27",
    content: `
<h2>단순 돌봄을 넘어, 인지 기능을 지키는 방문요양</h2>
<p>치매나 경도인지장애가 있는 어르신에게는 일반 방문요양과 다른 접근이 필요합니다. 장기요양보험에는 이를 위한 <strong>인지활동형 방문요양</strong>이 마련되어 있습니다.</p>
<h3>일반 방문요양과 무엇이 다른가</h3>
<p>인지활동형은 <strong>인지자극 활동</strong>(회상 대화, 손 운동, 일상 기능 훈련 등)을 중심으로 진행됩니다. 남아 있는 기능을 최대한 유지·활용하도록 돕는 것이 목표입니다.</p>
<h3>누가 받을 수 있나요</h3>
<ul>
<li>치매가 있는 <strong>1~5등급</strong> 및 <strong>인지지원등급</strong> 어르신</li>
<li>인지지원등급은 신체 기능은 비교적 양호하지만 치매가 있는 분을 위한 등급입니다.</li>
</ul>
<h3>가족에게도 도움이 됩니다</h3>
<p>전문 교육을 받은 요양보호사가 방문하므로, 가족은 돌봄 부담을 덜고 어르신은 규칙적인 인지 자극을 받을 수 있습니다.</p>
<blockquote>치매는 "아무것도 못 한다"가 아닙니다. 남은 기능을 지키는 꾸준한 자극이 진행 속도를 늦춥니다.</blockquote>
<p>더비타민은 치매 어르신 돌봄 경험이 풍부한 요양보호사와 함께합니다.</p>
${srcLine([{ name: SRC.ltc, url: SRC.ltcUrl }, { name: SRC.mohw, url: SRC.mohwUrl }])}
`.trim(),
  },
  {
    category: "정보",
    title: "가족이 요양보호사가 되면? '가족요양' 완전 정복",
    date: "2026.06.20",
    content: `
<h2>내 부모님, 내가 직접 돌보면서 급여도 받을 수 있을까?</h2>
<p>"타인이 오는 게 부담스럽다", "내가 직접 모시고 싶다"는 가족이 많습니다. 이럴 때 활용하는 것이 <strong>가족인 요양보호사(가족요양)</strong> 제도입니다.</p>
<h3>가족요양이란</h3>
<p>가족이 <strong>요양보호사 자격</strong>을 취득한 뒤, 재가장기요양기관(센터) 소속으로 어르신(가족)에게 방문요양을 제공하는 것입니다. 요양보호사 급여를 받게 됩니다.</p>
<h3>기본 조건</h3>
<ul>
<li>돌봄 제공자가 <strong>요양보호사 국가자격</strong>을 보유</li>
<li>센터(장기요양기관)에 소속되어 정식 계약</li>
<li>어르신이 장기요양등급을 보유</li>
<li>가족요양은 <strong>1일 급여 인정 시간에 제한</strong>이 있습니다(일반 방문요양보다 짧게 인정).</li>
</ul>
<h3>이런 분께 적합합니다</h3>
<p>이미 부모님을 모시고 있고, 앞으로도 직접 돌볼 계획인 가족에게 특히 유용합니다.</p>
<blockquote>자격 취득·센터 등록·급여 인정 시간 등 챙길 것이 많습니다. 시작 전 센터 상담으로 조건을 정확히 확인하세요.</blockquote>
<p>더비타민은 가족요양 등록 절차를 처음부터 끝까지 안내해 드립니다.</p>
${srcLine([{ name: SRC.ltc, url: SRC.ltcUrl }, { name: SRC.mohw, url: SRC.mohwUrl }])}
`.trim(),
  },
  {
    category: "정보",
    title: "등급 갱신·변경, 놓치면 서비스가 끊깁니다",
    date: "2026.06.13",
    content: `
<h2>장기요양등급에도 '유효기간'이 있습니다</h2>
<p>등급을 한 번 받으면 평생 유지되는 것으로 오해하기 쉽습니다. 하지만 장기요양 인정에는 <strong>유효기간</strong>이 있어, 기간이 끝나기 전에 <strong>갱신</strong>해야 서비스가 이어집니다.</p>
<h3>갱신 신청</h3>
<p>유효기간 만료 전(보통 만료 90일 전부터) 공단에서 안내가 오며, 기한 내에 갱신 신청을 해야 합니다. 갱신 시에도 방문조사와 등급판정이 이루어집니다.</p>
<h3>등급 변경 신청</h3>
<p>어르신의 상태가 <strong>나빠지거나 좋아진 경우</strong>, 유효기간 중이라도 등급 변경을 신청할 수 있습니다.</p>
<ul>
<li>상태가 악화되어 더 많은 돌봄이 필요할 때</li>
<li>기존 등급으로는 한도액이 부족할 때</li>
</ul>
<h3>깜빡하면 생기는 일</h3>
<p>갱신을 놓쳐 인정이 만료되면, 그 기간 동안 이용한 서비스는 <strong>보험 지원을 못 받아 전액 본인부담</strong>이 될 수 있습니다.</p>
<blockquote>만료 안내문이 오면 미루지 마세요. 센터가 갱신 일정을 함께 챙겨드립니다.</blockquote>
${srcLine([{ name: SRC.ltc, url: SRC.ltcUrl }, { name: SRC.nhis, url: SRC.nhisUrl }])}
`.trim(),
  },
  {
    category: "정보",
    title: "폭염, 어르신 건강을 지키는 여름철 수칙",
    date: "2026.07.20",
    content: `
<h2>무더위, 어르신에게는 위험 신호입니다</h2>
<p>고령자는 더위를 느끼는 감각과 체온 조절 능력이 떨어져 <strong>온열질환(열사병·탈진)</strong>에 특히 취약합니다. 여름철 돌봄에서 꼭 지켜야 할 수칙을 정리했습니다.</p>
<h3>1. 수분은 목마르기 전에</h3>
<p>어르신은 갈증을 늦게 느낍니다. 물을 <strong>규칙적으로, 조금씩 자주</strong> 드시게 하세요. 커피·녹차 등 카페인 음료는 수분 배출을 늘리니 주의합니다.</p>
<h3>2. 한낮 외출은 피하기</h3>
<p>기온이 가장 높은 <strong>낮 12시~오후 5시</strong>에는 외출과 무리한 활동을 삼가세요. 부득이하면 모자·양산·헐렁한 옷을 준비합니다.</p>
<h3>3. 실내 온도 관리</h3>
<ul>
<li>냉방기를 아까워하지 마세요. 전기요금이 걱정되면 <strong>에너지 취약계층 지원</strong>을 확인해 보세요.</li>
<li>선풍기만 틀고 문을 닫으면 오히려 위험할 수 있으니 환기를 병행합니다.</li>
</ul>
<h3>4. 위험 신호 알아두기</h3>
<p>어지럼·두통·구역·의식 저하가 보이면 시원한 곳으로 옮기고 수분을 드린 뒤, 증상이 심하면 즉시 <strong>119</strong>에 연락하세요.</p>
<blockquote>혼자 계시는 시간이 많은 어르신일수록 폭염 특보일에는 안부 확인이 생명을 지킵니다.</blockquote>
<p>더비타민 방문요양은 여름철 어르신 건강 상태를 세심히 살핍니다.</p>
${srcLine([{ name: SRC.mohw, url: SRC.mohwUrl }, { name: "질병관리청 온열질환 응급대처", url: "https://www.kdca.go.kr" }])}
`.trim(),
  },
];

// ── 삽입 ────────────────────────────────────────────────────────────
async function main() {
  console.log(`총 ${posts.length}개 글 발행 시작...\n`);
  let inserted = 0;
  let skipped = 0;

  for (const [i, p] of posts.entries()) {
    // 중복 방지: 같은 제목이 이미 있으면 skip
    const { data: existing } = await supabase
      .from("notices")
      .select("id")
      .eq("title", p.title)
      .limit(1);

    if (existing && existing.length > 0) {
      console.log(`⏭️  [${i + 1}/9] 이미 존재 → 건너뜀: ${p.title}`);
      skipped++;
      continue;
    }

    const bg = BG_COLORS[i % BG_COLORS.length];

    const { error } = await supabase.from("notices").insert({
      category: p.category,
      title: p.title,
      content: p.content,
      bg,
      date: p.date,
      status: "published", // 바로 발행
    });

    if (error) {
      console.error(`❌ [${i + 1}/9] 실패: ${p.title}\n   ${error.message}`);
    } else {
      console.log(`✅ [${i + 1}/9] 발행: ${p.title}`);
      inserted++;
    }
  }

  console.log(`\n완료 — 발행 ${inserted}개, 건너뜀 ${skipped}개.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
