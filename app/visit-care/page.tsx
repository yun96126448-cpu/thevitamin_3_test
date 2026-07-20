import Link from "next/link";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/shared/Reveal";
import TargetsGrid from "@/components/shared/TargetsGrid";
import ServiceExpandCards from "@/components/shared/ServiceExpandCards";
import ApplyStepsAccordion from "@/components/shared/ApplyStepsAccordion";

const targets = [
  "장기요양 1~5등급 판정을 받은 어르신",
  "65세 이상 노인성 질병을 가진 어르신",
  "일상생활이 어려운 장애인",
  "치매, 중풍, 파킨슨 등 거동이 불편한 어르신",
];

const serviceCategories = [
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

const applySteps = [
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
        {/* 서비스 대상 + 제공 서비스 내용 : 화면 한 페이지 꽉 채우고 스크롤 진입 시 페이드인 */}
        <Reveal className="flex flex-col gap-10 md:min-h-[calc(100vh-4rem)] md:justify-center md:gap-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6 md:mb-4 tracking-[0]">
              서비스 대상
            </h2>
            <TargetsGrid targets={targets} />
          </div>

          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6 md:mb-4">
              제공 서비스 내용
            </h2>
            <ServiceExpandCards categories={serviceCategories} />
          </div>
        </Reveal>

        {/* 신청 방법 : 화면 한 페이지 꽉 채우고 스크롤 진입 시 페이드인 */}
        <Reveal className="md:min-h-[calc(100vh-4rem)] md:flex md:flex-col md:justify-center">
          <ApplyStepsAccordion steps={applySteps} />
        </Reveal>

        {/* CTA */}
        <Reveal className="py-20 sm:py-28 text-center">
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
        </Reveal>
      </div>
    </div>
  );
}
