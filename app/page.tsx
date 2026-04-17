import { HeroSection } from "@/components/ui/hero-section-4";
import ServiceListSection from "@/components/home/ServiceListSection";
import StorySection from "@/components/home/StorySection";
import TextHighlightSection from "@/components/home/TextHighlightSection";

export default function Home() {
  return (
    <>
      <HeroSection
        title={"마음을 담아 함께하는\n따뜻한 재가복지 서비스"}
        mobileTitle={"마음을 담아 함께하는\n따뜻한 재가복지"}
        subtitle="더비타민 재가복지센터는 어르신과 가족이 함께 행복할 수 있도록 전문적이고 따뜻한 돌봄 서비스를 제공합니다."
        primaryButtonText="서비스 알아보기"
        primaryButtonHref="/visit-care"
        secondaryButtonText="고객 문의"
        secondaryButtonHref="/contact"
        imageUrl="/hero.png"
        className="-mt-16"
      />
      <TextHighlightSection />
      <ServiceListSection />
      <StorySection />
    </>
  );
}
