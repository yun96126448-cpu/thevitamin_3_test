import Link from "next/link";
import { CheckCircle, Users, ClipboardList, ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const targets = [
  "장기요양 1~5등급 판정을 받은 어르신",
  "65세 이상 노인성 질병을 가진 어르신",
  "일상생활이 어려운 장애인",
  "치매, 중풍, 파킨슨 등 거동이 불편한 어르신",
];

const serviceItems = [
  { category: "신체활동 지원", items: ["세면·구강청결 도움", "식사 도움", "목욕 지원", "배설 도움", "체위 변경"] },
  { category: "일상생활 지원", items: ["취사·청소·세탁", "외출 동행", "병원 동행", "약 챙기기"] },
  { category: "정서 지원", items: ["말벗·정서적 지원", "인지 활동 프로그램", "여가 활동 지원"] },
];

const steps = [
  { step: "01", title: "장기요양 신청", desc: "국민건강보험공단에 장기요양인정 신청" },
  { step: "02", title: "등급 판정", desc: "방문조사 후 1~5등급 또는 인지지원등급 판정" },
  { step: "03", title: "센터 계약", desc: "더비타민 재가복지센터와 서비스 이용 계약 체결" },
  { step: "04", title: "서비스 시작", desc: "요양보호사 배정 후 서비스 시작" },
];

export default function VisitCare() {
  return (
    <div className="min-h-screen">
      {/* 페이지 헤더 */}
      <div
        className="relative h-64 flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1920&auto=format&fit=crop&q=80)",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white">
          <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-2">서비스 안내</p>
          <h1 className="text-4xl font-bold">방문요양</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* 서비스 소개 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-7 bg-brand-green rounded-full inline-block" />
            방문요양이란?
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            방문요양은 장기요양기관에 소속된 요양보호사가 수급자의 가정을 방문하여 신체활동 및 가사활동 등의
            서비스를 제공하는 장기요양 급여입니다. 어르신이 익숙한 집에서 편안하게 생활하실 수 있도록
            전문적인 돌봄 서비스를 제공합니다.
          </p>
        </section>

        {/* 서비스 대상 */}
        <section className="bg-gray-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Users size={24} className="text-brand-green" />
            서비스 대상
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {targets.map((t, i) => (
              <li key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                <CheckCircle size={18} className="text-brand-green mt-0.5 shrink-0" />
                <span className="text-gray-700 text-sm">{t}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 제공 서비스 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ClipboardList size={24} className="text-brand-green" />
            제공 서비스 내용
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {serviceItems.map((group) => (
              <div key={group.category} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-3 pb-2 border-b border-brand-green-light text-sm">
                  {group.category}
                </h3>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-green shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* 신청 방법 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ArrowRight size={24} className="text-brand-green" />
            신청 방법
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
          <h2 className="text-2xl font-bold mb-2">지금 바로 상담받으세요</h2>
          <p className="mb-6 text-white/90">
            방문요양 서비스에 관한 자세한 내용은 전화 또는 온라인으로 문의해 주세요.
          </p>
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
