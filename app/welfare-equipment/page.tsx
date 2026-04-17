import Link from "next/link";
import { Package, ArrowRight, Phone, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const products = [
  {
    name: "수동 휠체어",
    type: "대여",
    desc: "이동이 불편한 어르신을 위한 수동 휠체어. 경량형 및 일반형 선택 가능",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400&auto=format&fit=crop&q=60",
  },
  {
    name: "전동 침대",
    type: "대여",
    desc: "상체 및 하체 각도 조절이 가능한 전동 침대. 욕창 예방에 도움",
    image: "https://images.unsplash.com/photo-1538688423619-a81d3f23454b?w=400&auto=format&fit=crop&q=60",
  },
  {
    name: "안전 손잡이",
    type: "구매",
    desc: "욕실, 현관, 침실에 설치하는 안전 손잡이. 낙상 예방에 효과적",
    image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&auto=format&fit=crop&q=60",
  },
  {
    name: "욕창 예방 매트리스",
    type: "대여",
    desc: "장기 와상 어르신의 욕창 예방을 위한 에어 매트리스",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&auto=format&fit=crop&q=60",
  },
  {
    name: "이동 욕조",
    type: "대여",
    desc: "침상에서 목욕이 필요한 어르신을 위한 이동식 욕조",
    image: "https://images.unsplash.com/photo-1552318965-6e6be7484ada?w=400&auto=format&fit=crop&q=60",
  },
  {
    name: "보행 보조기",
    type: "대여 / 구매",
    desc: "보행이 불안정한 어르신을 위한 보행기. 실내외 모두 사용 가능",
    image: "https://images.unsplash.com/photo-1588776814546-1ffedbe47add?w=400&auto=format&fit=crop&q=60",
  },
];

const steps = [
  { step: "01", title: "등급 확인", desc: "장기요양 1~5등급 또는 인지지원등급 보유 확인" },
  { step: "02", title: "품목 선택", desc: "필요한 복지용구 품목 상담 및 선택" },
  { step: "03", title: "급여 신청", desc: "국민건강보험공단 또는 센터를 통해 급여 신청" },
  { step: "04", title: "이용 시작", desc: "납품·설치 후 이용 시작" },
];

export default function WelfareEquipment() {
  return (
    <div className="min-h-screen">
      <div
        className="relative h-64 flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1920&auto=format&fit=crop&q=80)",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white">
          <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-2">서비스 안내</p>
          <h1 className="text-4xl font-bold">복지용구</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* 서비스 소개 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-7 bg-brand-green rounded-full inline-block" />
            복지용구 서비스란?
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            복지용구는 심신 기능이 저하된 수급자의 일상생활·신체활동 지원 및 인지기능 유지·개선을 위해
            필요한 용구를 구입하거나 대여하여 드리는 장기요양급여입니다. 연간 160만원 한도 내에서
            본인 부담 15%로 이용하실 수 있습니다.
          </p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800 flex items-start gap-2">
            <Info size={16} className="shrink-0 mt-0.5" />
            <span>
              복지용구 급여비용 연간 한도액: <strong>160만원</strong> / 본인부담률: <strong>15%</strong>
              (기초생활수급자·차상위계층은 면제 또는 경감)
            </span>
          </div>
        </section>

        {/* 품목 카탈로그 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Package size={24} className="text-brand-green" />
            주요 지원 품목
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.name} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="h-40 bg-gray-100 overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">{p.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-brand-green-light text-brand-green-dark font-medium">
                      {p.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 이용 방법 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ArrowRight size={24} className="text-brand-green" />
            이용 방법
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {steps.map((s, i) => (
              <div key={s.step} className="relative">
                <div className="bg-brand-green-light rounded-2xl p-5 text-center h-full">
                  <div className="w-10 h-10 rounded-full bg-brand-green text-white font-bold text-sm flex items-center justify-center mx-auto mb-3">
                    {s.step}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{s.title}</h3>
                  <p className="text-xs text-gray-600">{s.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden sm:flex absolute top-1/2 -right-2 z-10 -translate-y-1/2">
                    <ArrowRight size={16} className="text-brand-green" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-brand-green rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">복지용구 상담 문의</h2>
          <p className="mb-6 text-white/90">필요한 품목 선택부터 신청까지 도와드립니다.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="secondary" size="lg">
              <a href="tel:061-242-3536" className="flex items-center gap-2">
                <Phone size={16} /> 061-242-3536
              </a>
            </Button>
            <Button asChild size="lg" className="bg-white text-brand-green-dark hover:bg-gray-100">
              <Link href="/contact">온라인 문의하기</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
