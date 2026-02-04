"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  {
    src: "/images/portfolio-redesSociales-mobile.png",
    alt: "Portfolio redes sociales",
    label: "Redes Sociales"
  },
  {
    src: "/images/portfolio-tiendaNube-Mobile.png",
    alt: "Portfolio tienda nube",
    label: "Tienda Nube"
  }
];

const SLIDE_INTERVAL_MS = 5000;

export default function PortfolioCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative w-full aspect-[2/1]">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          const sharedClassName = `transition-opacity duration-700 ${
            isActive ? "opacity-100" : "opacity-0"
          }`;

          return (
            <div key={slide.src} className="absolute inset-0">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="100vw"
                className={`object-contain ${sharedClassName} z-0`}
                priority={index === 0}
              />
              <div
                className={`absolute inset-0 bg-[#D0B4B7] opacity-70 ${sharedClassName} z-10`}
              />
              <div
                className={`absolute inset-0 flex items-center justify-center px-6 ${sharedClassName} z-20`}
              >
                <p className="portfolio-label text-center text-[2.5rem] leading-tight text-white">
                  {slide.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
