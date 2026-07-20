"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export type ApplyStep = {
  title: string;
  desc: string;
};

export default function ApplyStepsAccordion({
  title = "신청 방법",
  steps,
}: {
  title?: string;
  steps: ApplyStep[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-[4fr_6fr] sm:gap-12 lg:gap-16">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
        {title}
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
