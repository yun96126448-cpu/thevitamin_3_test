"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

function ServiceItem({
  service,
  idx,
}: {
  service: { label: string; title: string; description: string; image: string };
  idx: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const isEven = idx % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
      className={`flex flex-col ${!isEven ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 lg:gap-16 items-center`}
    >
      {/* 텍스트 영역 */}
      <div className="flex-1 w-full">
        <p className="text-base font-semibold text-brand-green mb-3 tracking-widest uppercase">
          {service.label}
        </p>
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 whitespace-pre-line mb-4 leading-tight">
          {service.title}
        </h3>
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
          {service.description}
        </p>
      </div>

      {/* 이미지 영역 */}
      <motion.div
        className="flex-1 w-full"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="w-full aspect-square overflow-hidden flex items-center justify-center">
          <div className="relative w-full h-full">
            <Image
              src={service.image}
              alt={service.label}
              fill
              className="object-contain"
              unoptimized
              priority={idx < 2}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ServiceListSection() {
  const services = [
    {
      label: "방문요양",
      title: "집에서 편하게,\n전문 요양보호사와 함께",
      description:
        "신체활동 지원부터 일상생활까지, 어르신이 익숙한 집에서 전문적인 돌봄을 받으세요. 우리의 요양보호사들은 따뜻한 마음으로 매일을 함께합니다.",
      image: "/visit-care-home.png",
    },
    {
      label: "가족요양",
      title: "가족이 직접 돌보고,\n정당한 급여를 받으세요",
      description:
        "요양보호사 자격을 취득한 가족이 어르신을 돌보며 급여를 받을 수 있는 제도입니다. 가족의 사랑과 전문성을 함께 갖춘 최고의 돌봄을 선택하세요.",
      image: "/family-care-home.png",
    },
    {
      label: "복지용구",
      title: "일상을 편리하게 돕는\n맞춤형 복지용구",
      description:
        "휠체어부터 전동침대까지, 어르신의 독립성과 안전을 지켜주는 다양한 복지용구. 전문 상담을 통해 맞춤형 솔루션을 제공합니다.",
      image: "/welfare-home.png",
    },
    {
      label: "간병인협회",
      title: "전문 간병인 연결,\n맞춤형 상담으로 시작",
      description:
        "병원이든 가정이든, 필요한 순간에 신뢰할 수 있는 전문 간병인을 연결해드립니다. 상담을 통해 최적의 서비스를 찾으세요.",
      image: "/caregiver-home.png",
    },
  ];

  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 24 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-20"
        >
          <p className="text-base font-semibold text-brand-green mb-3 tracking-widest">서비스</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 whitespace-pre-line leading-tight">
            {"어르신의 삶이 더 편하고\n행복해지는 경험"}
          </h2>
        </motion.div>

        {/* 서비스 목록 */}
        <div className="space-y-16 lg:space-y-20">
          {services.map((service, idx) => (
            <ServiceItem key={service.label} service={service} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
