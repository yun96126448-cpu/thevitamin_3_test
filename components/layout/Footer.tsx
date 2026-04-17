import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Printer } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & 센터명 */}
          <div className="flex flex-col gap-3">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="더비타민 재가복지센터"
                width={140}
                height={42}
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed">
              어르신과 가족이 함께 행복할 수 있도록<br />
              전문적이고 따뜻한 돌봄 서비스를 제공합니다.
            </p>
          </div>

          {/* 연락처 */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 text-sm uppercase tracking-wide">연락처</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-brand-green mt-0.5 shrink-0" />
                <span>전라남도 목포시 삼일로 6-1 2층</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-brand-green shrink-0" />
                <a href="tel:061-242-3536" className="hover:text-brand-green transition-colors">
                  061-242-3536
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Printer size={16} className="text-brand-green shrink-0" />
                <span>061-892-7106 (팩스)</span>
              </li>
            </ul>
          </div>

          {/* 빠른 링크 */}
          <div>
            <h3 className="text-gray-900 font-semibold mb-4 text-sm uppercase tracking-wide">서비스</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/visit-care", label: "방문요양" },
                { href: "/family-care", label: "가족요양" },
                { href: "/welfare-equipment", label: "복지용구" },
                { href: "/caregiver", label: "간병인협회" },
                { href: "/contact", label: "고객 문의" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-brand-green transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} 더비타민 재가복지센터. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
