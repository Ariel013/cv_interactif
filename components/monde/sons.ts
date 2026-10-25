// Effets sonores de l'île, synthétisés avec Web Audio : aucun fichier à
// télécharger. Le contexte audio ne démarre qu'après un geste du visiteur
// (« Commencer »), comme l'exigent les navigateurs. Coupables à tout moment ;
// le choix se retient dans le navigateur.

const CLE = "cv-son";
let contexte: AudioContext | null = null;
let maitre: GainNode | null = null;
let coupe = false;

try {
  coupe = typeof localStorage !== "undefined" && localStorage.getItem(CLE) === "coupe";
} catch {}

export const sonCoupe = () => coupe;

export function couperSon(valeur: boolean) {
  coupe = valeur;
  try {
    localStorage.setItem(CLE, valeur ? "coupe" : "actif");
  } catch {}
  if (maitre) maitre.gain.value = valeur ? 0 : 0.22;
}

// À appeler dans un geste du visiteur (clic, toucher).
export function activerSon() {
  if (contexte || typeof window === "undefined") return;
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;
  contexte = new Ctx();
  maitre = contexte.createGain();
  maitre.gain.value = coupe ? 0 : 0.22;
  maitre.connect(contexte.destination);
}

// Une note : oscillateur + enveloppe courte.
function note(frequence: number, debut: number, duree: number, forme: OscillatorType, volume = 1, glisse?: number) {
  if (!contexte || !maitre || coupe) return;
  const t = contexte.currentTime + debut;
  const osc = contexte.createOscillator();
  const gain = contexte.createGain();
  osc.type = forme;
  osc.frequency.setValueAtTime(frequence, t);
  if (glisse) osc.frequency.exponentialRampToValueAtTime(glisse, t + duree);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duree);
  osc.connect(gain).connect(maitre);
  osc.start(t);
  osc.stop(t + duree + 0.02);
}

// Pas : un petit bruit sourd, légèrement varié.
export function sonPas() {
  const base = 110 + Math.random() * 30;
  note(base, 0, 0.07, "triangle", 0.25, base * 0.6);
}

// Découverte d'un lieu : une sonorité par quartier, pour qu'on entende où
// l'on est.
// - projets : arpège montant, lumineux (sinus) ;
// - parcours : marimba, notes boisées et courtes (triangle) ;
// - compétences : cloche de cristal, aiguë avec un léger scintillement ;
// - contact : accord chaleureux qui s'ouvre (dents de scie adoucies) ;
// - départ : deux notes d'accueil.
export function sonDecouverte(type: string) {
  switch (type) {
    case "projet":
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => note(f, i * 0.07, 0.35, "sine", 0.5));
      break;
    case "parcours":
      [392, 493.88, 587.33].forEach((f, i) => {
        note(f, i * 0.09, 0.18, "triangle", 0.55);
        note(f * 4, i * 0.09, 0.05, "sine", 0.12);
      });
      break;
    case "competence":
      [1318.5, 1567.98, 2093].forEach((f, i) => {
        note(f, i * 0.06, 0.6, "sine", 0.32);
        note(f * 1.005, i * 0.06 + 0.01, 0.6, "sine", 0.18);
      });
      break;
    case "contact":
      [261.63, 329.63, 392, 523.25].forEach((f, i) => note(f, i * 0.03, 0.9, "sawtooth", 0.09));
      note(1046.5, 0.15, 0.5, "sine", 0.25);
      break;
    default:
      note(587.33, 0, 0.18, "sine", 0.4);
      note(880, 0.12, 0.3, "sine", 0.4);
  }
}

// Retour sur un lieu déjà vu : une seule note douce.
export function sonOuverture() {
  note(659.25, 0, 0.22, "sine", 0.3);
}

// Bouton : clic court.
export function sonClic() {
  note(880, 0, 0.06, "square", 0.12);
}

// Île entièrement explorée : petite fanfare.
export function sonFin() {
  const melodie: [number, number][] = [
    [523.25, 0],
    [659.25, 0.12],
    [783.99, 0.24],
    [1046.5, 0.36],
    [783.99, 0.52],
    [1046.5, 0.64],
  ];
  melodie.forEach(([f, d]) => note(f, d, 0.4, "triangle", 0.45));
}
