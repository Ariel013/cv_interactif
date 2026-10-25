import Image from "next/image";
import { notFound } from "next/navigation";
import { preload } from "react-dom";
import { cheminPdf, estLangue, lireContenu, nomAffiche, portfolioClassique } from "@/lib/contenu";
import { lireTextes } from "@/lib/textes";
import { Barre } from "@/components/Barre";
import { Modalites, Monde } from "@/components/monde/Monde";

export const ensureStatic = "navigation";

// Le CV est une île à explorer (ADR 0006). Sans WebGL ou en mouvement réduit,
// une introduction tient lieu d'île : l'essentiel, le PDF et le contact.
export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!estLangue(lang)) notFound();
  const c = lireContenu(lang);
  const t = lireTextes(lang);
  const { identite, alternance } = c;
  const mots = identite.nom.split(" ");
  const pdf = cheminPdf[lang];
  // La police des textes 3D se télécharge dès le HTML, sans attendre three.js.
  preload("/polices/Inter-ExtraBold.ttf", { as: "fetch", crossOrigin: "anonymous" });

  return (
    <>
      <Barre langue={lang} mode="ile" textes={t} />
      <main id="contenu">
        <Monde
          contenu={c}
          langue={lang}
          textes={t.monde}
          pdf={pdf}
          photo={<Image src="/photo.jpg" alt={t.photo(nomAffiche)} width={160} height={200} className="carte-photo" />}
          secours={
            <section className="intro" aria-labelledby="nom">
              <Image src="/photo.jpg" alt={t.photo(nomAffiche)} width={240} height={300} className="intro-photo" priority />
              <p className="intro-etiquette">{t.etiquetteAlternance(alternance.region)}</p>
              <h1 id="nom" className="intro-nom">
                <span>{mots.slice(0, -1).join(" ")}</span> <span className="intro-famille">{mots.at(-1)}</span>
              </h1>
              <p className="intro-titre">{identite.titre}</p>
              <p className="intro-texte">{c.accroche}</p>
              <Modalites contenu={c} />
              <div className="titre-jeu-actions">
                <a href={`mailto:${identite.email}`} className="hud-bouton hud-bouton-plein">
                  {identite.email}
                </a>
                <a href={`tel:${c.telephoneLien}`} className="hud-bouton">
                  {identite.telephone}
                </a>
                <a href={pdf} className="hud-bouton" download>
                  {t.monde.pdf}
                </a>
                <a href={`/${lang}/terminal`} className="hud-bouton">
                  {t.monde.terminal}
                </a>
                <a href={portfolioClassique} className="hud-bouton titre-jeu-large">
                  {t.monde.portfolio} <span aria-hidden="true">→</span>
                </a>
              </div>
            </section>
          }
        />
      </main>
    </>
  );
}
