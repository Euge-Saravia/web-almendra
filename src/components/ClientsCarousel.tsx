"use client";

import Image from "next/image";
import { useState } from "react";

const slides = [
  {
    src: "/images/comentarios-yaniIsola.png",
    alt: "Comentario de Yani Isola"
  },
  {
    src: "/images/comentarios-yaniIsola.png",
    alt: "Comentario de Yani Isola"
  }
];

export default function ClientsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        type="button"
        aria-label="Anterior"
        onClick={handlePrev}
        className="flex h-10 w-10 items-center justify-center rounded-full text-[#b7b1aa] transition-colors hover:text-[#6F553C]"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>

      <div className="relative w-full max-w-[420px] md:w-3/4 md:max-w-none">
        <Image
          src={slides[activeIndex].src}
          alt={slides[activeIndex].alt}
          width={760}
          height={440}
          className="h-auto w-full rounded-2xl shadow-[0_8px_20px_rgba(17,24,39,0.15)]"
          priority={activeIndex === 0}
        />
      </div>

      <button
        type="button"
        aria-label="Siguiente"
        onClick={handleNext}
        className="flex h-10 w-10 items-center justify-center rounded-full text-[#b7b1aa] transition-colors hover:text-[#6F553C]"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
