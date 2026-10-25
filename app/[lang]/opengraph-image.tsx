import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { estLangue, langues, lireContenu, nomAffiche } from "@/lib/contenu";
import { lireTextes } from "@/lib/textes";

// Aperçu de partage (e-mail, LinkedIn) : le dossard de l'ouverture.

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = nomAffiche;

export function generateStaticParams() {
  return langues.map((lang) => ({ lang }));
}

const police = (fichier: string) => readFile(join(process.cwd(), "public", "polices", fichier));

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!estLangue(lang)) notFound();
  const langue = lang;
  const { identite, alternance } = lireContenu(langue);
  const etiquette = lireTextes(langue).etiquetteAlternance(alternance.region);
  const mots = nomAffiche.split(" ");
  const inter = await police("Inter-ExtraBold.ttf");

  // Aux couleurs du portfolio : fond ardoise clair, nom en indigo.
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: "60px 80px",
          background: "linear-gradient(135deg, #eef2ff 0%, #f8fafc 55%, #ecfeff 100%)",
          color: "#0f172a",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, color: "#4f46e5", letterSpacing: 1 }}>{etiquette.toUpperCase()}</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 112, lineHeight: 1, letterSpacing: -4, marginTop: 20 }}>
          <span>{mots.slice(0, -1).join(" ")}</span>
          <span style={{ color: "#4f46e5" }}>{mots.at(-1)}</span>
        </div>
        <div style={{ display: "flex", fontSize: 40, color: "#475569", marginTop: 24 }}>{identite.titre}</div>
        <div style={{ display: "flex", width: 220, height: 10, borderRadius: 5, marginTop: 34, background: "linear-gradient(90deg, #4f46e5, #06b6d4)" }} />
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Inter", data: inter, weight: 800, style: "normal" }],
    },
  );
}
