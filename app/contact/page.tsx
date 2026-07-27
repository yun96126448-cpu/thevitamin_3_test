"use client";

import { useState } from "react";
import { Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const serviceOptions = ["방문요양", "가족요양", "복지용구", "간병인협회", "기타"];
const gradeOptions = [
  "1등급",
  "2등급",
  "3등급",
  "4등급",
  "5등급",
  "인지지원등급",
  "등급 미정 / 신청 예정",
  "해당 없음",
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    serviceType: "",
    grade: "",
    message: "",
  });

  const resetForm = () =>
    setForm({ name: "", phone: "", email: "", serviceType: "", grade: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-20">
          {/* 문의 폼 카드 */}
          <div className="order-2 lg:order-1 w-full lg:w-[46%] shrink-0">
            <div className="border border-gray-200 rounded-2xl p-6 sm:p-8">
              {submitted ? (
                <div className="min-h-[480px] flex flex-col items-center justify-center text-center">
                  <Phone size={52} className="text-brand-green mb-4" />
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    죄송합니다. 전화로 문의를 남겨주세요
                  </h2>
                  <p className="text-sm text-gray-500 mb-6 max-w-xs leading-relaxed">
                    현재 온라인 문의 접수가 원활하지 않아, 번거로우시더라도
                    아래 번호로 전화 주시면 담당자가 친절하게 상담해
                    드리겠습니다. 불편을 드려 진심으로 죄송합니다.
                  </p>
                  <a
                    href="tel:061-242-3536"
                    className="text-2xl font-bold text-brand-green mb-6 hover:underline"
                  >
                    061-242-3536
                  </a>
                  <Button
                    onClick={() => {
                      setSubmitted(false);
                      resetForm();
                    }}
                    variant="outline"
                  >
                    돌아가기
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-2">
                      성함
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="홍길동"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-2">
                      연락처
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="010-0000-0000"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-2">
                      이메일 (선택)
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="example@email.com"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-2">
                      문의 서비스
                    </label>
                    <div className="relative">
                      <select
                        required
                        value={form.serviceType}
                        onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
                        className="w-full appearance-none border border-gray-200 rounded-lg px-4 py-3 pr-10 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-colors"
                      >
                        <option value="">서비스를 선택해주세요</option>
                        {serviceOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-2">
                      장기요양 등급 (선택)
                    </label>
                    <div className="relative">
                      <select
                        value={form.grade}
                        onChange={(e) => setForm({ ...form, grade: e.target.value })}
                        className="w-full appearance-none border border-gray-200 rounded-lg px-4 py-3 pr-10 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green transition-colors"
                      >
                        <option value="">등급을 선택해주세요</option>
                        {gradeOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-6">
                    <label className="block text-[11px] font-medium uppercase tracking-widest text-gray-400 mb-3">
                      문의 내용
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="어떤 도움이 필요하신지 자세히 남겨주시면 더 빠르고 정확하게 안내해 드릴게요."
                      className="w-full bg-transparent resize-none text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none leading-relaxed"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    문의 보내기
                  </Button>
                </form>
              )}
            </div>
          </div>

          {/* 소개 + 이미지 */}
          <div className="order-1 lg:order-2 w-full lg:flex-1 flex flex-col gap-10 lg:gap-14">
            <header className="flex flex-col gap-8">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.1] [text-wrap:balance]">
                고객 문의
              </h1>
              <div className="relative pl-6">
                <span className="absolute left-0 top-0 h-full w-[3px] bg-brand-green rounded-full" />
                <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-md">
                  전화 상담은 평균 5분, 방문 상담은 사전 예약 후 진행됩니다. 어르신과
                  가족분 모두에게 꼭 맞는 돌봄 계획을 함께 찾아드립니다.
                </p>
              </div>
            </header>

            <section>
              <div className="relative w-full aspect-square rounded-[24px] lg:rounded-[30px] overflow-hidden bg-brand-green-light">
                <img
                  src="/방문요양_home_clean.png"
                  alt="더비타민 재가복지센터"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
