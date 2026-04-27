"use client";

import * as React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface HeroSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  mobileTitle?: string;
  subtitle: React.ReactNode;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText: string;
  secondaryButtonHref: string;
  imageUrl: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

const HeroSection = React.forwardRef<HTMLDivElement, HeroSectionProps>(
  (
    {
      className,
      title,
      mobileTitle,
      subtitle,
      primaryButtonText,
      primaryButtonHref,
      secondaryButtonText,
      secondaryButtonHref,
      imageUrl,
      ...props
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          "relative flex h-screen min-h-[700px] w-full items-center justify-center overflow-hidden",
          className
        )}
        {...props}
      >
        <div
          className="absolute inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${imageUrl})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 z-0 bg-black/40" aria-hidden="true" />

        <motion.div
          className="z-10 flex max-w-4xl flex-col items-center justify-center text-center px-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-5xl font-black sm:text-6xl lg:text-[72px] leading-[0.8] text-white whitespace-pre-line"
            variants={itemVariants}
          >
            {mobileTitle ? (
              <>
                <span className="md:hidden">{mobileTitle}</span>
                <span className="hidden md:inline">{title}</span>
              </>
            ) : title}
          </motion.h1>

          <motion.p
            className="mt-6 max-w-2xl text-lg leading-8 md:text-xl text-white/90"
            variants={itemVariants}
          >
            {subtitle}
          </motion.p>

          <motion.div className="mt-10 flex items-center gap-x-4 flex-wrap justify-center gap-y-3" variants={itemVariants}>
            <Button asChild size="lg">
              <a href={primaryButtonHref}>{primaryButtonText}</a>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <a href={secondaryButtonHref}>{secondaryButtonText}</a>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    );
  }
);

HeroSection.displayName = "HeroSection";

export { HeroSection };
