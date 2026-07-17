"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const steps = [
  {
    title: "장기요양 신청",
    desc:
      "국민건강보험공단 지사 방문이나 우편·인터넷으로 장기요양인정 신청서를 제출합니다. 만 65세 이상은 물론 노인성 질병이 있는 65세 미만 분도 대상이며, 서류 준비는 저희가 함께 도와드립니다.",
  },
  {
    title: "등급 판정",
    desc:
      "공단 사회복지사가 가정을 방문해 신체·인지 상태를 조사한 뒤, 약 30일 이내에 1~5등급 또는 인지지원등급으로 결과를 통보합니다. 등급에 따라 이용 가능한 급여 한도가 달라지니 결과지를 받으시면 바로 알려주세요.",
  },
  {
    title: "센터 계약",
    desc:
      "등급 판정서를 가지고 방문하시면 담당 사회복지사가 상담 후 맞춤 급여계획을 세워드립니다. 이용 요일·시간과 본인부담금(등급별 약 15%, 기초수급자는 감면)을 정해 계약서를 작성합니다.",
  },
  {
    title: "서비스 시작",
    desc:
      "어르신께 맞는 전문 요양보호사를 배정하고, 첫 방문은 담당자가 동행해 안내해 드립니다. 이후에도 정기 모니터링으로 만족도를 확인하며, 필요하면 언제든 조정해 드립니다.",
  },
];

export default function ApplyStepsAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-[4fr_6fr] sm:gap-12 lg:gap-16">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
        신청 방법
      </h2>

      <div className="border-t border-gray-200">
        {steps.map((s, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={s.title} className="border-b border-gray-200">
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 py-6 text-left"
              >
                <span className="text-lg sm:text-xl font-bold text-gray-900">
                  {s.title}
                </span>
                <ChevronDown
                  size={22}
                  className={`shrink-0 text-gray-900 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className="grid transition-all duration-300 ease-in-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="pb-6 text-sm sm:text-base leading-relaxed text-gray-500">
                    {s.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
