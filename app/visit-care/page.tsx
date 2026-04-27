import Link from "next/link";
import { Phone, ClipboardList, Award, FileCheck2, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceExpandCards from "@/components/visit-care/ServiceExpandCards";

const targets = [
  "장기요양 1~5등급 판정을 받은 어르신",
  "65세 이상 노인성 질병을 가진 어르신",
  "일상생활이 어려운 장애인",
  "치매, 중풍, 파킨슨 등 거동이 불편한 어르신",
];

const steps = [
  { step: "01", title: "장기요양 신청", desc: "국민건강보험공단에 장기요양인정 신청", Icon: ClipboardList },
  { step: "02", title: "등급 판정", desc: "방문조사 후 1~5등급 또는 인지지원등급 판정", Icon: Award },
  { step: "03", title: "센터 계약", desc: "더비타민 재가복지센터와 서비스 이용 계약 체결", Icon: FileCheck2 },
  { step: "04", title: "서비스 시작", desc: "요양보호사 배정 후 서비스 시작", Icon: PlayCircle },
];

export default function VisitCare() {
  return (
    <div className="min-h-screen">
      {/* 히어로 - 클린 화이트 */}
      <div className="text-center px-6 py-20 sm:py-28">
        <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-black text-gray-900 leading-[1.05] tracking-normal mb-7 max-w-2xl mx-auto">
          방문요양이란?
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          방문요양은 장기요양기관에 소속된 요양보호사가 수급자의 가정을 방문하여
          신체활동 및 가사활동 등의 서비스를 제공하는 장기요양 급여입니다.
          어르신이 익숙한 집에서 편안하게 생활하실 수 있도록 전문적인 돌봄 서비스를 제공합니다.
        </p>
        <a
          href="tel:061-242-3536"
          className="inline-flex items-center bg-brand-green text-white font-bold text-sm uppercase tracking-widest px-8 py-2.5 rounded-full hover:opacity-90 transition-opacity"
        >
          문의하기
        </a>
      </div>

      {/* 이미지 섹션 */}
      <div className="pb-20 flex justify-center px-4 sm:px-6 lg:px-8">
        <img
          src="/방문요양_home_clean.png"
          alt="방문요양 서비스"
          className="max-w-5xl w-full max-h-[480px] object-contain"
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
        {/* 서비스 대상 */}
        <section>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6 tracking-[0]">
            서비스 대상
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {targets.map((t, i) => (
              <li
                key={i}
                className="flex flex-col gap-8 bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900 shrink-0">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="text-gray-700 text-sm sm:text-base leading-relaxed tracking-[0]">{t}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 제공 서비스 */}
        <section>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6">
            제공 서비스 내용
          </h2>
          <ServiceExpandCards />
        </section>

        {/* 신청 방법 */}
        <section>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6">신청 방법</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            {steps.map((s, i) => (
              <div key={s.step} className="flex flex-col gap-4">
                <div className="bg-brand-green-light rounded-2xl h-44 flex items-center justify-center">
                  <s.Icon size={52} className="text-brand-green opacity-50" />
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm leading-snug mb-1">{s.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-brand-green rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">지금 바로 상담받으세요</h2>
          <p className="mb-6 text-white/90">
            방문요양 서비스에 관한 자세한 내용은 전화 또는 온라인으로 문의해 주세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="secondary" size="lg">
              <a href="tel:061-242-3536" className="flex items-center gap-2">
                <Phone size={16} /> 061-242-3536
              </a>
            </Button>
            <Button asChild size="lg" className="bg-white text-brand-green-dark hover:bg-gray-100">
              <Link href="/contact">온라인 문의하기</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
