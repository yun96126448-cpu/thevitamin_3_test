import { notFound } from "next/navigation";
import Link from "next/link";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Reveal from "@/components/shared/Reveal";
import TargetsGrid from "@/components/shared/TargetsGrid";
import ServiceExpandCards from "@/components/shared/ServiceExpandCards";
import ApplyStepsAccordion from "@/components/shared/ApplyStepsAccordion";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

interface Props {
  params: { location: string };
}

const locationMap: Record<string, { nameKo: string; region: string }> = {
  mokpo: { nameKo: "목포", region: "전라남도" },
  gwangju: { nameKo: "광주", region: "광주광역시" },
  jeonnam: { nameKo: "전라남도", region: "전라남도" },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const loc = locationMap[params.location];
  if (!loc) return {};

  const title = `${loc.nameKo} 간병인협회 | 더비타민 비타민재가복지센터`;
  const description = `${loc.region}에서 더비타민 비타민재가복지센터가 제공하는 간병인협회 서비스. 교육 이수·신원조회를 마친 전문 간병 인력을 24시간 긴급 배정합니다. 상담 061-242-3536`;

  const url = `${SITE_URL}/caregiver/${params.location}`;

  return {
    title,
    description,
    keywords: [`${loc.nameKo} 간병인`, "더비타민", "비타민재가", "간병인협회", "24시간 간병"],
    alternates: { canonical: `/caregiver/${params.location}` },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      url,
      siteName: "더비타민 재가복지센터",
      title,
      description,
      images: [{ url: "/hero.png", width: 1200, height: 630, alt: title }],
    },
  };
}

export async function generateStaticParams() {
  return [
    { location: "mokpo" },
    { location: "gwangju" },
    { location: "jeonnam" },
  ];
}

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
    desc: "전화 또는 온라인으로 상담을 신청해 주시면, 환자의 상황에 맞는 서비스를 안내해 드립니다.",
  },
  {
    title: "맞춤 매칭",
    desc: "상담 내용을 바탕으로 환자와 잘 맞는 전문 간병인을 찾아 매칭합니다.",
  },
  {
    title: "계약 및 배정",
    desc: "간병 기간과 비용을 안내드리고 계약을 진행합니다.",
  },
  {
    title: "서비스 시작",
    desc: "약속된 날짜에 간병이 시작되며, 이후에도 정기적인 모니터링으로 만족도를 확인합니다.",
  },
];

export default function LocationCaregiver({ params }: Props) {
  const loc = locationMap[params.location];
  if (!loc) notFound();

  return (
    <div className="min-h-screen">
      <div className="text-center px-6 py-20 sm:py-28">
        <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-black text-gray-900 leading-[1.05] tracking-normal mb-7 max-w-2xl mx-auto">
          {loc.nameKo} 간병인협회
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          {loc.region}에서 더비타민 비타민재가복지센터가 제공하는 간병인협회 서비스입니다.
          <br />
          교육받은 전문 간병인을 환자와 가족에게 연결해드리며, 24시간 긴급 배정을 지원합니다.
        </p>
        <a
          href="tel:061-242-3536"
          className="inline-flex items-center bg-brand-green text-white font-bold text-sm uppercase tracking-widest px-8 py-2.5 rounded-full hover:opacity-90 transition-opacity"
        >
          문의하기
        </a>
      </div>

      <div className="pb-20 flex justify-center px-4 sm:px-6 lg:px-8">
        <img
          src="/caregiver-home.png"
          alt="간병인협회 서비스"
          className="max-w-5xl w-full max-h-[480px] object-contain"
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-8">
        <Reveal className="flex flex-col justify-center min-h-[calc(100dvh-4rem)]">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6 md:mb-4 tracking-[0]">
            서비스 대상
          </h2>
          <TargetsGrid targets={targets} />
        </Reveal>

        <Reveal className="flex flex-col justify-center min-h-[calc(100dvh-4rem)]">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6 md:mb-4">
            서비스 특징
          </h2>
          <ServiceExpandCards categories={serviceCategories} />
        </Reveal>

        <Reveal className="flex flex-col justify-center min-h-[calc(100dvh-4rem)]">
          <ApplyStepsAccordion steps={applySteps} />
        </Reveal>

        <Reveal className="py-20 sm:py-28 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
            궁금하신 점이 있으신가요?
          </h2>
          <p className="mb-10 text-gray-500 text-base sm:text-lg">
            {loc.nameKo} 지역의 간병인 매칭 상담은 전화 또는 온라인으로 편하게 문의해 주세요.
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
