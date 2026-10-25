// Transforme les fichiers du CV maître (optimisation_cv) en contenu public du
// site (ADR 0001). Fonctions pures : aucune lecture de fichier ici, pour être
// testées sans le dépôt source.

const sansGras = (texte) => texte.replace(/\*\*/g, '').trim();
const sansDeuxPoints = (texte) => texte.replace(/\s*:\s*$/, '').trim();

// « Paris, France | 07 … | [mail](mailto:…) | **[LinkedIn](url)** … »
export function lireContact(contact) {
  const morceaux = contact.split(' | ').map((m) => m.trim());
  const liens = {};
  let email = null;
  let telephone = null;
  let localisation = null;
  for (const morceau of morceaux) {
    const lien = morceau.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (lien) {
      const [, libelle, url] = lien;
      if (url.startsWith('mailto:')) email = url.slice('mailto:'.length);
      else liens[libelle.toLowerCase()] = url;
    } else if (/^\+?[\d ]{9,}$/.test(morceau)) {
      telephone = morceau;
    } else if (!localisation) {
      localisation = morceau;
    }
  }
  return { localisation, telephone, email, liens };
}

// « **Certifications :** A · B » → ['A', 'B'] (italiques gardés pour le rendu)
export function lireListe(texte) {
  return texte
    .replace(/^\*\*[^*]+\*\*\s*/, '')
    .split(' · ')
    .map((e) => e.trim())
    .filter(Boolean);
}

// Liste fermée : un champ ajouté plus tard au CV maître ne devient pas public
// sans passer par ici.
const lireProjet = (p) => ({
  id: p.id,
  titre: p.titre,
  cadre: p.cadre,
  periode: p.periode,
  ecran: p.ecran,
  probleme: p.probleme,
  realisations: p.realisations,
  resultat: p.resultat,
  stack: p.stack,
  liens: { demo: p.liens.demo, code: p.liens.code },
  lenteur: p._lenteur ?? null,
});

// Le tiret cadratin ne s'affiche pas sur le site (convention de copie) : il
// devient une virgule dans les intitulés de poste.
const sansCadratin = (texte) => texte.replace(/\s*—\s*/g, ', ');

// « 07 59 55 49 25 » → « +33759554925 », pour un lien tel:.
export function telephoneInternational(telephone) {
  const chiffres = telephone.replace(/[^\d+]/g, '');
  return chiffres.startsWith('0') ? `+33${chiffres.slice(1)}` : chiffres;
}

// Les missions « Freelance » sont affichées comme projets réalisés, jamais comme
// une expérience (règle d'or 5 de CLAUDE.md) : elles sont dans les fiches.
const estFreelance = (experience) => sansGras(experience.structure) === 'Freelance';

export function transformerLangue({ contenu, fiches, alternance }) {
  const [titre, technos = ''] = contenu.identite.titre.split(' | ');
  return {
    identite: {
      nom: contenu.identite.nom,
      titre: sansGras(titre),
      technos: technos.split(' · ').map((t) => t.trim()).filter(Boolean),
      ...lireContact(contenu.identite.contact),
    },
    telephoneLien: telephoneInternational(lireContact(contenu.identite.contact).telephone ?? ''),
    resume: contenu.resume,
    // Version courte du profil, pour le jeu ; le résumé du CV à défaut.
    accroche: fiches.accroche ?? contenu.resume,
    alternance: {
      region: alternance.region,
      rythme: alternance.rythme,
      disponibilite: alternance.disponibilite,
    },
    projets: fiches.projets.map(lireProjet),
    parcours: contenu.experiences.filter((e) => !estFreelance(e)).map((e) => ({
      periode: sansDeuxPoints(e.periode),
      structure: sansGras(e.structure),
      poste: sansCadratin(e.poste),
      points: e.points.map((p) => ({ texte: p.texte, sous: p.sous ?? [] })),
    })),
    competences: contenu.competences.map(([famille, liste]) => ({ famille, liste })),
    formations: contenu.formations.map((f) => ({ intitule: f.intitule, periode: f.periode })),
    certifications: lireListe(contenu.certifications),
    langues: lireListe(contenu.langues),
  };
}

// Contrôle de parité FR / EN (ADR 0005) : mêmes projets, mêmes liens, même
// nombre d'entrées partout. Renvoie la liste des écarts, vide si tout va bien.
export function ecartsDeParite(fr, en) {
  const ecarts = [];
  const comparer = (nom, a, b) => {
    if (JSON.stringify(a) !== JSON.stringify(b)) ecarts.push(`${nom} : ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`);
  };
  comparer('projets', fr.projets.map((p) => p.id), en.projets.map((p) => p.id));
  comparer('liens des projets', fr.projets.map((p) => p.liens), en.projets.map((p) => p.liens));
  comparer('parcours', fr.parcours.map((e) => e.points.length), en.parcours.map((e) => e.points.length));
  comparer('compétences', fr.competences.length, en.competences.length);
  comparer('formations', fr.formations.length, en.formations.length);
  comparer('certifications', fr.certifications.length, en.certifications.length);
  comparer('langues', fr.langues.length, en.langues.length);
  comparer('contact', { ...fr.identite.liens, e: fr.identite.email }, { ...en.identite.liens, e: en.identite.email });
  const liensTexte = (l) => JSON.stringify(l.parcours).match(/\]\(([^)]+)\)/g) ?? [];
  comparer('liens du parcours', liensTexte(fr), liensTexte(en));
  // Les dates sont traduites (« Avr. » / « Apr. ») : on compare les années.
  const annees = (l) => JSON.stringify([l.projets.map((p) => p.periode), l.parcours.map((e) => e.periode), l.formations.map((f) => f.periode)]).match(/\d{4}/g);
  comparer('années', annees(fr), annees(en));
  return ecarts;
}
