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

  const title = `${loc.nameKo} 복지용구 | 더비타민 비타민재가복지센터`;
  const description = `${loc.region}에서 더비타민 비타민재가복지센터가 제공하는 복지용구 대여·구입 서비스. 휠체어, 전동침대, 욕창 예방 매트리스 등 장기요양보험 급여 품목을 지원합니다. 상담 061-242-3536`;

  const url = `${SITE_URL}/welfare-equipment/${params.location}`;

  return {
    title,
    description,
    keywords: [`${loc.nameKo} 복지용구`, "더비타민", "비타민재가", "휠체어", "복지용구"],
    alternates: { canonical: `/welfare-equipment/${params.location}` },
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
    desc: "장기요양 1~5등급 또는 인지지원등급을 받으셨는지 먼저 확인합니다.",
  },
  {
    title: "품목 선택",
    desc: "어르신의 생활 환경과 신체 상태에 맞는 복지용구를 상담을 통해 선택합니다.",
  },
  {
    title: "급여 신청",
    desc: "국민건강보험공단 또는 센터를 통해 복지용구 급여를 신청합니다.",
  },
  {
    title: "이용 시작",
    desc: "선택하신 품목을 납품·설치해 드리고, 사용 방법까지 꼼꼼히 안내합니다.",
  },
];

export default function LocationWelfareEquipment({ params }: Props) {
  const loc = locationMap[params.location];
  if (!loc) notFound();

  return (
    <div className="min-h-screen">
      <div className="text-center px-6 py-20 sm:py-28">
        <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-black text-gray-900 leading-[1.05] tracking-normal mb-7 max-w-2xl mx-auto">
          {loc.nameKo} 복지용구
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          {loc.region}에서 더비타민 비타민재가복지센터가 제공하는 복지용구 서비스입니다.
          <br />
          휠체어, 전동침대, 보행 보조기 등을 대여·구입해 드립니다.
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
          src="/welfare-home.png"
          alt="복지용구 서비스"
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
            주요 지원 품목
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
            {loc.nameKo} 지역의 복지용구 서비스에 관해 전화 또는 온라인으로 문의해 주세요.
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
