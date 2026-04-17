"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* 로고 */}
          <div className="flex justify-center mb-6">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="더비타민 재가복지센터"
                width={160}
                height={48}
                className="h-12 w-auto object-contain"
              />
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">로그인</h1>
          <p className="text-sm text-center text-gray-500 mb-8">
            더비타민 재가복지센터에 오신 것을 환영합니다
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="example@email.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="비밀번호 입력"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full mt-2">
              로그인
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-500">
            문의사항이 있으신가요?{" "}
            <Link href="/contact" className="text-brand-green hover:underline font-medium">
              고객 문의
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
