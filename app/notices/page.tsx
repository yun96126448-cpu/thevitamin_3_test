"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import NotionEditor from "@/components/ui/notion-editor";

const BG_COLORS = ["#f0eedc","#dce8f5","#e8dcf5","#dcf5e8","#f5e8dc","#f5dcdc"];
const DRAFT_KEY = "thevitamin_notice_draft";
const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "").split(",").map((e) => e.trim());

// 네이버 복사 CTA용 사이트 주소 — 도메인 바뀌면 이 한 줄만 수정
const SITE_URL = "https://thevitamin-3-test.vercel.app";

// 글 주제에 맞는 서비스 페이지 + 따뜻한 권유 문구 선택
function pickServiceCTA(notice: Notice): { url: string; blurb: string } {
  const text = `${notice.title} ${notice.content ?? ""}`;
  if (/복지용구/.test(text)) {
    return { url: `${SITE_URL}/welfare-equipment`, blurb: "필요한 복지용구, 부담은 덜고 편안하게. 더비타민 재가복지센터가 상담부터 따뜻하게 함께하겠습니다." };
  }
  if (/가족요양/.test(text)) {
    return { url: `${SITE_URL}/family-care`, blurb: "가족이 직접 돌보며 급여도 받는 가족요양, 더비타민 재가복지센터가 신청까지 따뜻하게 안내해드립니다." };
  }
  if (/간병/.test(text)) {
    return { url: `${SITE_URL}/caregiver`, blurb: "믿고 맡길 수 있는 간병, 더비타민 재가복지센터가 따뜻하게 연결해드립니다." };
  }
  // 기본: 방문요양(주력 서비스)
  return { url: `${SITE_URL}/visit-care`, blurb: "거동이 불편한 어르신, 집에서 편안하게 돌봄받으실 수 있도록 더비타민 재가복지센터가 따뜻하게 함께하겠습니다." };
}

// 글 내용 기반 자동 해시태그 생성 (동적 10개 + 기본 20개 = 최대 30개)
function generateHashtags(notice: Notice): string[] {
  const text = `${notice.title} ${notice.content ?? ""}`.toLowerCase();
  const dynamicTags = new Set<string>();

  // 동적 키워드 (제목/내용 분석) — 최대 10개
  const dynamicMap = [
    { keyword: /복지용구/, tags: ["복지용구", "용구지원"] },
    { keyword: /가족요양/, tags: ["가족요양", "급여", "가족요양사"] },
    { keyword: /간병/, tags: ["간병", "간병인", "간병서비스"] },
    { keyword: /방문요양/, tags: ["방문요양", "방문서비스", "돌봄"] },
    { keyword: /(노인|어르신)/, tags: ["노인돌봄", "노인복지"] },
    { keyword: /건강/, tags: ["건강정보", "건강"] },
    { keyword: /지원금|지원|급여/, tags: ["지원금", "급여안내"] },
    { keyword: /신청|접수|모집/, tags: ["신청안내", "모집공고"] },
  ];

  dynamicMap.forEach(({ keyword, tags: tagList }) => {
    if (keyword.test(text)) {
      tagList.forEach((tag) => {
        if (dynamicTags.size < 10) dynamicTags.add(tag);
      });
    }
  });

  // 재가복지 기본 키워드 20개 (항상 포함)
  const baseTags = [
    "재가복지",
    "재가복지센터",
    "목포",
    "광주",
    "비타민",
    "더비타민",
    "방문요양",
    "간병",
    "가족요양",
    "복지용구",
    "돌봄서비스",
    "요양보호사",
    "간병인",
    "가족요양사",
    "노인복지",
    "장기요양보험",
    "신청안내",
    "장애인복지",
    "재가서비스",
    "요양시설",
  ];

  const allTags = Array.from(dynamicTags).concat(baseTags);
  const uniqueTags = Array.from(new Set(allTags)); // 중복 제거

  return uniqueTags.slice(0, 30); // 최대 30개
}

type Notice = { id: number; category: string; title: string; date: string; bg: string; thumbnail?: string; content?: string; author_email?: string; status?: string };
type FormState = { category: string; title: string; content: string; bgImage: string; repImage: string };

const EMPTY_FORM: FormState = { category: "공지", title: "", content: "", bgImage: "", repImage: "" };

function isBgImageUrl(val: string) {
  return val.startsWith("data:") || val.startsWith("http") || val.startsWith("/");
}

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "이미지 업로드에 실패했습니다.");
  return data.url as string;
}

const MOBILE_PAGE_SIZE = 6;
const DESKTOP_PAGE_SIZE = 9;

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}


