import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Inter, JetBrains_Mono } from "next/font/google";
import { estLangue, langues, lireContenu, nomAffiche } from "@/lib/contenu";
import { lireTextes } from "@/lib/textes";
import "../globals.css";

// Inter partout, comme le portfolio de Kevin : l'identité visuelle prime.
const inter = Inter({ subsets: ["latin"], variable: "--police-texte" });
// Chasse fixe du mode terminal.
const fixe = JetBrains_Mono({ subsets: ["latin"], variable: "--police-fixe" });

// Adresse publique, pour les liens absolus de l'aperçu de partage. Sur Vercel,
// le domaine de production est fourni ; en local, localhost.
const site =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export function generateStaticParams() {
  return langues.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!estLangue(lang)) return {};
  const { identite, alternance } = lireContenu(lang);
  const nom = nomAffiche;
  const description = lireTextes(lang).description(identite.titre, alternance);
  return {
    metadataBase: new URL(site),
    title: `${nom} · ${identite.titre}`,
    description,
    alternates: { canonical: `/${lang}`, languages: { fr: "/fr", en: "/en" } },
    openGraph: {
      type: "profile",
      title: `${nom} · ${identite.titre}`,
      description,
      locale: lang === "fr" ? "fr_FR" : "en_GB",
      url: `/${lang}`,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#f8fafc",
};

export default async function RacineLangue({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!estLangue(lang)) notFound();
  return (
    <html lang={lang} className={`${inter.variable} ${fixe.variable}`}>
      <body>{children}</body>
    </html>
  );
}
