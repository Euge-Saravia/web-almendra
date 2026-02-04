import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

export type HomeContent = {
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutBodyHtml: string;
  servicesTitle: string;
  services: string[];
  socialTitle: string;
  socialBodyHtml: string;
};

export type SiteConfig = {
  whatsappNumber: string;
  whatsappUrl: string;
  instagramUrl: string;
};

const contentPath = path.join(process.cwd(), "content", "home.md");
const siteConfigPath = path.join(process.cwd(), "content", "site.md");

const buildWhatsAppUrl = (number: string) => {
  const digits = number.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "";
};

export async function getHomeContent(): Promise<HomeContent> {
  const file = fs.readFileSync(contentPath, "utf8");
  const { data } = matter(file);

  const aboutBody = typeof data.aboutBody === "string" ? data.aboutBody : "";
  const aboutBodyHtml = String(await remark().use(html).process(aboutBody));
  const socialBody = typeof data.socialBody === "string" ? data.socialBody : "";
  const socialBodyHtml = String(await remark().use(html).process(socialBody));

  return {
    heroTitle: String(data.heroTitle || ""),
    heroSubtitle: String(data.heroSubtitle || ""),
    aboutTitle: String(data.aboutTitle || ""),
    aboutBodyHtml,
    servicesTitle: String(data.servicesTitle || ""),
    services: Array.isArray(data.services)
      ? data.services.map((item) => String(item))
      : [],
    socialTitle: String(data.socialTitle || ""),
    socialBodyHtml,
  };
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const file = fs.readFileSync(siteConfigPath, "utf8");
  const { data } = matter(file);
  const whatsappNumber = String(data.whatsappNumber || "");
  const instagramUrl = String(data.instagramUrl || "");

  return {
    whatsappNumber,
    whatsappUrl: buildWhatsAppUrl(whatsappNumber),
    instagramUrl,
  };
}
