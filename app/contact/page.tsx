"use client";

import { useState } from "react";
import { Phone, MapPin, Printer, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const serviceOptions = ["방문요양", "가족요양", "복지용구", "간병인협회", "기타"];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    serviceType: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      <div className="bg-brand-green-light border-b border-gray-200 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">고객 문의</h1>
          <p className="mt-2 text-gray-600">
            궁금한 점이 있으시면 언제든지 문의해 주세요. 신속하게 답변 드리겠습니다.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* 문의 폼 */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <CheckCircle2 size={56} className="text-brand-green mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">문의가 접수되었습니다</h2>
                <p className="text-gray-600 mb-6">
                  담당자 확인 후 입력하신 연락처로 빠르게 연락드리겠습니다.
                </p>
                <Button onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", serviceType: "", message: "" }); }}>
                  새 문의 작성
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-xl font-bold text-gray-900 mb-4">문의 양식</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이름 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="홍길동"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    연락처 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="010-0000-0000"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">문의 유형</label>
                  <select
                    value={form.serviceType}
                    onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent bg-white"
                  >
                    <option value="">유형 선택</option>
                    {serviceOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    문의 내용 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="문의 내용을 자세히 적어주세요."
                    rows={5}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent resize-none"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full">
                  문의 보내기
                </Button>
              </form>
            )}
          </div>

          {/* 연락처 정보 */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-gray-900">연락처</h2>
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-green mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">주소</p>
                  <p className="text-sm text-gray-800">전라남도 목포시 삼일로 6-1 2층</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-brand-green shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">전화</p>
                  <a href="tel:061-242-3536" className="text-sm font-semibold text-brand-green hover:underline">
                    061-242-3536
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Printer size={18} className="text-brand-green shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">팩스</p>
                  <p className="text-sm text-gray-800">061-892-7106</p>
                </div>
              </div>
            </div>

            <div className="bg-brand-green-light rounded-2xl p-5">
              <p className="text-sm font-semibold text-gray-900 mb-1">운영 시간</p>
              <p className="text-sm text-gray-700">평일 09:00 ~ 18:00</p>
              <p className="text-xs text-gray-500 mt-1">* 주말 및 공휴일 휴무</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
