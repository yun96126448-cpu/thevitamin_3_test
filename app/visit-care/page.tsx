"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceExpandCards from "@/components/visit-care/ServiceExpandCards";
import ApplyStepsAccordion from "@/components/visit-care/ApplyStepsAccordion";

const targets = [
  "장기요양 1~5등급 판정을 받은 어르신",
  "65세 이상 노인성 질병을 가진 어르신",
  "일상생활이 어려운 장애인",
  "치매, 중풍, 파킨슨 등 거동이 불편한 어르신",
];

export default function VisitCare() {
  // 데스크톱에서만 특정 섹션 근처에서 부드럽게 화면에 걸리도록 스크롤 스냅 적용
  useEffect(() => {
    const html = document.documentElement;
    const mql = window.matchMedia("(min-width: 768px)");

    const apply = () => {
      if (mql.matches) {
        html.classList.add("snap-y", "snap-proximity");
      } else {
        html.classList.remove("snap-y", "snap-proximity");
      }
    };

    apply();
    mql.addEventListener("change", apply);

    return () => {
      mql.removeEventListener("change", apply);
      html.classList.remove("snap-y", "snap-proximity");
    };
  }, []);

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
        {/* 서비스 대상 + 제공 서비스 내용 : 화면 한 페이지 꽉 채우는 스냅 섹션 */}
        <section className="flex flex-col gap-10 md:min-h-[calc(100vh-4rem)] md:scroll-mt-16 md:snap-start md:justify-center md:gap-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6 md:mb-4 tracking-[0]">
              서비스 대상
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {targets.map((t, i) => (
                <li
                  key={i}
                  className="flex flex-col gap-8 md:gap-4 bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900 shrink-0">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-gray-700 text-sm sm:text-base leading-relaxed tracking-[0]">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6 md:mb-4">
              제공 서비스 내용
            </h2>
            <ServiceExpandCards />
          </div>
        </section>

        {/* 신청 방법 : 화면 한 페이지 꽉 채우는 스냅 섹션 */}
        <section className="md:min-h-[calc(100vh-4rem)] md:scroll-mt-16 md:snap-start md:flex md:flex-col md:justify-center">
          <ApplyStepsAccordion />
        </section>

        {/* CTA */}
        <section className="md:snap-start md:scroll-mt-16 py-20 sm:py-28 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
            궁금하신 점이 있으신가요?
          </h2>
          <p className="mb-10 text-gray-500 text-base sm:text-lg">
            방문요양 서비스에 관한 자세한 내용은 전화 또는 온라인으로 문의해 주세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-brand-green text-white rounded-full px-8 hover:bg-brand-green-dark"
            >
              <a href="tel:061-242-3536" className="flex items-center gap-2">
                <Phone size={16} /> 061-242-3536
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full px-8 border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <Link href="/contact">온라인 문의하기</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
