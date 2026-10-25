// Synchronise le contenu du site depuis le CV maître (ADR 0001, 0005).
//
// Lit les fichiers dans l'historique git du dépôt source, à la référence
// `dev`, jamais dans sa copie de travail : une autre session y change de
// branche à tout moment (journal du 2026-10-25).
//
//   node scripts/synchroniser.mjs           écrit contenu/cv.json
//   node scripts/synchroniser.mjs --pdf     régénère aussi les PDF publics
//   node scripts/synchroniser.mjs --verifier  dit si la copie est périmée
//
// Variables : CV_MAITRE_DEPOT (défaut ~/PROJETS/optimisation_cv),
// CV_MAITRE_REF (défaut dev), CV_MAITRE_DOSSIER (copie de travail, aperçu
// seulement : jamais commitée ni publiée, et sans --pdf).

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformerLangue, ecartsDeParite } from './transformer.mjs';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..');
const depot = process.env.CV_MAITRE_DEPOT ?? join(homedir(), 'PROJETS', 'optimisation_cv');
const ref = process.env.CV_MAITRE_REF ?? 'dev';
// Une référence git, jamais une option (« --output=… ») : refusée sinon.
if (!/^[\w][\w./-]*$/.test(ref)) {
  console.error(`Référence refusée : ${ref}`);
  process.exit(1);
}
const cible = join(racine, 'contenu', 'cv.json');
const fichiers = ['cv/contenu.json', 'cv/contenu.en.json', 'cv/fiches-projets.json', 'cv/fiches-projets.en.json', 'cv/lettre.json'];

const git = (...args) => execFileSync('git', ['-C', depot, ...args], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
// CV_MAITRE_DOSSIER : lit une copie de travail plutôt que l'historique, pour
// prévisualiser un changement du CV maître pas encore commité. Jamais pour
// publier.
const dossier = process.env.CV_MAITRE_DOSSIER;
if (dossier && process.argv.includes('--pdf')) {
  console.error('--pdf lit toujours une référence git : refusé avec CV_MAITRE_DOSSIER.');
  process.exit(1);
}
const lire = (chemin) => (dossier ? readFileSync(join(dossier, chemin), 'utf8') : git('show', `${ref}:${chemin}`));

const bruts = Object.fromEntries(fichiers.map((f) => [f, lire(f)]));
const empreinte = createHash('sha256').update(fichiers.map((f) => bruts[f]).join('\0')).digest('hex').slice(0, 16);

if (process.argv.includes('--verifier')) {
  const actuelle = existsSync(cible) ? JSON.parse(readFileSync(cible, 'utf8')).source.empreinte : null;
  if (actuelle === empreinte) {
    console.log(`Contenu à jour (${ref}, empreinte ${empreinte}).`);
  } else {
    console.error(`Contenu périmé : le CV maître a changé sur ${ref}. Lance la synchronisation.`);
    process.exitCode = 1;
  }
} else {
  const json = (f) => JSON.parse(bruts[f]);
  const lettre = json('cv/lettre.json');
  const fichesEn = json('cv/fiches-projets.en.json');
  const fr = transformerLangue({ contenu: json('cv/contenu.json'), fiches: json('cv/fiches-projets.json'), alternance: lettre.alternance });
  const en = transformerLangue({ contenu: json('cv/contenu.en.json'), fiches: fichesEn, alternance: fichesEn.alternance });

  const ecarts = ecartsDeParite(fr, en);
  if (ecarts.length) {
    console.error('Français et anglais ne correspondent pas (ADR 0005) :\n- ' + ecarts.join('\n- '));
    process.exit(1);
  }

  const source = { depot: 'optimisation_cv', ref: dossier ? 'copie-de-travail' : ref, commit: dossier ? 'non-commite' : git('rev-parse', '--short', ref).trim(), empreinte };
  mkdirSync(dirname(cible), { recursive: true });
  writeFileSync(cible, JSON.stringify({ source, fr, en }, null, 2) + '\n');
  console.log(`contenu/cv.json écrit depuis ${ref} (${source.commit}), empreinte ${empreinte}.`);

  if (process.argv.includes('--pdf')) genererPdf();
}

// Les PDF se construisent avec le générateur et les données de la même
// référence, extraits dans un dossier temporaire.
function genererPdf() {
  const tmp = mkdtempSync(join(tmpdir(), 'cv-maitre-'));
  try {
    // Le générateur extrait s'exécute avec les droits de l'utilisateur : c'est
    // le code de la branche `dev` d'optimisation_cv, dépôt de Kevin.
    const archive = join(tmp, 'cv.tar');
    git('archive', '--output', archive, ref, 'cv');
    execFileSync('tar', ['-x', '-f', archive, '-C', tmp]);
    const sortie = join(racine, 'public', 'cv');
    mkdirSync(sortie, { recursive: true });
    for (const [contenu, nom] of [['contenu.json', 'CV_Ariel-Kevin_Sodjinou'], ['contenu.en.json', 'CV_Ariel-Kevin_Sodjinou_EN']]) {
      execFileSync('node', [join(tmp, 'cv', 'generer.mjs'), join(tmp, 'cv', contenu), nom, sortie], { stdio: 'inherit' });
      rmSync(join(sortie, `${nom}.html`), { force: true });
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
}
