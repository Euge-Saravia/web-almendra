import { getHomeContent, getSiteConfig } from "@/lib/content";
import Header from "@/components/Header";
import BannerCarousel from "@/components/BannerCarousel";
import PortfolioCarousel from "@/components/PortfolioCarousel";
import ClientsCarousel from "@/components/ClientsCarousel";
import ContactForm from "@/components/ContactForm";
import Image from "next/image";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";

export default async function HomePage() {
  const [content, siteConfig] = await Promise.all([getHomeContent(), getSiteConfig()]);
  const whatsappUrl = siteConfig.whatsappUrl || "https://wa.me/5493413356168";
  const instagramUrl =
    siteConfig.instagramUrl || "https://www.instagram.com/almendra.estudiodigital/";

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <Header />
      <BannerCarousel />

      <section id="servicios" className="px-8 pb-16 pt-0 md:px-0 md:pb-16 md:pt-0">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 md:max-w-none md:flex-row md:items-stretch md:gap-16 md:pl-12">
          <div className="flex-1 text-center md:flex md:flex-col md:pb-10 md:pt-24 md:text-left">
            <div className="mb-12 flex items-center justify-center gap-6 md:justify-start">
              <h2 className="section-title text-[2rem] md:text-[3rem]">
                {content.servicesTitle}
              </h2>
              <Image
                src="/images/paleta-de-colores.png"
                alt="Paleta de colores"
                width={180}
                height={24}
                className="h-5 w-auto md:h-7"
              />
            </div>
            <div className="mx-auto flex w-full flex-col gap-10 text-center text-almond-700 md:mx-0 md:flex-1 md:justify-between md:text-center">
              {content.services.map((service, index) => (
                <div key={service} className="flex flex-col items-center gap-4">
                  <p className="services-item text-2xl md:text-[2rem]">{service}</p>
                  <span
                    className={`hidden h-[2.5px] w-full bg-[#6f553c] md:block md:max-w-[480px] ${
                      index % 2 === 0 ? "md:self-end" : "md:self-start"
                    }`}
                  />
                  <div className="section-divider mx-auto w-[70%] max-w-[260px] md:hidden" />
                </div>
              ))}
            </div>
          </div>
          <div className="hidden w-full flex-1 md:block">
            <Image
              src="/images/servicios-img-desktop.png"
              alt="Servicios"
              width={900}
              height={900}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section id="nosotras" className="pt-0 pb-0 md:px-0 md:pt-0 md:pb-0">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 md:max-w-none md:flex-row md:items-center md:gap-16 md:pr-12">
          <div className="relative w-full md:-mt-8 md:w-1/2">
            <Image
              src="/images/banner-nosotras-mobile.jpeg"
              alt="Nosotras"
              width={900}
              height={1100}
              className="w-full object-cover md:hidden"
            />
            <Image
              src="/images/banner-nosotras-desktop.jpeg"
              alt="Nosotras"
              width={900}
              height={1100}
              className="hidden w-full object-cover md:block"
            />
            <Image
              src="/images/logo-redondo.png"
              alt="Almendra"
              width={120}
              height={120}
              className="absolute -right-10 top-20 hidden md:block"
            />
          </div>
          <div className="w-full px-8 text-center md:w-1/2 md:px-0 md:text-left">
            <div className="mb-6 flex items-center justify-center gap-3 md:justify-start">
              <h2 className="section-title text-[2rem] md:text-[3rem]">
                {content.aboutTitle}
              </h2>
              <Image
                src="/images/paleta-de-colores.png"
                alt="Paleta de colores"
                width={180}
                height={24}
                className="h-5 w-auto md:h-7"
              />
            </div>
            <div
              className="body-copy space-y-6 text-base leading-relaxed text-almond-700 md:text-base"
              dangerouslySetInnerHTML={{ __html: content.aboutBodyHtml }}
            />
          </div>
        </div>
      </section>
      <section className="w-full">
        <Image
          src="/images/banner-redesSociales-mobile.png"
          alt="Redes sociales"
          width={1600}
          height={900}
          className="h-auto w-full object-cover md:hidden"
        />
      </section>

      <section
        id="redes-sociales"
        className="px-8 pb-20 pt-12 md:pl-12 md:pr-0 md:pt-0"
      >
        <div className="flex w-full flex-col gap-10 text-center md:flex-row md:items-center md:gap-16">
          <div className="md:w-1/2 md:text-left">
            <div className="mb-6 flex items-center justify-center gap-3 md:justify-start">
              <h2 className="section-title text-[2rem] md:text-[3rem]">
                {content.socialTitle}
              </h2>
              <Image
                src="/images/paleta-de-colores.png"
                alt="Paleta de colores"
                width={180}
                height={24}
                className="h-5 w-auto md:h-7"
              />
            </div>
            <div
              className="body-copy space-y-6 text-sm leading-relaxed text-almond-700"
              dangerouslySetInnerHTML={{ __html: content.socialBodyHtml }}
            />
          </div>
          <div className="relative hidden w-full md:block md:w-1/2">
            <Image
              src="/images/banner-redesSociales-desktop.png"
              alt="Redes sociales"
              width={900}
              height={1100}
              className="h-full w-full object-cover"
            />
            <Image
              src="/images/logo-redondo.png"
              alt="Almendra"
              width={120}
              height={120}
              className="absolute -left-14 top-20 hidden md:block"
            />
          </div>
        </div>
      </section>

      <section id="portfolio" className="px-8 pb-2 pt-0 md:pl-12 md:pr-0">
        <div className="flex w-full items-center justify-center gap-3 text-center md:justify-start md:text-left">
          <h2 className="section-title text-[2rem] md:text-[3rem]">Portfolio</h2>
          <Image
            src="/images/paleta-de-colores.png"
            alt="Paleta de colores"
            width={180}
            height={24}
            className="h-5 w-auto md:h-7"
          />
        </div>
        <div className="mt-10 -mx-8 w-screen md:hidden">
          <PortfolioCarousel />
        </div>
        <div className="mt-10 hidden md:grid md:w-[calc(100%+3rem)] md:-ml-12 md:grid-cols-4">
          <div className="group relative">
            <Image
              src="/images/portfolio-redesSociales-desktop.png"
              alt="Portfolio redes sociales"
              width={900}
              height={900}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#BF8271] opacity-0 transition-opacity duration-300 group-hover:opacity-70" />
            <div className="absolute inset-0 flex items-center justify-center px-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="portfolio-label text-center text-[2.5rem] leading-tight text-white">
                Redes Sociales
              </p>
            </div>
          </div>
          <div className="group relative">
            <Image
              src="/images/portfolio-identidadVisual-desktop.png"
              alt="Portfolio identidad visual"
              width={900}
              height={900}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#D0B4B7] opacity-0 transition-opacity duration-300 group-hover:opacity-70" />
            <div className="absolute inset-0 flex items-center justify-center px-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="portfolio-label text-center text-[2.5rem] leading-tight text-white">
                Identidad Visual
              </p>
            </div>
          </div>
          <div className="group relative">
            <Image
              src="/images/portfolio-reBranding-desktop.png"
              alt="Portfolio rebranding"
              width={900}
              height={900}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#BF8271] opacity-0 transition-opacity duration-300 group-hover:opacity-70" />
            <div className="absolute inset-0 flex items-center justify-center px-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="portfolio-label text-center text-[2.5rem] leading-tight text-white">
                Re Branding
              </p>
            </div>
          </div>
          <div className="group relative">
            <Image
              src="/images/portfolio-tiendaNube-desktop.png"
              alt="Portfolio tienda nube"
              width={900}
              height={900}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[#D0B4B7] opacity-0 transition-opacity duration-300 group-hover:opacity-70" />
            <div className="absolute inset-0 flex items-center justify-center px-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="portfolio-label text-center text-[2.5rem] leading-tight text-white">
                Tienda Nube
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 pt-12">
        <h2 className="clients-title text-center text-[2rem] text-[#6F553C] md:text-[3rem]">
          Nuestros Clientes Dicen...
        </h2>
        <ClientsCarousel />
      </section>

      <section id="contacto" className="px-8 pb-16 pt-0 md:px-0 md:pb-24">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-8 hidden items-center gap-3 md:flex md:pl-12">
            <h2 className="section-title text-[2rem] md:text-[3rem]">Contacto</h2>
            <Image
              src="/images/paleta-de-colores.png"
              alt="Paleta de colores"
              width={180}
              height={24}
              className="h-5 w-auto md:h-7"
            />
          </div>

          <div className="hidden md:flex md:gap-16 md:pl-12 md:pr-12">
            <div className="md:w-1/2 md:pt-[4.5rem]">
              <h3 className="contact-title mb-6 text-[2.5rem] text-[#6F553C]">
                Hablemos de tu proyecto
              </h3>
              <p className="body-copy max-w-md text-base leading-relaxed text-almond-700">
                Contanos en qué etapa está tu marca y qué necesitás hoy. Nos encanta
                escuchar ideas y pensar estrategias a medida.
              </p>
              <div className="mt-8 flex w-full items-center gap-4">
                <span className="h-px flex-1 bg-[#E6D6CF]" />
                <div className="flex items-center gap-3">
                  <a
                    href={whatsappUrl}
                    aria-label="WhatsApp"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EADBD2] text-[#6F553C]"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <FaWhatsapp className="h-5 w-5" />
                  </a>
                  <a
                    href={instagramUrl}
                    aria-label="Instagram"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EADBD2] text-[#6F553C]"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <FaInstagram className="h-5 w-5" />
                  </a>
                </div>
                <span className="h-px flex-1 bg-[#E6D6CF]" />
              </div>
              <p className="body-copy mt-6 text-base text-almond-700">
                También podés escribirnos por acá
              </p>
            </div>
            <div className="md:w-1/2">
              <div className="rounded-3xl bg-white/80 px-8 py-10 shadow-lg">
                <ContactForm showIntro={false} showLabels />
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <div className="mx-auto flex w-full max-w-6xl flex-col items-center text-center">
              <div className="mb-6 flex items-center justify-center gap-3">
                <h2 className="section-title text-[2rem]">Contacto</h2>
                <Image
                  src="/images/paleta-de-colores.png"
                  alt="Paleta de colores"
                  width={180}
                  height={24}
                  className="h-5 w-auto"
                />
              </div>
              <h3 className="contact-title mb-4 text-[1.5rem] text-[#6F553C]">
                Hablemos de tu proyecto
              </h3>
              <p className="body-copy max-w-md text-base leading-relaxed text-almond-700">
                Contanos en qué etapa está tu marca y qué necesitás hoy. Nos encanta
                escuchar ideas y pensar estrategias a medida.
              </p>
              <div className="mt-6 flex w-full items-center gap-4">
                <span className="h-px flex-1 bg-[#E6D6CF]" />
                <div className="flex items-center gap-3">
                  <a
                    href={whatsappUrl}
                    aria-label="WhatsApp"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EADBD2] text-[#6F553C]"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <FaWhatsapp className="h-5 w-5" />
                  </a>
                  <a
                    href={instagramUrl}
                    aria-label="Instagram"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EADBD2] text-[#6F553C]"
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <FaInstagram className="h-5 w-5" />
                  </a>
                </div>
                <span className="h-px flex-1 bg-[#E6D6CF]" />
              </div>
              <div className="mt-8 w-full max-w-md">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <a
        href={whatsappUrl}
        aria-label="Abrir chat de WhatsApp"
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6F553C] focus-visible:ring-offset-2 md:bottom-6 md:right-6 md:h-14 md:w-14"
        target="_blank"
        rel="noreferrer noopener"
      >
        <FaWhatsapp className="h-6 w-6 md:h-7 md:w-7" />
      </a>

      <footer className="bg-[#E2D3CC] text-[#6F553C]">
        <div className="mx-auto w-full max-w-6xl px-8 pt-8 pb-6">
          <div className="hidden items-center gap-8 md:flex">
            <span className="block h-px w-full bg-[#E6D6CF]" />
            <Image
              src="/images/paleta-de-colores.png"
              alt="Paleta de colores"
              width={220}
              height={32}
              className="h-7 w-auto"
            />
            <span className="block h-px w-full bg-[#E6D6CF]" />
          </div>

          <div className="mx-auto flex w-full max-w-md flex-col items-center text-center md:mt-10 md:max-w-none md:flex-row md:items-center md:justify-between md:gap-10 md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <Image
                src="/images/logo-almendra.png"
                alt="Almendra"
                width={192}
                height={40}
                className="mb-4 h-auto w-auto md:h-10 md:w-48"
              />
              <p className="footer-title text-[1.2rem] leading-tight md:text-[1.5rem]">
                Llevamos tu marca
                <br />
                al siguiente nivel
              </p>
            </div>

            <span className="hidden h-24 w-px bg-[#E6D6CF] md:block" />

            <nav className="body-copy my-6 flex flex-col gap-3 text-base md:my-0 md:text-[1.3rem]">
              <a href="#servicios" className="transition-opacity hover:opacity-80">
                Servicios
              </a>
              <a href="#nosotras" className="transition-opacity hover:opacity-80">
                Nosotras
              </a>
              <a href="#redes-sociales" className="transition-opacity hover:opacity-80">
                Redes Sociales
              </a>
              <a href="#contacto" className="transition-opacity hover:opacity-80">
                Contacto
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <a
                href={whatsappUrl}
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EADBD2] text-[#6F553C] md:h-20 md:w-20"
                target="_blank"
                rel="noreferrer noopener"
              >
                <FaWhatsapp className="h-5 w-5 md:h-8 md:w-8" />
              </a>
              <a
                href={instagramUrl}
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EADBD2] text-[#6F553C] md:h-20 md:w-20"
                target="_blank"
                rel="noreferrer noopener"
              >
                <FaInstagram className="h-5 w-5 md:h-8 md:w-8" />
              </a>
            </div>
          </div>

          <div className="mt-8">
            <span className="block h-px w-full bg-[#E6D6CF]" />
            <p className="body-copy mt-0 text-center text-sm md:mt-6">
              © 2026 Almendra · Estudio Digital
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
