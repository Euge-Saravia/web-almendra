"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  {
    src: "/images/banner-slide-1.jpeg",
    mobileSrc: "/images/banner-slide1-mobile.png",
    alt: "Banner Almendra 1"
  },
  {
    src: "/images/banner-slide-2.jpg",
    mobileSrc: "/images/banner-slide2-mobile.png",
    alt: "Banner Almendra 2"
  }
];

const SLIDE_INTERVAL_MS = 5000;

export default function BannerCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="relative w-full overflow-hidden">
      <div className="relative h-[240px] w-full md:h-[460px]">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          const sharedClassName = `transition-opacity duration-700 ${
            isActive ? "opacity-100" : "opacity-0"
          }`;

          return (
            <div key={slide.src} className="absolute inset-0">
              <Image
                src={slide.mobileSrc}
                alt={slide.alt}
                fill
                sizes="100vw"
                className={`object-contain object-top md:hidden ${sharedClassName}`}
                priority={index === 0}
              />
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(min-width: 1024px) 1024px, 100vw"
                className={`hidden object-contain md:block md:object-cover ${sharedClassName}`}
                priority={index === 0}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
