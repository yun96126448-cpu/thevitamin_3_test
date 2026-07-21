import Link from "next/link";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/shared/Reveal";
import TargetsGrid from "@/components/shared/TargetsGrid";
import ServiceExpandCards from "@/components/shared/ServiceExpandCards";
import ApplyStepsAccordion from "@/components/shared/ApplyStepsAccordion";

const targets = [
  "병원 입원 중 24시간 간병이 필요한 환자",
  "퇴원 후 가정에서 회복 돌봄이 필요한 어르신",
  "보호자 부재 시 단기 간병이 필요한 경우",
  "치매 등 전문적인 돌봄이 필요한 어르신",
];

const serviceCategories = [
  {
    num: "01",
    category: "전문 간병 인력",
    items: ["체계적인 교육 이수", "신원조회 및 자격 검증", "24시간 긴급 배정 가능"],
  },
  {
    num: "02",
    category: "서비스 유형",
    items: ["병원 간병", "가정 간병", "단기 간병", "치매 전문 간병"],
  },
  {
    num: "03",
    category: "안전과 신뢰",
    items: ["정기 모니터링", "보호자와의 실시간 소통", "맞춤형 간병 계획 수립"],
  },
];

const applySteps = [
  {
    title: "상담 신청",
    desc:
      "전화 또는 온라인으로 상담을 신청해 주시면, 환자의 연령·진단명·간병 장소·희망 기간 등을 여쭙고 상황에 맞는 서비스를 안내해 드립니다.",
  },
  {
    title: "맞춤 매칭",
    desc:
      "상담 내용을 바탕으로 환자와 잘 맞는 전문 간병인을 찾아 매칭합니다. 병원 간병, 가정 간병, 치매 전문 간병 등 필요한 형태에 맞춰 배정해 드립니다.",
  },
  {
    title: "계약 및 배정",
    desc:
      "간병 기간과 비용을 안내드리고 계약을 진행합니다. 검증된 자격과 신원조회를 거친 간병인이 배정되어 안심하고 맡기실 수 있습니다.",
  },
  {
    title: "서비스 시작",
    desc:
      "약속된 날짜에 간병이 시작되며, 이후에도 정기적인 모니터링과 보호자와의 소통을 통해 서비스 만족도를 꾸준히 확인합니다.",
  },
];

export default function CaregiverAssociation() {
  return (
    <div className="min-h-screen">
      {/* 히어로 - 클린 화이트 */}
      <div className="text-center px-6 py-20 sm:py-28">
        <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-black text-gray-900 leading-[1.05] tracking-normal mb-7 max-w-2xl mx-auto">
          간병인협회란?
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          더비타민 재가복지센터와 연계된 간병인협회는 전문적으로 교육받은 간병인을
          환자와 가족에게 연결해드리는 서비스입니다. 병원 입원 중이거나 퇴원 후
          가정에서 전문적인 간병이 필요할 때, 상담을 통해 맞춤형 간병을 안내해 드립니다.
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
          src="/caregiver-home.png"
          alt="간병인협회 서비스"
          className="max-w-5xl w-full max-h-[480px] object-contain"
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
        {/* 서비스 대상 */}
        <Reveal className="flex flex-col justify-center min-h-[calc(100dvh-4rem)]">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6 md:mb-4 tracking-[0]">
            서비스 대상
          </h2>
          <TargetsGrid targets={targets} />
        </Reveal>

        {/* 서비스 특징 */}
        <Reveal className="flex flex-col justify-center min-h-[calc(100dvh-4rem)]">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6 md:mb-4">
            서비스 특징
          </h2>
          <ServiceExpandCards categories={serviceCategories} />
        </Reveal>

        {/* 이용 방법 */}
        <Reveal className="flex flex-col justify-center min-h-[calc(100dvh-4rem)]">
          <ApplyStepsAccordion title="이용 방법" steps={applySteps} />
        </Reveal>

        {/* CTA */}
        <Reveal className="py-20 sm:py-28 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
            궁금하신 점이 있으신가요?
          </h2>
          <p className="mb-10 text-gray-500 text-base sm:text-lg">
            간병인 매칭 상담은 전화 또는 온라인으로 편하게 문의해 주세요.
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
