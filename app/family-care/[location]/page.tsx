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

  const title = `${loc.nameKo} 가족요양 | 더비타민 비타민재가복지센터`;
  const description = `${loc.region}에서 더비타민 비타민재가복지센터가 제공하는 가족요양 서비스. 가족이 요양보호사 자격을 취득하여 직접 어르신을 돌보고 장기요양 급여를 받습니다. 상담 061-242-3536`;

  const url = `${SITE_URL}/family-care/${params.location}`;

  return {
    title,
    description,
    keywords: [`${loc.nameKo} 가족요양`, "더비타민", "비타민재가", "가족요양", "재가복지센터"],
    alternates: { canonical: `/family-care/${params.location}` },
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
  "요양보호사 자격을 취득한 가족이 있는 경우",
  "도서·벽지 지역 등 서비스 접근이 어려운 경우",
  "치매 어르신을 돌보는 가족",
];

const serviceCategories = [
  {
    num: "01",
    category: "자격과 급여",
    items: ["요양보호사 자격 취득 후 서비스 제공", "장기요양보험에서 급여 지급", "하루 60분·월 20일 이상 제공 시 인정"],
  },
  {
    num: "02",
    category: "정서적 안정",
    items: ["가족의 사랑과 정서적 유대감", "낯선 요양보호사 대비 높은 심리적 안정", "치매가족 요양보호사 특례 인정"],
  },
  {
    num: "03",
    category: "유연한 돌봄",
    items: ["가족 일정에 맞춘 유연한 시간 조정", "도서·벽지 등 접근이 어려운 지역 지원", "요양 인력 부족 문제 해소"],
  },
];

const applySteps = [
  {
    title: "자격증 취득",
    desc: "요양보호사 교육원에서 이론·실기·실습을 이수한 뒤 자격시험에 합격하면 가족 요양보호사로 활동하실 수 있습니다.",
  },
  {
    title: "장기요양 신청",
    desc: "국민건강보험공단에 장기요양인정을 신청하고 등급 판정을 받습니다.",
  },
  {
    title: "센터 계약",
    desc: "더비타민 재가복지센터와 가족 요양보호사 계약을 체결합니다. 이용 시간과 급여 계획을 상담을 통해 정합니다.",
  },
  {
    title: "서비스 및 급여",
    desc: "계약된 시간에 맞춰 어르신을 직접 돌보시고, 제공된 서비스에 대한 장기요양 급여를 받으실 수 있습니다.",
  },
];

export default function LocationFamilyCare({ params }: Props) {
  const loc = locationMap[params.location];
  if (!loc) notFound();

  return (
    <div className="min-h-screen">
      <div className="text-center px-6 py-20 sm:py-28">
        <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-black text-gray-900 leading-[1.05] tracking-normal mb-7 max-w-2xl mx-auto">
          {loc.nameKo} 가족요양
        </h1>
        <p className="text-gray-500 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
          {loc.region}에서 더비타민 비타민재가복지센터가 제공하는 가족요양 서비스입니다.
          <br />
          가족이 요양보호사 자격을 취득하여 직접 어르신을 돌보고 장기요양 급여를 받습니다.
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
          src="/family-care-home.png"
          alt="가족요양 서비스"
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
            가족요양의 장점
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
            {loc.nameKo} 지역의 가족요양 서비스에 관해 전화 또는 온라인으로 문의해 주세요.
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
