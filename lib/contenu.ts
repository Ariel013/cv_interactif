import { z } from "zod";
import brut from "@/contenu/cv.json";

// Contenu du site : copie publique du CV maître, écrite par
// `scripts/synchroniser.mjs` (ADR 0001). Validée ici, au build : si le format
// du CV maître change, la construction échoue au lieu d'afficher un trou.

export const langues = ["fr", "en"] as const;
export type Langue = (typeof langues)[number];
export const estLangue = (valeur: string): valeur is Langue =>
  (langues as readonly string[]).includes(valeur);

const texte = z.string().min(1);
// Liens publiés : https seulement (ni javascript:, ni data:).
const lienSur = z.url({ protocol: /^https$/ });

const projet = z.object({
  id: texte,
  titre: texte,
  cadre: texte,
  periode: texte,
  ecran: texte,
  probleme: texte,
  realisations: z.array(texte).min(1),
  resultat: texte.nullable(),
  stack: z.array(texte).min(1),
  liens: z.object({ demo: lienSur.nullable(), code: lienSur.nullable() }),
  lenteur: texte.nullable(),
});

const contenuLangue = z.object({
  identite: z.object({
    nom: texte,
    titre: texte,
    technos: z.array(texte),
    localisation: texte,
    telephone: texte,
    email: z.email(),
    liens: z.object({ linkedin: lienSur, github: lienSur, portfolio: lienSur }),
  }),
  telephoneLien: z.string().regex(/^\+\d{8,15}$/),
  resume: texte,
  accroche: texte,
  alternance: z.object({ region: texte, rythme: texte, disponibilite: texte }),
  projets: z.array(projet).min(1),
  parcours: z.array(
    z.object({
      periode: texte,
      structure: texte,
      poste: texte,
      points: z.array(z.object({ texte, sous: z.array(texte) })),
    }),
  ),
  competences: z.array(z.object({ famille: texte, liste: texte })),
  formations: z.array(z.object({ intitule: texte, periode: texte })),
  certifications: z.array(texte),
  langues: z.array(texte),
});

const schema = z.object({
  source: z.object({ depot: texte, ref: texte, commit: texte, empreinte: texte }),
  fr: contenuLangue,
  en: contenuLangue,
});

export type ContenuLangue = z.infer<typeof contenuLangue>;
export type Projet = z.infer<typeof projet>;

const contenu = schema.parse(brut);

export const lireContenu = (langue: Langue): ContenuLangue => contenu[langue];

// « ARIEL KEVIN SODJINOU » → « Ariel Kevin Sodjinou » et « AKS ».
const capitaliser = (mot: string) => mot.charAt(0) + mot.slice(1).toLowerCase();
export const nomAffiche = contenu.fr.identite.nom.split(" ").map(capitaliser).join(" ");
export const initiales = contenu.fr.identite.nom.split(" ").map((mot) => mot.charAt(0)).join("");

// Le portfolio classique, proposé sur l'écran titre. Le lien « Portfolio » du
// CV maître pointe désormais vers ce site-ci (un seul lien sur le CV, qui
// propose les deux expériences) : l'adresse du classique vit donc ici.
export const portfolioClassique = "https://whoisariel.vercel.app/";


// PDF du CV par langue, générés par la synchronisation.
export const cheminPdf: Record<Langue, string> = {
  fr: "/cv/CV_Ariel-Kevin_Sodjinou.pdf",
  en: "/cv/CV_Ariel-Kevin_Sodjinou_EN.pdf",
};
