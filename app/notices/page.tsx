"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const notices = [
  { id: 1,  category: "공지",   title: "2025년 장기요양보험 급여비용 변경 안내",          date: "2025.01.15", bg: "#f0eedc" },
  { id: 2,  category: "공지",   title: "설 연휴 기간(1/28~2/2) 운영 안내",               date: "2025.01.10", bg: "#dce8f5" },
  { id: 3,  category: "서비스", title: "복지용구 신규 품목 추가 안내 (전동보조기기)",      date: "2025.01.05", bg: "#e8dcf5" },
  { id: 4,  category: "공지",   title: "요양보호사 추가 모집 안내",                        date: "2024.12.20", bg: "#dcf5e8" },
  { id: 5,  category: "서비스", title: "치매 가족 지원 프로그램 운영 안내",               date: "2024.12.10", bg: "#f5e8dc" },
  { id: 6,  category: "공지",   title: "개인정보 처리방침 개정 안내",                      date: "2024.11.30", bg: "#f5dcdc" },
  { id: 7,  category: "공지",   title: "2024년 장기요양보험 급여비용 변경 안내",          date: "2024.11.10", bg: "#dce8f5" },
  { id: 8,  category: "공지",   title: "추석 연휴 기간(9/14~9/18) 운영 안내",            date: "2024.10.05", bg: "#f0eedc" },
  { id: 9,  category: "서비스", title: "방문목욕 서비스 신규 지역 확대 안내",             date: "2024.09.20", bg: "#dcf5e8" },
  { id: 10, category: "공지",   title: "요양보호사 교육 일정 변경 안내",                  date: "2024.09.01", bg: "#e8dcf5" },
  { id: 11, category: "서비스", title: "가족요양 서비스 이용 조건 개선 안내",             date: "2024.08.15", bg: "#f5e8dc" },
  { id: 12, category: "공지",   title: "센터 이전 및 새 연락처 안내",                     date: "2024.08.01", bg: "#f5dcdc" },
  { id: 13, category: "공지",   title: "2024년 하반기 장기요양 등급 신청 안내",           date: "2024.07.20", bg: "#f0eedc" },
  { id: 14, category: "서비스", title: "인지활동형 방문요양 서비스 신규 도입 안내",       date: "2024.07.05", bg: "#dce8f5" },
  { id: 15, category: "공지",   title: "요양보호사 처우 개선 급여 지급 안내",             date: "2024.06.20", bg: "#e8dcf5" },
  { id: 16, category: "서비스", title: "복지용구 대여 품목 확대 안내",                    date: "2024.06.01", bg: "#dcf5e8" },
  { id: 17, category: "공지",   title: "개인정보 처리방침 개정 안내 (2024년)",            date: "2024.05.15", bg: "#f5e8dc" },
  { id: 18, category: "공지",   title: "더비타민 재가복지센터 서비스 지역 확대 안내",     date: "2024.05.01", bg: "#f5dcdc" },
];

const PAGE_SIZE = 9;

export default function NoticesPage() {
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(notices.length / PAGE_SIZE);
  const current = notices.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const handlePage = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ fontSize: "20px", fontWeight: 700, color: "#191f28", marginBottom: "24px" }}
        >
          요즘 더비타민 소식
        </motion.h2>

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
                <div style={{ position: "relative", height: "200px", background: notice.bg, flexShrink: 0 }}>
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, #ffffff 100%)", pointerEvents: "none" }} />
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
            style={{
              height: "44px",
              padding: "0 24px",
              borderRadius: "22px",
              border: "1px solid #e5e8eb",
              background: "#ffffff",
              fontSize: "14px",
              fontWeight: 500,
              color: page === 0 ? "#b0b8c1" : "#191f28",
              cursor: page === 0 ? "not-allowed" : "pointer",
              transition: "all 150ms ease",
            }}
          >
            이전
          </button>

          <span style={{ fontSize: "14px", fontWeight: 500, color: "#8b95a1" }}>
            {page + 1} / {totalPages}
          </span>

          <button
            onClick={() => handlePage(page + 1)}
            disabled={page === totalPages - 1}
            style={{
              height: "44px",
              padding: "0 24px",
              borderRadius: "22px",
              border: "none",
              background: page === totalPages - 1 ? "#e5e8eb" : "#1F6B2A",
              fontSize: "14px",
              fontWeight: 500,
              color: page === totalPages - 1 ? "#b0b8c1" : "#ffffff",
              cursor: page === totalPages - 1 ? "not-allowed" : "pointer",
              transition: "all 150ms ease",
            }}
          >
            다음
          </button>
        </div>
      </div>

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
          .hero-section { height: auto; }
          .hero-inner { flex-direction: column-reverse; padding: 0 !important; align-items: center; }
          .hero-text { text-align: center; padding: 32px 24px 40px; }
          .hero-title { font-size: 48px; }
          .hero-subtitle { font-size: 16px; }
          .hero-subtitle-pc { display: none; }
          .hero-subtitle-mobile { display: inline; }
          .hero-img { height: auto; width: 100%; max-height: 300px; object-fit: contain; }
          .notices-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }

        @media (max-width: 480px) {
          .notices-grid { grid-template-columns: repeat(1, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
