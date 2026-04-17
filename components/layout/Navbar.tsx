"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/visit-care", label: "방문요양" },
  { href: "/family-care", label: "가족요양" },
  { href: "/welfare-equipment", label: "복지용구" },
  { href: "/caregiver", label: "간병인협회" },
  { href: "/notices", label: "공지사항" },
  { href: "/contact", label: "고객 문의" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo.png"
            alt="더비타민 재가복지센터"
            width={160}
            height={48}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === link.href
                    ? "text-gray-900 font-semibold"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Login button */}
        <div className="hidden lg:flex items-center">
          <Button asChild variant="outline" size="sm">
            <Link href="/login">로그인</Link>
          </Button>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 text-gray-700 hover:text-brand-green"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="메뉴 열기"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-md">
          <ul className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-sm font-medium",
                    pathname === link.href
                      ? "bg-gray-100 text-gray-900 font-semibold"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 border-t border-gray-100">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium text-brand-green border border-brand-green text-center"
              >
                로그인
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
