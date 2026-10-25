import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { lireContact, lireListe, transformerLangue, ecartsDeParite } from "./transformer.mjs";

const contenu = {
  identite: {
    nom: "ARIEL KEVIN SODJINOU",
    titre: "**Développeur Fullstack & IA** | TypeScript · Python",
    contact:
      "Paris, France | 07 59 55 49 25 | [a@b.eu](mailto:a@b.eu) | **[LinkedIn](https://l.in/x)** | **[GitHub](https://gh.com/x)** | **[Portfolio](https://p.app/)**",
  },
  resume: "Résumé.",
  experiences: [
    { periode: "Depuis avr. 2026 :", structure: "**Freelance**", poste: "Dev", points: [{ texte: "Mission" }] },
    { periode: "Janv. 2024 – Juil. 2026 :", structure: "**EPITECH**", poste: "Formateur", points: [{ texte: "A", sous: ["B"] }] },
  ],
  competences: [["Langages", "TS"]],
  formations: [{ intitule: "**Master**, INSTA", periode: "Depuis sept. 2026" }],
  certifications: "**Certifications :** Une · Deux, *Fortinet*",
  langues: "**Langues :** Français · Anglais",
  reserve: { experiences: [{ structure: "**MA-INFO**" }], points: [] },
};
const fiches = { _note: "x", projets: [{ id: "p", titre: "P", _lenteur: "lent", _nouveau: "privé", champInconnu: "x", liens: { demo: null, code: null } }] };
const alternance = { region: "Île-de-France", rythme: "3/1", disponibilite: "immédiate", _duree: "absente" };

test("contact : localisation, téléphone, e-mail et liens", () => {
  assert.deepEqual(lireContact(contenu.identite.contact), {
    localisation: "Paris, France",
    telephone: "07 59 55 49 25",
    email: "a@b.eu",
    liens: { linkedin: "https://l.in/x", github: "https://gh.com/x", portfolio: "https://p.app/" },
  });
});

test("liste : préfixe en gras retiré, italiques gardés", () => {
  assert.deepEqual(lireListe(contenu.certifications), ["Une", "Deux, *Fortinet*"]);
});

test("transformation : Freelance hors du parcours, réserve jamais copiée, clés internes retirées", () => {
  const sortie = transformerLangue({ contenu, fiches, alternance });
  assert.deepEqual(sortie.parcours.map((e) => e.structure), ["EPITECH"]);
  assert.equal(sortie.parcours[0].periode, "Janv. 2024 – Juil. 2026");
  assert.ok(!JSON.stringify(sortie).includes("MA-INFO"));
  assert.ok(!("_lenteur" in sortie.projets[0]));
  assert.ok(!("champInconnu" in sortie.projets[0]), "liste fermée de champs");
  assert.ok(!("_duree" in sortie.alternance));
  assert.equal(sortie.identite.titre, "Développeur Fullstack & IA");
  assert.equal(sortie.projets[0].lenteur, "lent");
  assert.equal(sortie.telephoneLien, "+33759554925");
});

test("parité : un projet manquant en anglais est signalé", () => {
  const fr = transformerLangue({ contenu, fiches, alternance });
  const en = transformerLangue({ contenu, fiches: { projets: [] }, alternance });
  assert.ok(ecartsDeParite(fr, en).some((e) => e.startsWith("projets")));
  assert.deepEqual(ecartsDeParite(fr, fr), []);
});

// Le contenu réellement publié : mêmes faits dans les deux langues (ADR 0005),
// et rien de la réserve du CV maître.
test("contenu publié : parité FR / EN et aucune donnée de réserve", () => {
  const publie = JSON.parse(readFileSync(new URL("../contenu/cv.json", import.meta.url), "utf8"));
  assert.deepEqual(ecartsDeParite(publie.fr, publie.en), []);
  assert.ok(!JSON.stringify(publie).includes("MA-INFO"));
  assert.ok(!JSON.stringify(publie).includes("Freelance"));
  assert.notEqual(publie.source.ref, "copie-de-travail", "copie de travail : à ne jamais publier");
});
