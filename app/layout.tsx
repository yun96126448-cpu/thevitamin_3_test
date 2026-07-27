import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Providers } from "@/components/providers";
import { BUSINESS, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | 목포 방문요양·가족요양·복지용구·간병인`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "더비타민 재가복지센터",
    "목포 재가복지센터",
    "목포 방문요양",
    "목포 가족요양",
    "목포 복지용구",
    "목포 간병인",
    "전남 요양보호사",
    "장기요양보험",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | 목포 방문요양·가족요양·복지용구·간병인`,
    description: SITE_DESCRIPTION,
    images: [{ url: "/hero.png", width: 1200, height: 630, alt: SITE_NAME }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: "XGLluCmtwuyNbUmh1R09_kL5-ScrwltjNJ1YQ-DpyAM",
    other: {
      "naver-site-verification": "b998e953b8e5ca489e87d651d4721a4bf7b9e340",
    },
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: BUSINESS.name,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  image: `${SITE_URL}/logo.png`,
  telephone: BUSINESS.telephone,
  faxNumber: BUSINESS.faxNumber,
  address: {
    "@type": "PostalAddress",
    streetAddress: BUSINESS.streetAddress,
    addressLocality: BUSINESS.addressLocality,
    addressRegion: BUSINESS.addressRegion,
    addressCountry: BUSINESS.addressCountry,
  },
  areaServed: "전라남도 목포시",
  makesOffer: ["방문요양", "가족요양", "복지용구", "간병인"].map((name) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name },
  })),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <Providers>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
