import Link from "next/link";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/shared/Reveal";
import TargetsGrid from "@/components/shared/TargetsGrid";
import ServiceExpandCards from "@/components/shared/ServiceExpandCards";
import ApplyStepsAccordion from "@/components/shared/ApplyStepsAccordion";

const targets = [
  "장기요양 1~5등급 판정을 받은 어르신",
  "인지지원등급을 받은 어르신",
  "낙상 위험이 있어 안전 용구가 필요한 경우",
  "장기 와상 등 욕창 예방이 필요한 어르신",
];

const serviceCategories = [
  {
    num: "01",
    category: "대여 품목",
    items: ["수동 휠체어", "전동 침대", "욕창 예방 매트리스", "이동 욕조", "보행 보조기"],
  },
  {
    num: "02",
    category: "구매 품목",
    items: ["안전 손잡이", "미끄럼 방지 용품", "지팡이", "간이변기"],
  },
  {
    num: "03",
    category: "이용 혜택",
    items: ["연간 160만원 한도", "본인부담 15%", "기초생활수급자·차상위계층 면제·경감"],
  },
];

const applySteps = [
  {
    title: "등급 확인",
    desc:
      "장기요양 1~5등급 또는 인지지원등급을 받으셨는지 먼저 확인합니다. 등급이 없으시다면 국민건강보험공단 신청부터 함께 안내해 드립니다.",
  },
  {
    title: "품목 선택",
    desc:
      "어르신의 생활 환경과 신체 상태에 맞는 복지용구를 상담을 통해 선택합니다. 대여와 구매 품목의 차이, 이용 기간과 비용까지 이해하기 쉽게 설명해 드립니다.",
  },
  {
    title: "급여 신청",
    desc:
      "국민건강보험공단 또는 센터를 통해 복지용구 급여를 신청합니다. 연간 한도액과 본인부담률을 미리 안내해 드려 예상 밖의 비용 부담이 없도록 돕습니다.",
  },
  {
    title: "이용 시작",
    desc:
      "선택하신 품목을 납품·설치해 드리고, 사용 방법까지 꼼꼼히 안내합니다. 사용 중 불편한 점이나 교체가 필요하면 언제든 연락 주세요.",
  },
];

export default function WelfareEquipment() {
  return (
    <div className="min-h-screen">
      {/* 히어로 - 클린 화이트 */}
      <div className="text-center px-6 py-20 sm:py-28">
        <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-black text-gray-900 leading-[1.05] tracking-normal mb-7 max-w-2xl mx-auto">
          복지용구란?
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          복지용구는 심신 기능이 저하된 수급자의 일상생활·신체활동 지원 및 인지기능 유지·개선을 위해
          필요한 용구를 구입하거나 대여해 드리는 장기요양 급여입니다. 연간 160만원 한도 내에서
          본인부담 15%로 부담 없이 이용하실 수 있습니다.
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
          src="/welfare-home.png"
          alt="복지용구 서비스"
          className="max-w-5xl w-full max-h-[480px] object-contain"
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
        {/* 서비스 대상 + 제공 서비스 내용 */}
        <Reveal className="flex flex-col gap-10 md:min-h-[calc(100vh-4rem)] md:justify-center md:gap-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6 md:mb-4 tracking-[0]">
              서비스 대상
            </h2>
            <TargetsGrid targets={targets} />
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6 md:mb-4">
              주요 지원 품목
            </h2>
            <ServiceExpandCards categories={serviceCategories} />
          </div>
        </Reveal>

        {/* 이용 방법 */}
        <Reveal className="md:min-h-[calc(100vh-4rem)] md:flex md:flex-col md:justify-center">
          <ApplyStepsAccordion title="이용 방법" steps={applySteps} />
        </Reveal>

        {/* CTA */}
        <Reveal className="py-20 sm:py-28 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
            궁금하신 점이 있으신가요?
          </h2>
          <p className="mb-10 text-gray-500 text-base sm:text-lg">
            필요한 복지용구 선택부터 신청까지, 전화 또는 온라인으로 문의해 주세요.
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
        </Reveal>
      </div>
    </div>
  );
}
