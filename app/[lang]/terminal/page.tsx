import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cheminPdf, estLangue, lireContenu, nomAffiche } from "@/lib/contenu";
import { lireTextes } from "@/lib/textes";
import { Barre } from "@/components/Barre";
import { Terminal } from "@/components/terminal/Terminal";

export const ensureStatic = "navigation";

export async function generateMetadata({ params }: PageProps<"/[lang]/terminal">): Promise<Metadata> {
  const { lang } = await params;
  if (!estLangue(lang)) return {};
  const c = lireContenu(lang);
  return {
    title: `${nomAffiche} · ${lireTextes(lang).terminal.titre}`,
    description: lireTextes(lang).description(c.identite.titre, c.alternance),
    alternates: { canonical: `/${lang}/terminal`, languages: { fr: "/fr/terminal", en: "/en/terminal" } },
  };
}

// Le CV en mode terminal (ADR 0004), à côté de l'île.
export default async function PageTerminal({ params }: PageProps<"/[lang]/terminal">) {
  const { lang } = await params;
  if (!estLangue(lang)) notFound();
  const t = lireTextes(lang);
  return (
    <>
      <Barre langue={lang} mode="terminal" textes={t} />
      <main id="contenu">
        <h1 className="sr-only">{t.terminal.titre}</h1>
        <Terminal contenu={lireContenu(lang)} langue={lang} textes={t.terminal} pdf={cheminPdf[lang]} />
      </main>
    </>
  );
}