export default function NoticesPage() {
  const { data: session } = useSession();
  const isAdmin = ADMIN_EMAILS.includes(session?.user?.email ?? "");

  const [notices, setNotices] = useState<Notice[]>([]);
  const [pendingDrafts, setPendingDrafts] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const bgImageRef = useRef<HTMLInputElement>(null);
  const repImageRef = useRef<HTMLInputElement>(null);

  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [draftVersion, setDraftVersion] = useState(0);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [uploadingRep, setUploadingRep] = useState(false);

  useEffect(() => {
    fetch("/api/notices")
      .then((r) => r.json())
      .then((data) => { setNotices(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const fetchPendingDrafts = () => {
    fetch("/api/notices?pending=1")
      .then((r) => r.json())
      .then((data) => setPendingDrafts(Array.isArray(data) ? data : []))
      .catch(() => {});
  };

  useEffect(() => {
    if (isAdmin) fetchPendingDrafts();
  }, [isAdmin]);

  const copyForNaver = async (notice: Notice) => {
    // 네이버 에디터는 외부 CSS/클래스는 걸러내지만 인라인 style은 대부분 유지함.
    // 그래서 각 요소에 style을 직접 박아 서식·검정 글자색이 붙여넣기 후에도 남게 함.
    const BLANK = '<p style="color:#000000;">&nbsp;</p>'; // 실제 빈 줄 (네이버는 마진을 씹으므로 빈 문단으로 띄움)

    let styled = (notice.content ?? "")
      .replace(/<img[^>]*>/gi, "") // 이미지 태그 제거
      .replace(/<h2(\s[^>]*)?>/gi, '<h2 style="font-size:24px;font-weight:800;color:#000000;line-height:1.4;margin:28px 0 14px;">')
      .replace(/<h3(\s[^>]*)?>/gi, '<h3 style="font-size:19px;font-weight:700;color:#000000;line-height:1.4;margin:24px 0 10px;">')
      .replace(/<p(\s[^>]*)?>/gi, '<p style="font-size:16px;color:#000000;line-height:1.9;margin:0 0 16px;">')
      .replace(/<ul(\s[^>]*)?>/gi, '<ul style="margin:8px 0 18px;padding-left:22px;color:#000000;">')
      .replace(/<ol(\s[^>]*)?>/gi, '<ol style="margin:8px 0 18px;padding-left:22px;color:#000000;">')
      .replace(/<li(\s[^>]*)?>/gi, '<li style="font-size:16px;color:#000000;line-height:1.8;margin-bottom:8px;">')
      .replace(/<strong(\s[^>]*)?>/gi, '<strong style="font-weight:700;color:#000000;">')
      .replace(/<em(\s[^>]*)?>/gi, '<em style="color:#000000;">')
      .replace(/<blockquote(\s[^>]*)?>/gi, '<blockquote style="border-left:4px solid #1F6B2A;background:#f2f8f3;padding:14px 20px;margin:22px 0;color:#000000;font-size:16px;line-height:1.8;">')
      .replace(/<a(\s[^>]*)?>/gi, '<a style="color:#1F6B2A;">');

    // 빈 줄 삽입: 대제목(h2) 위 2줄·아래 1줄, 소제목(h3) 위 1줄
    styled = styled
      .replace(/<h2 /g, `${BLANK}${BLANK}<h2 `)
      .replace(/(<\/h2>)/g, `$1${BLANK}`)
      .replace(/<h3 /g, `${BLANK}<h3 `);

    // 출처 문단 위 3줄
    styled = styled.replace(/(<p style="[^"]*">\s*출처)/, `${BLANK}${BLANK}${BLANK}$1`);

    // 자동 생성 해시태그
    const hashtags = generateHashtags(notice);
    const tagsHtml = `${BLANK}<p style="font-size:16px;color:#1F6B2A;line-height:1.9;margin:0;">${hashtags.map((tag) => `#${tag}`).join(" ")}</p>`;

    // 맨 아래 홈페이지 CTA (글 주제에 맞는 서비스 페이지로 연결)
    const cta = pickServiceCTA(notice);
    const ctaHtml = `${BLANK}${BLANK}<p style="font-size:16px;color:#000000;line-height:1.9;background:#f2f8f3;border:1px solid #cfe6d5;border-radius:12px;padding:18px 20px;margin:0;">${cta.blurb}<br><a href="${cta.url}" style="color:#1F6B2A;font-weight:700;">▶ 더비타민 재가복지센터 홈페이지에서 상담·신청하기</a></p>`;

    const titleHtml = `<p style="font-size:26px;font-weight:800;color:#000000;line-height:1.4;margin:0 0 20px;">${notice.title}</p>`;
    const html = `<div style="color:#000000;font-family:'맑은 고딕','Malgun Gothic',sans-serif;">${titleHtml}${styled}${tagsHtml}${ctaHtml}</div>`;

    // 서식 없는 순수 텍스트 대체본 (에디터가 HTML 못 받을 때 대비)
    const tagsPlain = hashtags.map((tag) => `#${tag}`).join(" ");
    const plain = `${notice.title}\n\n${(notice.content ?? "").replace(/<[^>]+>/g, "").replace(/\n{3,}/g, "\n\n").trim()}\n\n${tagsPlain}\n\n\n${cta.blurb}\n▶ 더비타민 재가복지센터 홈페이지에서 상담·신청하기: ${cta.url}`;

    try {
      if (navigator.clipboard && "write" in navigator.clipboard && typeof ClipboardItem !== "undefined") {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([plain], { type: "text/plain" }),
          }),
        ]);
      } else {
        await navigator.clipboard.writeText(plain);
      }
      showToast("네이버용으로 복사됨! 블로그 글쓰기 창에 붙여넣기(Ctrl+V) 하세요.");
    } catch {
      showToast("복사 실패 — 브라우저 권한을 확인해주세요.");
    }
  };

  const handleReview = async (notice: Notice, action: "publish" | "reject") => {
    try {
      if (action === "publish") {
        const res = await fetch("/api/notices", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: notice.id, status: "published" }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          showToast(err?.error ?? "게시 승인에 실패했습니다.");
          return;
        }
        showToast("게시되었습니다!");
        const updated = await fetch("/api/notices").then((r) => r.json());
        if (Array.isArray(updated)) setNotices(updated);
      } else {
        const res = await fetch("/api/notices", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: notice.id }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          showToast(err?.error ?? "반려에 실패했습니다.");
          return;
        }
        showToast("초안을 삭제했습니다.");
      }
      setSelectedNotice(null);
      fetchPendingDrafts();
    } catch {
      showToast("네트워크 오류로 처리하지 못했습니다.");
    }
  };

  useEffect(() => {
    setHasDraft(!!localStorage.getItem(DRAFT_KEY));
  }, []);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile((prev) => { if (prev !== mobile) setPage(0); return mobile; });
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const pageSize = isMobile ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(notices.length / pageSize));
  const current = notices.slice(page * pageSize, (page + 1) * pageSize);

  const handlePage = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openModal = () => {
    setEditingNotice(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setDraftVersion((v) => v + 1); // 이전 작성 중이던 내용이 에디터에 남지 않도록 리마운트
    setShowModal(true);
  };

  const openEditModal = (notice: Notice) => {
    setEditingNotice(notice);
    setForm({
      category: notice.category,
      title: notice.title,
      content: notice.content ?? "",
      bgImage: isBgImageUrl(notice.bg) ? notice.bg : "",
      repImage: notice.thumbnail ?? "",
    });
    setFormError("");
    setSelectedNotice(null);
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingNotice(null); };

  const handleDelete = async (notice: Notice) => {
    if (!window.confirm(`"${notice.title}" 공지를 삭제할까요?\n삭제하면 복구할 수 없습니다.`)) return;
    try {
      const res = await fetch("/api/notices", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: notice.id }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        showToast(err?.error ?? "삭제에 실패했습니다.");
        return;
      }
      setNotices((prev) => prev.filter((n) => n.id !== notice.id));
      setSelectedNotice(null);
      showToast("공지가 삭제되었습니다.");
    } catch {
      showToast("네트워크 오류로 삭제에 실패했습니다.");
    }
  };

  const loadDraft = () => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;
    try {
      const saved = JSON.parse(raw) as FormState;
      setForm(saved);
      setFormError("");
      setDraftVersion((v) => v + 1); // 노션 에디터를 리마운트시켜 불러온 본문을 반영
    } catch {
      // 손상된 임시저장 무시
    }
  };

  const saveDraft = () => {
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      setHasDraft(true);
      showToast("임시저장 완료!");
    } catch {
      showToast("임시저장 실패 (사진 용량이 너무 클 수 있어요)");
    }
  };

  const extractFirstImage = (html: string): string | undefined => {
    const match = html.match(/<img[^>]+src="([^"]+)"/);
    return match?.[1];
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) { setFormError("제목을 입력해주세요."); return; }

    setSubmitting(true);
    const thumbnail = extractFirstImage(form.content);

    try {
      if (editingNotice) {
        const bg = form.bgImage || (isBgImageUrl(editingNotice.bg) ? "" : editingNotice.bg) || BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)];
        // 수정
        const res = await fetch("/api/notices", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingNotice.id,
            category: form.category,
            title: form.title.trim(),
            content: form.content || null,
            thumbnail: form.repImage || null,
            bg,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => null);
          setFormError(err?.error ?? "수정에 실패했습니다.");
          return;
        }

        const updated = await res.json();
        setNotices((prev) => prev.map((n) => n.id === updated.id ? updated : n));
        setShowModal(false);
        setEditingNotice(null);
        showToast("공지가 수정되었습니다!");
      } else {
        // 새 글 등록
        const bg = form.bgImage || BG_COLORS[Math.floor(Math.random() * BG_COLORS.length)];

        const res = await fetch("/api/notices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category: form.category,
            title: form.title.trim(),
            content: form.content || null,
            thumbnail: form.repImage || thumbnail || null,
            bg,
            date: todayStr(),
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => null);
          setFormError(err?.error ?? "등록에 실패했습니다.");
          return;
        }

        const newNotice = await res.json();
        setNotices((prev) => [newNotice, ...prev]);
        localStorage.removeItem(DRAFT_KEY);
        setHasDraft(false);
        setPage(0);
        setShowModal(false);
        showToast("공지가 등록되었습니다!");
      }
    } catch {
      setFormError("네트워크 오류로 처리하지 못했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh" }}>

      {/* 히어로 헤더 */}
      <div
        className="hero-section"
        style={{
          background: "linear-gradient(to bottom, #1F6B2A 0%, #4a9e28 40%, #ffffff 100%)",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div className="hero-inner" style={{ maxWidth: "1120px", margin: "0 auto", padding: "0 40px", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div className="hero-text">
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="hero-title"
              style={{ fontWeight: 900, color: "#ffffff", lineHeight: 1.05, marginBottom: "20px", letterSpacing: 0 }}
            >
              공지사항
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15, ease: "easeOut" }}
              className="hero-subtitle"
              style={{ color: "rgba(255,255,255,0.75)", lineHeight: 1.6 }}
            >
              <span className="hero-subtitle-pc">더비타민의 최신 소식을 확인하세요.</span>
              <span className="hero-subtitle-mobile">더비타민 재가복지센터의 최신 소식을 확인하세요.</span>
            </motion.p>
          </div>
          <motion.img
            src="/notice-hero-nukki.png"
            alt=""
            aria-hidden="true"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: "easeOut" }}
            className="hero-img"
            style={{ objectFit: "contain", flexShrink: 0 }}
          />
        </div>
      </div>

      {/* 카드 그리드 */}
      <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "56px 32px 96px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ fontSize: "20px", fontWeight: 700, color: "#191f28", margin: 0 }}
          >
            요즘 더비타민 소식
          </motion.h2>
          {isAdmin && (
            <div style={{ display: "flex", gap: "8px" }}>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.05, ease: "easeOut" }}
                onClick={async () => {
                  showToast("AI 글 생성 중... (1~2분 소요)");
                  try {
                    const res = await fetch("/api/auto-post");
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error);
                    if (data.status === "draft") {
                      showToast(`초안 생성 완료! "${data.title}" — 검토 대기 목록에서 승인해주세요.`);
                      fetchPendingDrafts();
                    } else {
                      showToast(data.error ?? "발행할 자료를 찾지 못했습니다.");
                    }
                  } catch (e) {
                    showToast(`실패: ${e instanceof Error ? e.message : "오류"}`);
                  }
                }}
                style={{
                  height: "44px",
                  padding: "0 20px",
                  borderRadius: "22px",
                  border: "1.5px solid #1F6B2A",
                  background: "#ffffff",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#1F6B2A",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: "16px", lineHeight: 1 }}>🤖</span>
                AI 글 생성
              </motion.button>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                onClick={openModal}
                style={{
                  height: "44px",
                  padding: "0 20px",
                  borderRadius: "22px",
                  border: "none",
                  background: "#1F6B2A",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#ffffff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  flexShrink: 0,
                }}
              >
                <span style={{ fontSize: "16px", lineHeight: 1 }}>✏️</span>
                글쓰기
              </motion.button>
            </div>
          )}
        </div>

        {isAdmin && pendingDrafts.length > 0 && (
          <div style={{ marginBottom: "32px", background: "#fffbea", border: "1.5px solid #f0d876", borderRadius: "16px", padding: "16px 20px" }}>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "#7a5f00", margin: "0 0 10px" }}>
              🕘 검토 대기 중인 AI 초안 ({pendingDrafts.length})
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {pendingDrafts.map((d) => (
                <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", background: "#ffffff", borderRadius: "10px", padding: "10px 14px" }}>
                  <span
                    onClick={() => setSelectedNotice(d)}
                    style={{ fontSize: "14px", fontWeight: 600, color: "#191f28", cursor: "pointer", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  >
                    [{d.category}] {d.title}
                  </span>
                  <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                    <button
                      onClick={() => copyForNaver(d)}
                      style={{ height: "32px", padding: "0 14px", borderRadius: "16px", border: "1px solid #03c75a", background: "#ffffff", color: "#03c75a", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                    >
                      📋 네이버용 복사
                    </button>
                    <button
                      onClick={() => handleReview(d, "publish")}
                      style={{ height: "32px", padding: "0 14px", borderRadius: "16px", border: "none", background: "#1F6B2A", color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                    >
                      승인·게시
                    </button>
                    <button
                      onClick={() => handleReview(d, "reject")}
                      style={{ height: "32px", padding: "0 14px", borderRadius: "16px", border: "1px solid #e5e8eb", background: "#ffffff", color: "#8b95a1", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                    >
                      반려
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#8b95a1", fontSize: "15px" }}>
            불러오는 중...
          </div>
        ) : null}

        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="notices-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}
          >
            {current.map((notice, i) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: "easeOut" }}
                whileHover={{ y: -4, boxShadow: "0 8px 28px rgba(0,0,0,0.12)" }}
                onClick={() => setSelectedNotice(notice)}
                style={{
                  background: "#ffffff",
                  borderRadius: "20px",
                  overflow: "hidden",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
                  transition: "box-shadow 150ms ease",
                }}
              >
                <div style={{
                  position: "relative", height: "200px", flexShrink: 0, overflow: "hidden",
                  ...(isBgImageUrl(notice.bg)
                    ? { backgroundImage: `url(${notice.bg})`, backgroundSize: "cover", backgroundPosition: "center" }
                    : { background: notice.bg }),
                }}>
                  {notice.thumbnail && (
                    <img src={notice.thumbnail} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 55%, #ffffff 100%)", pointerEvents: "none" }} />
                </div>
                <div style={{ padding: "4px 20px 24px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: 500, color: "#8b95a1", lineHeight: 1.6 }}>{notice.category}</span>
                    <div style={{ width: "1px", height: "10px", background: "#b0b8c1", flexShrink: 0 }} />
                    <span style={{ fontSize: "12px", fontWeight: 500, color: "#8b95a1", lineHeight: 1.6 }}>더비타민</span>
                  </div>
                  <p style={{ fontSize: "17px", fontWeight: 700, color: "#191f28", lineHeight: 1.6, marginBottom: "8px", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {notice.title}
                  </p>
                  <p style={{ fontSize: "12px", fontWeight: 500, color: "#8b95a1", lineHeight: 1.6 }}>{notice.date}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* 페이지네이션 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginTop: "56px" }}>
          <button
            onClick={() => handlePage(page - 1)}
            disabled={page === 0}
            style={{ height: "44px", padding: "0 24px", borderRadius: "22px", border: "1px solid #e5e8eb", background: "#ffffff", fontSize: "14px", fontWeight: 500, color: page === 0 ? "#b0b8c1" : "#191f28", cursor: page === 0 ? "not-allowed" : "pointer", transition: "all 150ms ease" }}
          >
            이전
          </button>
          <span style={{ fontSize: "14px", fontWeight: 500, color: "#8b95a1" }}>{page + 1} / {totalPages}</span>
          <button
            onClick={() => handlePage(page + 1)}
            disabled={page === totalPages - 1}
            style={{ height: "44px", padding: "0 24px", borderRadius: "22px", border: "none", background: page === totalPages - 1 ? "#e5e8eb" : "#1F6B2A", fontSize: "14px", fontWeight: 500, color: page === totalPages - 1 ? "#b0b8c1" : "#ffffff", cursor: page === totalPages - 1 ? "not-allowed" : "pointer", transition: "all 150ms ease" }}
          >
            다음
          </button>
        </div>
      </div>

      {/* 공지사항 상세 모달 */}
      <AnimatePresence>
        {selectedNotice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedNotice(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "#ffffff", borderRadius: "24px", width: "100%", maxWidth: "560px", maxHeight: "85vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}
            >
              {/* 썸네일 이미지 영역 */}
              <div style={{
                position: "relative", height: "240px", flexShrink: 0, overflow: "hidden",
                ...(isBgImageUrl(selectedNotice.bg)
                  ? { backgroundImage: `url(${selectedNotice.bg})`, backgroundSize: "cover", backgroundPosition: "center" }
                  : { background: selectedNotice.bg }),
              }}>
                {selectedNotice.thumbnail && (
                  <img src={selectedNotice.thumbnail} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                )}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.18) 100%)", pointerEvents: "none" }} />
                <div style={{ position: "absolute", top: "16px", right: "16px", display: "flex", gap: "8px" }}>
                  {isAdmin && selectedNotice.status === "draft" ? (
                    <>
                      <button
                        onClick={() => copyForNaver(selectedNotice)}
                        style={{ height: "36px", padding: "0 14px", borderRadius: "18px", border: "none", background: "#03c75a", color: "#ffffff", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                      >
                        📋 네이버용 복사
                      </button>
                      <button
                        onClick={() => handleReview(selectedNotice, "publish")}
                        style={{ height: "36px", padding: "0 14px", borderRadius: "18px", border: "none", background: "rgba(31,107,42,0.9)", color: "#ffffff", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                      >
                        승인·게시
                      </button>
                      <button
                        onClick={() => handleReview(selectedNotice, "reject")}
                        style={{ height: "36px", padding: "0 14px", borderRadius: "18px", border: "none", background: "rgba(220,38,38,0.75)", color: "#ffffff", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                      >
                        반려
                      </button>
                    </>
                  ) : (
                    <>
                      {isAdmin && (
                        <button
                          onClick={() => copyForNaver(selectedNotice)}
                          style={{ height: "36px", padding: "0 14px", borderRadius: "18px", border: "none", background: "#03c75a", color: "#ffffff", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                        >
                          📋 네이버용 복사
                        </button>
                      )}
                      {session?.user?.email && session.user.email === selectedNotice.author_email && (
                        <button
                          onClick={() => openEditModal(selectedNotice)}
                          style={{ height: "36px", padding: "0 14px", borderRadius: "18px", border: "none", background: "rgba(0,0,0,0.4)", color: "#ffffff", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                        >
                          수정
                        </button>
                      )}
                      {isAdmin && (
                        <button
                          onClick={() => handleDelete(selectedNotice)}
                          style={{ height: "36px", padding: "0 14px", borderRadius: "18px", border: "none", background: "rgba(220,38,38,0.75)", color: "#ffffff", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                        >
                          삭제
                        </button>
                      )}
                    </>
                  )}
                  <button
                    onClick={() => setSelectedNotice(null)}
                    style={{ width: "36px", height: "36px", borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.4)", color: "#ffffff", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* 내용 */}
              <div style={{ padding: "28px 32px 32px", overflowY: "auto", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#1F6B2A", background: "#f0f7f0", padding: "3px 10px", borderRadius: "20px" }}>{selectedNotice.category}</span>
                  <span style={{ fontSize: "12px", color: "#8b95a1", marginLeft: "4px" }}>{selectedNotice.date}</span>
                </div>
                <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#191f28", lineHeight: 1.5, marginBottom: "20px", margin: "0 0 20px" }}>
                  {selectedNotice.title}
                </h2>
                {selectedNotice.content ? (
                  <div
                    className="notice-detail-content"
                    dangerouslySetInnerHTML={{ __html: selectedNotice.content }}
                  />
                ) : (
                  <p style={{ fontSize: "14px", color: "#b0b8c1", lineHeight: 1.8, margin: 0 }}>
                    내용이 없습니다.
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 글쓰기 모달 */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "#ffffff", borderRadius: "24px", width: "100%", maxWidth: "560px", maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 24px 64px rgba(0,0,0,0.18)" }}
            >
              {/* 모달 헤더 */}
              <div style={{ padding: "28px 32px 0", flexShrink: 0 }}>
                <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#191f28", margin: 0 }}>{editingNotice ? "공지사항 수정" : "공지사항 글쓰기"}</h3>
              </div>

              {/* 임시저장 불러오기 배너 */}
              <AnimatePresence>
                {hasDraft && !editingNotice && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: "hidden", flexShrink: 0 }}
                  >
                    <div style={{ margin: "16px 32px 0", background: "#f0f7f0", borderRadius: "12px", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 500, color: "#2d7a3a" }}>저장된 임시글이 있어요.</span>
                      <button
                        onClick={loadDraft}
                        style={{ height: "32px", padding: "0 14px", borderRadius: "16px", border: "none", background: "#1F6B2A", fontSize: "13px", fontWeight: 600, color: "#ffffff", cursor: "pointer", flexShrink: 0 }}
                      >
                        불러오기
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 스크롤 영역 */}
              <div style={{ padding: "20px 32px 0", overflowY: "auto", flex: 1 }}>

                {/* 카테고리 */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#8b95a1", marginBottom: "8px" }}>카테고리</label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    {["공지", "서비스", "정보"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setForm((f) => ({ ...f, category: cat }))}
                        style={{ height: "38px", padding: "0 20px", borderRadius: "19px", border: form.category === cat ? "none" : "1px solid #e5e8eb", background: form.category === cat ? "#1F6B2A" : "#ffffff", fontSize: "14px", fontWeight: 600, color: form.category === cat ? "#ffffff" : "#8b95a1", cursor: "pointer", transition: "all 150ms ease" }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 제목 */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#8b95a1", marginBottom: "8px" }}>
                    제목 <span style={{ color: "#e53e3e" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="제목을 입력하세요"
                    value={form.title}
                    onChange={(e) => { setForm((f) => ({ ...f, title: e.target.value })); setFormError(""); }}
                    style={{ width: "100%", height: "48px", borderRadius: "12px", border: formError ? "1.5px solid #e53e3e" : "1.5px solid #e5e8eb", padding: "0 16px", fontSize: "15px", color: "#191f28", outline: "none", boxSizing: "border-box" }}
                    onFocus={(e) => { if (!formError) e.target.style.border = "1.5px solid #1F6B2A"; }}
                    onBlur={(e) => { if (!formError) e.target.style.border = "1.5px solid #e5e8eb"; }}
                  />
                  {formError && <p style={{ fontSize: "13px", color: "#e53e3e", marginTop: "6px", marginBottom: 0 }}>{formError}</p>}
                </div>

                {/* 배경 이미지 */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#8b95a1", marginBottom: "8px" }}>배경 이미지 <span style={{ fontWeight: 400, color: "#b0b8c1" }}>— 카드 전체 배경에 표시</span></label>
                  <input ref={bgImageRef} type="file" accept="image/*" style={{ display: "none" }} onChange={async (e) => {
                    const f = e.target.files?.[0];
                    e.target.value = "";
                    if (!f) return;
                    setUploadingBg(true);
                    try {
                      const url = await uploadImage(f);
                      setForm((prev) => ({ ...prev, bgImage: url }));
                    } catch (err) {
                      showToast(err instanceof Error ? err.message : "이미지 업로드에 실패했습니다.");
                    } finally {
                      setUploadingBg(false);
                    }
                  }} />
                  {uploadingBg ? (
                    <div style={{ width: "100%", height: "120px", borderRadius: "12px", background: "#fafbfc", border: "1.5px dashed #d0d7de", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", color: "#8b95a1" }}>
                      업로드 중...
                    </div>
                  ) : form.bgImage ? (
                    <div style={{ position: "relative", width: "100%", height: "120px", borderRadius: "12px", overflow: "hidden" }}>
                      <img src={form.bgImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <button onClick={() => setForm((f) => ({ ...f, bgImage: "" }))} style={{ position: "absolute", top: "8px", right: "8px", width: "26px", height: "26px", borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                    </div>
                  ) : (
                    <button onClick={() => bgImageRef.current?.click()} style={{ width: "100%", height: "56px", borderRadius: "12px", border: "1.5px dashed #d0d7de", background: "#fafbfc", fontSize: "14px", fontWeight: 500, color: "#8b95a1", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.border = "1.5px dashed #1F6B2A"; (e.currentTarget as HTMLButtonElement).style.background = "#f0f7f0"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.border = "1.5px dashed #d0d7de"; (e.currentTarget as HTMLButtonElement).style.background = "#fafbfc"; }}>
                      <span style={{ fontSize: "18px" }}>🖼️</span> 배경 이미지 선택
                    </button>
                  )}
                </div>

                {/* 대표 이미지 */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#8b95a1", marginBottom: "8px" }}>대표 이미지 <span style={{ fontWeight: 400, color: "#b0b8c1" }}>— 배경 위에 작게 표시</span></label>
                  <input ref={repImageRef} type="file" accept="image/*" style={{ display: "none" }} onChange={async (e) => {
                    const f = e.target.files?.[0];
                    e.target.value = "";
                    if (!f) return;
                    setUploadingRep(true);
                    try {
                      const url = await uploadImage(f);
                      setForm((prev) => ({ ...prev, repImage: url }));
                    } catch (err) {
                      showToast(err instanceof Error ? err.message : "이미지 업로드에 실패했습니다.");
                    } finally {
                      setUploadingRep(false);
                    }
                  }} />
                  {uploadingRep ? (
                    <div style={{ width: "110px", height: "110px", borderRadius: "12px", background: "#fafbfc", border: "1.5px dashed #d0d7de", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", color: "#8b95a1" }}>
                      업로드 중...
                    </div>
                  ) : form.repImage ? (
                    <div style={{ position: "relative", display: "inline-block" }}>
                      <img src={form.repImage} alt="" style={{ width: "110px", height: "110px", objectFit: "cover", borderRadius: "12px", border: "2px solid #e5e8eb", display: "block" }} />
                      <button onClick={() => setForm((f) => ({ ...f, repImage: "" }))} style={{ position: "absolute", top: "6px", right: "6px", width: "22px", height: "22px", borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.55)", color: "#fff", fontSize: "12px", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                    </div>
                  ) : (
                    <button onClick={() => repImageRef.current?.click()} style={{ width: "100%", height: "56px", borderRadius: "12px", border: "1.5px dashed #d0d7de", background: "#fafbfc", fontSize: "14px", fontWeight: 500, color: "#8b95a1", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.border = "1.5px dashed #1F6B2A"; (e.currentTarget as HTMLButtonElement).style.background = "#f0f7f0"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.border = "1.5px dashed #d0d7de"; (e.currentTarget as HTMLButtonElement).style.background = "#fafbfc"; }}>
                      <span style={{ fontSize: "18px" }}>📷</span> 대표 이미지 선택
                    </button>
                  )}
                </div>

                {/* 내용 — 노션 에디터 */}
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#8b95a1", marginBottom: "8px" }}>
                    내용 <span style={{ fontWeight: 400, color: "#b0b8c1" }}>— 툴바에서 🖼 사진 버튼으로 원하는 위치에 사진 삽입</span>
                  </label>
                  <NotionEditor
                    key={editingNotice ? `edit-${editingNotice.id}` : `new-${draftVersion}`}
                    initialContent={form.content}
                    onChange={(html) => setForm((f) => ({ ...f, content: html }))}
                  />
                </div>
              </div>

              {/* 모달 하단 버튼 */}
              <div style={{ padding: "20px 32px 28px", borderTop: "1px solid #f2f4f6", display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
                <button
                  onClick={saveDraft}
                  style={{ height: "48px", padding: "0 20px", borderRadius: "24px", border: "1.5px solid #1F6B2A", background: "#ffffff", fontSize: "14px", fontWeight: 600, color: "#1F6B2A", cursor: "pointer" }}
                >
                  임시저장
                </button>
                <div style={{ flex: 1 }} />
                <button
                  onClick={closeModal}
                  style={{ height: "48px", padding: "0 22px", borderRadius: "24px", border: "1px solid #e5e8eb", background: "#ffffff", fontSize: "14px", fontWeight: 600, color: "#8b95a1", cursor: "pointer" }}
                >
                  취소
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{ height: "48px", padding: "0 28px", borderRadius: "24px", border: "none", background: submitting ? "#8b95a1" : "#1F6B2A", fontSize: "14px", fontWeight: 700, color: "#ffffff", cursor: submitting ? "not-allowed" : "pointer" }}
                >
                  {submitting ? (editingNotice ? "수정 중..." : "등록 중...") : (editingNotice ? "수정하기" : "등록하기")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 임시저장 토스트 */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            style={{ position: "fixed", bottom: "32px", left: "50%", transform: "translateX(-50%)", background: "#191f28", color: "#ffffff", fontSize: "14px", fontWeight: 600, padding: "12px 24px", borderRadius: "24px", zIndex: 2000, whiteSpace: "nowrap", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .hero-subtitle-mobile { display: none; }
        .hero-subtitle-pc { display: inline; }

        .hero-section { height: 480px; }
        .hero-inner { flex-direction: row; }
        .hero-text { text-align: left; }
        .hero-title { font-size: 72px; }
        .hero-subtitle { font-size: 20px; }
        .hero-img { height: 460px; width: auto; }

        @media (max-width: 768px) {
          .hero-section { height: auto; min-height: 560px; }
          .hero-inner { flex-direction: column-reverse; padding: 0 !important; align-items: center; }
          .hero-text { text-align: center; padding: 4px 24px 56px; }
          .hero-title { font-size: 48px; }
          .hero-subtitle { font-size: 16px; }
          .hero-subtitle-pc { display: none; }
          .hero-subtitle-mobile { display: inline; }
          .hero-img { height: auto; width: 100%; max-height: 340px; object-fit: contain; padding-top: 0; margin-top: -16px; }
          .notices-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }

        @media (max-width: 480px) {
          .notices-grid { grid-template-columns: repeat(1, 1fr) !important; }
        }

        .notice-detail-content { font-size: 15px; color: #3d4451; line-height: 1.8; }
        .notice-detail-content p { margin: 0 0 10px; }
        .notice-detail-content h1 { font-size: 22px; font-weight: 800; color: #191f28; margin: 18px 0 8px; line-height: 1.3; }
        .notice-detail-content h2 { font-size: 18px; font-weight: 700; color: #191f28; margin: 16px 0 6px; line-height: 1.3; }
        .notice-detail-content h3 { font-size: 16px; font-weight: 700; color: #191f28; margin: 14px 0 6px; line-height: 1.3; }
        .notice-detail-content ul { padding-left: 20px; margin: 4px 0 10px; }
        .notice-detail-content ol { padding-left: 20px; margin: 4px 0 10px; }
        .notice-detail-content li { margin-bottom: 4px; }
        .notice-detail-content blockquote { border-left: 3px solid #1F6B2A; padding: 4px 0 4px 16px; margin: 10px 0; color: #666; font-style: italic; }
        .notice-detail-content hr { border: none; border-top: 1.5px solid #e5e8eb; margin: 18px 0; }
        .notice-detail-content img { max-width: 100%; border-radius: 10px; margin: 14px 0; display: block; }
        .notice-detail-content strong { font-weight: 700; }
        .notice-detail-content em { font-style: italic; }
        .notice-detail-content s { text-decoration: line-through; }
        .notice-detail-content u { text-decoration: underline; }
      `}</style>
    </div>
  );
}
