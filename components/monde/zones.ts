import type { ContenuLangue } from "@/lib/contenu";

// Le monde : une île à explorer. Chaque lieu révèle une part du CV quand on
// s'en approche (découverte progressive). Le départ est au centre ; quatre
// quartiers autour : projets au nord, parcours à l'est, compétences à
// l'ouest, contact au sud.

export type TypeZone = "depart" | "projet" | "parcours" | "competence" | "contact";

export type Zone = {
  id: string;
  type: TypeZone;
  // Indice dans la liste correspondante du contenu (projets, parcours…).
  index: number;
  x: number;
  z: number;
  couleur: string;
  etiquette: string;
  // Pour le parcours : formation ou expérience professionnelle.
  nature?: "formation" | "experience";
};

// Couleurs du portfolio de Kevin : indigo et cyan, plus les couleurs de ses
// familles de compétences.
export const couleurs = {
  indigo: "#4f46e5",
  indigoFonce: "#3730a3",
  cyan: "#06b6d4",
  violet: "#8b5cf6",
  vert: "#10b981",
  bleu: "#3b82f6",
  orange: "#f97316",
  rose: "#f43f5e",
  sarcelle: "#14b8a6",
};

const couleursCompetences = [couleurs.indigo, couleurs.vert, couleurs.cyan, couleurs.violet, couleurs.bleu, couleurs.orange, couleurs.rose];
const couleursProjets = ["#4f46e5", "#4c5be8", "#3f74e6", "#2f8ee0", "#1aa6d8", "#0bb5d1", "#06b6d4"];

export const RAYON_ILE = 24;
export const RAYON_DECOUVERTE = 2.2;

// Parcours dans l'ordre chronologique (du plus ancien au plus récent) : on
// marche dans le temps vers l'est.
export function construireZones(c: ContenuLangue): Zone[] {
  const zones: Zone[] = [{ id: "depart", type: "depart", index: 0, x: 0, z: 0, couleur: couleurs.indigo, etiquette: "" }];

  // Projets : un arc au nord.
  const n = c.projets.length;
  c.projets.forEach((p, i) => {
    const angle = Math.PI * (0.18 + (0.64 * i) / Math.max(1, n - 1));
    zones.push({
      id: `projet-${p.id}`,
      type: "projet",
      index: i,
      x: Math.cos(angle) * -14,
      z: -Math.sin(angle) * 14 - 1,
      couleur: couleursProjets[i % couleursProjets.length],
      etiquette: p.titre,
    });
  });

  // Parcours : une allée de jalons vers l'est, expériences puis formations,
  // du plus ancien au plus récent.
  // Index négatif : une formation (-1 → formations[0]).
  const annee = (periode: string) => Number(periode.match(/\d{4}/)?.[0] ?? 0);
  const jalons = [
    ...c.parcours.map((e, i) => ({ index: i, annee: annee(e.periode), etiquette: String(annee(e.periode)), nature: "experience" as const })),
    ...c.formations.map((f, i) => ({ index: -1 - i, annee: annee(f.periode), etiquette: String(annee(f.periode)), nature: "formation" as const })),
  ].sort((a, b) => a.annee - b.annee);
  jalons.forEach((j, i) => {
    const t = i / Math.max(1, jalons.length - 1);
    zones.push({
      id: `parcours-${i}`,
      type: "parcours",
      index: j.index,
      x: 6 + t * 13,
      z: 3 + Math.sin(t * Math.PI * 1.5) * 3.2,
      couleur: j.nature === "formation" ? couleurs.violet : couleurs.sarcelle,
      etiquette: j.etiquette,
      nature: j.nature,
    });
  });

  // Compétences : des cristaux à l'ouest.
  c.competences.forEach((k, i) => {
    const angle = (i / c.competences.length) * Math.PI * 2;
    zones.push({
      id: `competence-${i}`,
      type: "competence",
      index: i,
      x: -12 + Math.cos(angle) * 4.6,
      z: 6 + Math.sin(angle) * 4.6,
      couleur: couleursCompetences[i % couleursCompetences.length],
      etiquette: k.famille,
    });
  });

  // Contact : un portail au sud.
  zones.push({ id: "contact", type: "contact", index: 0, x: 0, z: 16, couleur: couleurs.cyan, etiquette: "" });
  return zones;
}
