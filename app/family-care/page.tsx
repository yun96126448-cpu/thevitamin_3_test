import Link from "next/link";
import { CheckCircle, Users, ClipboardList, ArrowRight, Phone, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const targets = [
  "장기요양 1~5등급 판정을 받은 어르신",
  "요양보호사 자격을 취득한 가족이 있는 경우",
  "도서·벽지 지역 등 서비스 접근이 어려운 경우",
  "치매 어르신 가족 (치매가족 요양보호사 인정)",
];

const benefits = [
  { title: "정서적 안정", desc: "낯선 요양보호사보다 가족이 돌봄으로써 어르신의 심리적 안정에 도움" },
  { title: "급여 수령", desc: "장기요양보험에서 가족 요양보호사에게 급여 지급" },
  { title: "유연한 돌봄", desc: "가족의 스케줄에 맞게 유연하게 돌봄 시간 조정 가능" },
  { title: "인력 부족 해소", desc: "거동이 불편한 어르신의 요양보호 인력 부족 문제 해결" },
];

const steps = [
  { step: "01", title: "자격증 취득", desc: "요양보호사 교육원에서 이론·실습·실기 교육 이수 후 시험 합격" },
  { step: "02", title: "장기요양 신청", desc: "국민건강보험공단에 장기요양인정 신청 및 등급 판정" },
  { step: "03", title: "센터 계약", desc: "더비타민 재가복지센터와 가족 요양보호사 계약 체결" },
  { step: "04", title: "서비스 및 급여", desc: "서비스 제공 후 장기요양 급여 수령" },
];

export default function FamilyCare() {
  return (
    <div className="min-h-screen">
      {/* 페이지 헤더 */}
      <div
        className="relative h-64 flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1609220136736-443140cffec6?w=1920&auto=format&fit=crop&q=80)",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white">
          <p className="text-brand-green font-semibold text-sm uppercase tracking-widest mb-2">서비스 안내</p>
          <h1 className="text-4xl font-bold">가족요양</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* 서비스 소개 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1 h-7 bg-brand-green rounded-full inline-block" />
            가족요양이란?
          </h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            가족요양은 수급자의 가족이 요양보호사 자격을 취득하여 직접 가족 어르신을 돌보고 급여를 받을 수 있는
            제도입니다. 전문 요양보호사로서의 자격을 갖추어 보다 전문적이고 체계적인 돌봄을 제공하면서,
            가족의 사랑과 정서적 유대감으로 어르신의 심리적 안정을 도모합니다.
          </p>
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            ※ 가족 요양보호사는 하루 60분 이상, 월 20일 이상 서비스 제공 시 급여 수령 가능합니다. (단, 배우자 등 일부 가족은 제한)
          </div>
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

        {/* 가족요양 혜택 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Star size={24} className="text-brand-green" />
            가족요양의 장점
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((b) => (
              <div key={b.title} className="bg-brand-green-light rounded-2xl p-6">
                <h3 className="font-bold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-sm text-gray-700">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 신청 방법 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <ClipboardList size={24} className="text-brand-green" />
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
          <h2 className="text-2xl font-bold mb-2">가족요양, 지금 시작하세요</h2>
          <p className="mb-6 text-white/90">
            자격 취득부터 서비스 계약까지, 더비타민이 도와드립니다.
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
