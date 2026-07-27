import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "고객 문의",
  description:
    "목포 더비타민 재가복지센터 상담 문의. 방문요양·가족요양·복지용구·간병인 서비스 온라인 상담 신청. 전화 061-242-3536 (전남 목포시 삼일로 6-1 2층)",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
