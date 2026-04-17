import Link from "next/link";
import { ChevronRight, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const notices = [
  {
    id: 1,
    title: "2025년 장기요양보험 급여비용 변경 안내",
    date: "2025-01-15",
    category: "공지",
  },
  {
    id: 2,
    title: "설 연휴 기간(1/28~2/2) 운영 안내",
    date: "2025-01-10",
    category: "공지",
  },
  {
    id: 3,
    title: "복지용구 신규 품목 추가 안내 (전동보조기기)",
    date: "2025-01-05",
    category: "서비스",
  },
];

export default function NoticeSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* 공지사항 */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Bell size={20} className="text-brand-green" />
                <h2 className="text-2xl font-bold text-gray-900">공지사항</h2>
              </div>
              <Link
                href="/notices"
                className="text-sm text-brand-green hover:underline flex items-center gap-1"
              >
                더보기 <ChevronRight size={14} />
              </Link>
            </div>
            <ul className="divide-y divide-gray-100">
              {notices.map((notice) => (
                <li key={notice.id}>
                  <Link
                    href="/notices"
                    className="flex items-center justify-between py-4 hover:text-brand-green transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-brand-green-light text-brand-green-dark">
                        {notice.category}
                      </span>
                      <span className="text-sm text-gray-800 group-hover:text-brand-green">
                        {notice.title}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 ml-4">{notice.date}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 서비스 이용 안내 CTA */}
          <div className="bg-brand-green-light rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              서비스 이용이 궁금하신가요?
            </h2>
            <p className="text-gray-700 mb-2 text-sm leading-relaxed">
              장기요양 등급 판정부터 서비스 신청까지, 더비타민 재가복지센터가 함께합니다.
            </p>
            <ul className="space-y-2 mb-6 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-green text-white text-xs flex items-center justify-center font-bold">1</span>
                국민건강보험공단에 장기요양 신청
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-green text-white text-xs flex items-center justify-center font-bold">2</span>
                등급 판정 후 센터에 연락
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-brand-green text-white text-xs flex items-center justify-center font-bold">3</span>
                상담 후 서비스 시작
              </li>
            </ul>
            <Button asChild>
              <Link href="/contact">지금 문의하기</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
