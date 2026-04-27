"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";

const serviceItems = [
  {
    num: "01",
    category: "신체활동 지원",
    items: ["세면·구강청결 도움", "식사 도움", "목욕 지원", "배설 도움", "체위 변경"],
  },
  {
    num: "02",
    category: "일상생활 지원",
    items: ["취사·청소·세탁", "외출 동행", "병원 동행", "약 챙기기"],
  },
  {
    num: "03",
    category: "정서 지원",
    items: ["말벗·정서적 지원", "인지 활동 프로그램", "여가 활동 지원"],
  },
];

export default function ServiceExpandCards() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      {/* 모바일: 슬라이드 스크롤 */}
      <div className="md:hidden overflow-x-auto snap-x snap-mandatory flex gap-3 pb-2 scrollbar-none">
        {serviceItems.map((item) => (
          <div
            key={item.num}
            className="snap-start shrink-0 w-[86%] rounded-2xl bg-brand-green-light p-7 flex flex-col"
          >
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 leading-tight mb-2 text-xl">
                {item.category}
              </h3>
              <p className="text-xs text-gray-400 font-medium">/ {item.num}</p>
            </div>
            <p
              className="text-gray-700 text-sm leading-relaxed mt-4"
              style={{ wordBreak: "keep-all", overflowWrap: "break-word" }}
            >
              {item.items.join(", ")}
            </p>
          </div>
        ))}
      </div>

      {/* PC: 기존 hover 확장 */}
      <div className="hidden md:flex gap-3 h-[280px]">
        {serviceItems.map((item, i) => {
          const isActive = activeIndex === i;
          return (
            <div
              key={item.num}
              onMouseEnter={() => setActiveIndex(i)}
              className={[
                "relative rounded-2xl cursor-default transition-all duration-500 overflow-hidden select-none",
                isActive ? "flex-[2.2] bg-brand-green-light" : "flex-1 bg-gray-100",
              ].join(" ")}
            >
              <div className="flex flex-col h-full p-7">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 leading-tight mb-2 text-xl">
                    {item.category}
                  </h3>
                  <p className="text-xs text-gray-400 font-medium">/ {item.num}</p>
                </div>

                <div
                  className="mt-4 pr-12 transition-opacity duration-200"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transitionDelay: isActive ? "460ms" : "0ms",
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                >
                  <p
                    className="text-gray-700 text-sm sm:text-base leading-relaxed"
                    style={{ wordBreak: "keep-all", overflowWrap: "break-word" }}
                  >
                    {item.items.join(", ")}
                  </p>
                </div>

                <div
                  className="flex justify-start mt-4 transition-opacity duration-150 absolute bottom-7 left-7"
                  style={{
                    opacity: isActive ? 0 : 1,
                    pointerEvents: isActive ? "none" : "auto",
                  }}
                >
                  <div className="w-9 h-9 rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-400">
                    <Plus size={16} />
                  </div>
                </div>
              </div>

              <div
                className="absolute top-5 right-5 transition-opacity duration-200"
                style={{
                  opacity: isActive ? 1 : 0,
                  transitionDelay: isActive ? "460ms" : "0ms",
                  pointerEvents: "none",
                }}
              >
                <div className="w-7 h-7 bg-brand-green rounded-lg flex items-center justify-center">
                  <Check size={12} color="white" strokeWidth={2.5} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
