"use client";

import { useState } from "react";
import { Bell, ChevronDown, ChevronUp } from "lucide-react";

const notices = [
  {
    id: 1,
    category: "공지",
    title: "2025년 장기요양보험 급여비용 변경 안내",
    date: "2025-01-15",
    content:
      "2025년 1월 1일부터 장기요양보험 급여비용이 일부 조정되었습니다. 방문요양 및 가족요양 급여 단가가 변경되오니 이용에 참고하시기 바랍니다. 자세한 내용은 국민건강보험공단 홈페이지를 확인하시거나 센터로 문의해 주세요.",
  },
  {
    id: 2,
    category: "공지",
    title: "설 연휴 기간(1/28~2/2) 운영 안내",
    date: "2025-01-10",
    content:
      "설 연휴 기간(2025년 1월 28일 ~ 2월 2일) 중 센터 사무실은 휴무입니다. 단, 서비스 이용 어르신의 돌봄 공백이 없도록 담당 요양보호사와 사전 조율 부탁드립니다. 긴급한 경우 담당자에게 직접 연락 바랍니다.",
  },
  {
    id: 3,
    category: "서비스",
    title: "복지용구 신규 품목 추가 안내 (전동보조기기)",
    date: "2025-01-05",
    content:
      "2025년부터 전동보조기기(전동 휠체어, 전동 스쿠터)가 복지용구 급여 품목에 추가되었습니다. 해당 품목은 장기요양 1~2등급 수급자에 한해 이용 가능하며, 자세한 조건은 센터로 문의해 주시기 바랍니다.",
  },
  {
    id: 4,
    category: "공지",
    title: "요양보호사 추가 모집 안내",
    date: "2024-12-20",
    content:
      "더비타민 재가복지센터에서 요양보호사를 추가 모집합니다. 자격증 소지자 우대, 경력자 우대. 근무 조건 및 상세 내용은 센터로 직접 문의해 주시기 바랍니다.",
  },
  {
    id: 5,
    category: "서비스",
    title: "치매 가족 지원 프로그램 운영 안내",
    date: "2024-12-10",
    content:
      "치매 어르신을 돌보는 가족을 위한 심리 상담 및 교육 프로그램을 운영합니다. 치매 돌봄 방법, 법적 지원 제도, 스트레스 관리 등 실질적인 내용으로 구성됩니다. 참여 신청은 고객 문의 페이지를 이용해 주세요.",
  },
  {
    id: 6,
    category: "공지",
    title: "개인정보 처리방침 개정 안내",
    date: "2024-11-30",
    content:
      "개인정보 보호법 시행령 개정에 따라 더비타민 재가복지센터의 개인정보 처리방침이 일부 개정되었습니다. 주요 변경 사항은 개인정보 보유 기간 및 제3자 제공에 관한 내용입니다.",
  },
];

const categoryColors: Record<string, string> = {
  공지: "bg-brand-green-light text-brand-green-dark",
  서비스: "bg-blue-50 text-blue-700",
};

export default function NoticesPage() {
  const [openId, setOpenId] = useState<number | null>(null);

  return (
    <div className="min-h-screen">
      <div className="bg-brand-green-light border-b border-gray-200 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Bell size={28} className="text-brand-green" />
            <h1 className="text-3xl font-bold text-gray-900">공지사항</h1>
          </div>
          <p className="mt-2 text-gray-600">더비타민 재가복지센터의 최신 소식을 확인하세요.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ul className="divide-y divide-gray-100">
          {notices.map((notice) => (
            <li key={notice.id}>
              <button
                className="w-full text-left py-5 group"
                onClick={() => setOpenId(openId === notice.id ? null : notice.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 mt-0.5 ${categoryColors[notice.category]}`}
                    >
                      {notice.category}
                    </span>
                    <div>
                      <span className="font-medium text-gray-900 group-hover:text-brand-green transition-colors">
                        {notice.title}
                      </span>
                      <p className="text-xs text-gray-400 mt-1">{notice.date}</p>
                    </div>
                  </div>
                  <span className="text-gray-400 shrink-0">
                    {openId === notice.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </span>
                </div>
                {openId === notice.id && (
                  <div className="mt-4 ml-16 text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4 text-left">
                    {notice.content}
                  </div>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
