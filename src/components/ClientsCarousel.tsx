"use client";

import Image from "next/image";
import { useState } from "react";

const mobileSlides = [
  {
    mobileSrc: "/images/comentarios-agus-mobile.png",
    alt: "Comentario de Agus"
  },
  {
    mobileSrc: "/images/comentarios-yani-mobile.png",
    alt: "Comentario de Yani Isola"
  },
  {
    mobileSrc: "/images/comentarios-marga-mobile.png",
    alt: "Comentario de Marga"
  },
  {
    mobileSrc: "/images/comentarios-pinomar-mobile.png",
    alt: "Comentario de Pinomar"
  }
];

const desktopSlides = [
  {
    desktopSrc: "/images/comentarios-yaniIsola-desktop.png",
    alt: "Comentario de Yani Isola"
  },
  {
    desktopSrc: "/images/comentarios-agus-desktop.png",
    alt: "Comentario de Agus"
  },
  {
    desktopSrc: "/images/comentarios-marga-desktop.png",
    alt: "Comentario de Marga"
  },
  {
    desktopSrc: "/images/comentarios-pinomar-desktop.png",
    alt: "Comentario de Pinomar"
  }
];

export default function ClientsCarousel() {
  const [mobileIndex, setMobileIndex] = useState(0);
  const [desktopIndex, setDesktopIndex] = useState(0);

  const handlePrevMobile = () => {
    setMobileIndex((prev) => (prev - 1 + mobileSlides.length) % mobileSlides.length);
  };

  const handleNextMobile = () => {
    setMobileIndex((prev) => (prev + 1) % mobileSlides.length);
  };

  const handlePrevDesktop = () => {
    setDesktopIndex((prev) => (prev - 1 + desktopSlides.length) % desktopSlides.length);
  };

  const handleNextDesktop = () => {
    setDesktopIndex((prev) => (prev + 1) % desktopSlides.length);
  };

  return (
    <div className="mt-4 md:mt-8">
      <div className="flex items-center justify-center gap-2 md:hidden">
        <button
          type="button"
          aria-label="Anterior"
          onClick={handlePrevMobile}
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

        <div className="relative w-full max-w-[420px]">
          <Image
            src={mobileSlides[mobileIndex].mobileSrc}
            alt={mobileSlides[mobileIndex].alt}
            width={760}
            height={440}
            className="h-auto w-full"
            priority={mobileIndex === 0}
          />
        </div>

        <button
          type="button"
          aria-label="Siguiente"
          onClick={handleNextMobile}
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

      <div className="hidden items-center justify-center gap-2 md:flex">
        <button
          type="button"
          aria-label="Anterior"
          onClick={handlePrevDesktop}
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

        <div className="relative w-full md:w-[65%] md:max-w-none">
          <Image
            src={desktopSlides[desktopIndex].desktopSrc}
            alt={desktopSlides[desktopIndex].alt}
            width={900}
            height={520}
            className="h-auto w-full rounded-2xl shadow-[0_8px_20px_rgba(17,24,39,0.15)]"
            priority={desktopIndex === 0}
          />
        </div>

        <button
          type="button"
          aria-label="Siguiente"
          onClick={handleNextDesktop}
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
    </div>
  );
}
