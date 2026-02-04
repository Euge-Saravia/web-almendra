"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { label: "Servicios", href: "#servicios" },
  { label: "Nosotras", href: "#nosotras" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contacto", href: "#contacto" }
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent | TouchEvent) {
      const target = event.target as Node | null;
      if (!target) return;
      if (menuRef.current?.contains(target)) return;
      if (buttonRef.current?.contains(target)) return;
      setIsOpen(false);
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, []);

  return (
    <header className="relative flex items-center justify-between px-6 py-5">
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/banner-background-nav.png"
          alt=""
          fill
          priority
          className="object-cover"
        />
      </div>
      <Image
        src="/images/logo-almendra.png"
        alt="Almendra"
        width={189}
        height={39}
        className="z-10 h-auto w-[140px] md:w-[189px]"
      />
      <nav className="z-10 hidden items-center md:flex">
        <ul className="flex items-center gap-8 text-xs uppercase tracking-[0.35em] text-almond-700">
          {navItems.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="transition hover:text-almond-900">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <button
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        ref={buttonRef}
        className="z-10 flex h-10 w-10 items-center justify-center md:hidden"
      >
        <span className="flex flex-col gap-1">
          <span className="h-0.5 w-5 bg-almond-700" />
          <span className="h-0.5 w-5 bg-almond-700" />
          <span className="h-0.5 w-5 bg-almond-700" />
        </span>
      </button>

      <nav
        ref={menuRef}
        className={`absolute right-6 top-[72px] z-20 w-56 rounded-2xl border border-almond-700/10 bg-white/95 p-4 text-almond-700 shadow-lg backdrop-blur transition-all duration-300 ease-out md:hidden ${
          isOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-95 opacity-0"
        }`}
      >
        <ul className="space-y-3 text-sm">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="block rounded-lg px-3 py-2 transition hover:bg-almond-50"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
