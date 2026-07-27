import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "공지사항",
  description:
    "목포 더비타민 재가복지센터 공지사항. 장기요양보험 제도 안내, 센터 소식, 돌봄 정보를 전해드립니다.",
  alternates: { canonical: "/notices" },
};

export default function NoticesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
