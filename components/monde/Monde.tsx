"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { nomAffiche, type ContenuLangue, type Langue } from "@/lib/contenu";
import type { Textes } from "@/lib/textes";
import { construireZones, type Zone } from "./zones";
import { sansBalisage } from "@/lib/texte";
import { ErreurScene } from "./ErreurScene";
import type { Commandes, Manette } from "./SceneMonde";
import { Joystick } from "./Joystick";

// Le CV : une île à explorer (ADR 0006). Le personnage découvre les lieux en
// s'en approchant ; chaque découverte ouvre une carte. Sans WebGL, en
// mouvement réduit ou si la scène échoue, l'introduction de secours la
// remplace.

const SceneMonde = dynamic(() => import("./SceneMonde"), { ssr: false });

type TextesMonde = Textes["monde"];

const CLE_STOCKAGE = "cv-decouverts";

function peutAfficher3D() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const nav = navigator as Navigator & { connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return false;
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

function lireDecouverts(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(CLE_STOCKAGE) ?? "[]"));
  } catch {
    return new Set();
  }
}

export function Monde({
  contenu,
  langue,
  textes,
  pdf,
  photo,
  secours,
}: {
  contenu: ContenuLangue;
  langue: Langue;
  textes: TextesMonde;
  pdf: string;
  photo: ReactNode;
  secours: ReactNode;
}) {
  const zones = useMemo(() => construireZones(contenu), [contenu]);
  const [mode, setMode] = useState<"attente" | "3d" | "fixe">("attente");
  const [prete, setPrete] = useState(false);
  const [decouverts, setDecouverts] = useState<Set<string>>(new Set());
  const [proche, setProche] = useState<string | null>(null);
  const [ferme, setFerme] = useState<string | null>(null);
  const [aBouge, setABouge] = useState(false);
  const [demarre, setDemarre] = useState(false);
  const [commandes, setCommandes] = useState<Commandes>({ allerA: null });
  const [choix, setChoix] = useState("");
  const choixRef = useRef<HTMLSelectElement>(null);
  const ileRef = useRef<HTMLElement>(null);
  const manette = useRef<Manette>({ x: 0, z: 0 });
  const aDecouvrir = zones.filter((z) => z.type !== "depart");
  const nbDecouverts = aDecouvrir.filter((z) => decouverts.has(z.id)).length;
  const zone = zones.find((z) => z.id === proche && z.id !== ferme) ?? null;

  useEffect(() => {
    // Détection et lecture locale possibles seulement dans le navigateur.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(peutAfficher3D() ? "3d" : "fixe");
    setDecouverts(lireDecouverts());
  }, []);

  useEffect(() => {
    if (!zone) return;
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFerme(zone.id);
    };
    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  }, [zone]);

  const marquerPrete = useCallback(() => setPrete(true), []);

  function surProche(id: string | null) {
    setProche(id);
    setFerme(null);
    if (!id) return;
    setDecouverts((avant) => {
      if (avant.has(id)) return avant;
      const apres = new Set(avant).add(id);
      try {
        localStorage.setItem(CLE_STOCKAGE, JSON.stringify([...apres]));
      } catch {}
      return apres;
    });
  }

  function allerA(id: string) {
    const z = zones.find((x) => x.id === id);
    if (z) setCommandes({ allerA: { x: z.x, z: z.z, jeton: Date.now() } });
  }

  if (mode === "fixe") return <>{secours}</>;

  const quartiers = { projets: textes.quartiers.projets, parcours: textes.quartiers.parcours, competences: textes.quartiers.competences, contact: textes.quartiers.contact };

  return (
    <section ref={ileRef} tabIndex={-1} className="monde" data-prete={prete || undefined} aria-label={textes.titreIle}>
      <h1 className="sr-only">
        {nomAffiche}, {contenu.identite.titre}
      </h1>

      {mode === "3d" && (
        <div className="monde-scene">
          <ErreurScene surErreur={() => setMode("fixe")}>
          <SceneMonde
            zones={zones}
            decouverts={decouverts}
            titres={{ nom: contenu.identite.nom, titre: contenu.identite.titre, quartiers, natures: textes.natures }}
            commandes={commandes}
            manette={manette}
            surProche={surProche}
            surDeplacement={() => setABouge(true)}
            surPret={marquerPrete}
            surPerte={() => setMode("fixe")}
            demarre={demarre}
          />
          </ErreurScene>
        </div>
      )}

      {!demarre && (
        <div className="titre-jeu">
          <p className="titre-jeu-nom">
            {contenu.identite.nom.split(" ").slice(0, -1).join(" ")} <span>{contenu.identite.nom.split(" ").at(-1)}</span>
          </p>
          <p className="titre-jeu-titre">{contenu.identite.titre}</p>
          <Modalites contenu={contenu} />
          <p className="titre-jeu-texte">{textes.accroche}</p>
          <div className="titre-jeu-actions">
            <button type="button" className="hud-bouton hud-bouton-plein titre-jeu-jouer" onClick={() => {
                setDemarre(true);
                // Le focus va à l'île (pas au menu « Aller à… ») : les flèches
                // doivent déplacer le personnage, pas changer d'option.
                requestAnimationFrame(() => ileRef.current?.focus());
              }}
              autoFocus
            >
              {nbDecouverts > 0 ? textes.reprendre : textes.jouer} <span aria-hidden="true">▶</span>
            </button>
            <a href={pdf} className="hud-bouton" download>
              {textes.pdf}
            </a>
            <a href={`/${langue}/terminal`} className="hud-bouton">
              {textes.terminal}
            </a>
          </div>
          <p className="titre-jeu-note">{textes.duree}</p>
        </div>
      )}

      {/* Tableau de bord : progression et raccourcis. */}
      {demarre && (
      <div className="hud hud-haut">
        <div className="hud-progression" role="status">
          <span className="hud-etiquette">{textes.decouvertes}</span>
          <span className="hud-compte">
            {nbDecouverts}
            <span> / {aDecouvrir.length}</span>
          </span>
          <span className="hud-barre" aria-hidden="true">
            <span style={{ width: `${(nbDecouverts / aDecouvrir.length) * 100}%` }} />
          </span>
        </div>
        <div className="hud-raccourcis">
          <form
            className="hud-aller"
            onSubmit={(e) => {
              e.preventDefault();
              if (choix) allerA(choix);
            }}
          >
            <label htmlFor="aller-a" className="sr-only">
              {textes.allerA}
            </label>
            <select id="aller-a" ref={choixRef} value={choix} onChange={(e) => setChoix(e.target.value)}>
              <option value="">{textes.allerA}</option>
              {aDecouvrir.map((z) => (
                <option key={z.id} value={z.id}>
                  {nomLieu(z, contenu, textes)}
                </option>
              ))}
            </select>
            <button type="submit" className="hud-bouton" disabled={!choix}>
              {textes.yAller}
            </button>
          </form>
          <a href={`/${langue}/terminal`} className="hud-bouton">
            {textes.terminal}
          </a>
          <a href={pdf} className="hud-bouton hud-bouton-plein" download>
            {textes.pdf}
          </a>
        </div>
      </div>
      )}

      {demarre && mode === "3d" && <Joystick manette={manette} libelle={textes.joystick} />}

      {demarre && !aBouge && !zone && (
        <p className="hud hud-consigne">
          <span>{textes.consigne}</span>
          <kbd>↑</kbd>
          <kbd>←</kbd>
          <kbd>↓</kbd>
          <kbd>→</kbd>
        </p>
      )}

      <p className="sr-only" role="status">
        {zone ? nomLieu(zone, contenu, textes) || textes.bienvenue : ""}
      </p>

      {demarre && zone && (
        <aside className="carte" aria-label={nomLieu(zone, contenu, textes) || textes.bienvenue} key={zone.id} style={{ ["--couleur" as string]: zone.couleur }}>
          <button type="button" className="carte-fermer" onClick={() => setFerme(zone.id)} aria-label={textes.fermer}>
            ×
          </button>
          <Carte zone={zone} contenu={contenu} textes={textes} photo={photo} pdf={pdf} />
        </aside>
      )}

      {demarre && nbDecouverts === aDecouvrir.length && !zone && (
        <aside className="carte carte-fin" role="status">
          <p className="carte-type">{textes.bravo}</p>
          <h2 className="carte-titre">{textes.toutVu}</h2>
          <a href={`mailto:${contenu.identite.email}`} className="hud-bouton hud-bouton-plein">
            {textes.ecrire}
          </a>
        </aside>
      )}
    </section>
  );
}

function nomLieu(z: Zone, c: ContenuLangue, t: TextesMonde) {
  if (z.type === "projet") return `${t.quartiers.projets} · ${c.projets[z.index].titre}`;
  if (z.type === "competence") return `${t.quartiers.competences} · ${c.competences[z.index].famille}`;
  if (z.type === "parcours") {
    const e = z.index >= 0 ? c.parcours[z.index].structure : sansBalisage(c.formations[-1 - z.index].intitule).split(",")[0];
    const nature = z.nature === "formation" ? t.natures.formation : t.natures.experience;
    return `${t.quartiers.parcours} · ${z.etiquette} · ${nature} · ${e}`;
  }
  if (z.type === "contact") return t.quartiers.contact;
  return "";
}


function Carte({
  zone,
  contenu: c,
  textes: t,
  photo,
  pdf,
}: {
  zone: Zone;
  contenu: ContenuLangue;
  textes: TextesMonde;
  photo: ReactNode;
  pdf: string;
}) {
  if (zone.type === "depart") {
    return (
      <>
        <p className="carte-type">{t.bienvenue}</p>
        <h2 className="carte-titre">{c.identite.nom}</h2>
        <p className="carte-sous-titre">{c.identite.titre}</p>
        <Modalites contenu={c} />
        <p>{c.accroche}</p>
        <ul className="carte-pastilles" aria-label={t.stack}>
          {c.identite.technos.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
        <h3 className="carte-rubrique">{t.certifications}</h3>
        <ul className="carte-liste">
          {c.certifications.map((x, i) => (
            <li key={i}>{sansBalisage(x)}</li>
          ))}
        </ul>
        <p className="carte-note">{c.langues.join(" · ")}</p>
        <p className="carte-note">{t.regle}</p>
      </>
    );
  }
  if (zone.type === "projet") {
    const p = c.projets[zone.index];
    return (
      <>
        <p className="carte-type">
          {t.quartiers.projets} · {p.periode}
        </p>
        <h2 className="carte-titre">{p.titre}</h2>
        <p className="carte-note">{p.cadre}</p>
        <p className="carte-sous-titre">{p.ecran}</p>
        <h3 className="carte-rubrique">{t.probleme}</h3>
        <p>{p.probleme}</p>
        <h3 className="carte-rubrique">{t.realise}</h3>
        <ul className="carte-liste">
          {p.realisations.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
        {p.resultat && (
          <>
            <h3 className="carte-rubrique">{t.resultat}</h3>
            <p className="carte-resultat">{p.resultat}</p>
          </>
        )}
        <ul className="carte-pastilles" aria-label={t.stack}>
          {p.stack.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
        <div className="carte-liens">
          {p.liens.demo && (
            <a href={p.liens.demo} target="_blank" rel="noopener noreferrer" className="hud-bouton hud-bouton-plein">
              {t.demo} ↗<span className="sr-only"> {t.nouvelOnglet}</span>
            </a>
          )}
          {p.liens.code && (
            <a href={p.liens.code} target="_blank" rel="noopener noreferrer" className="hud-bouton">
              {t.code} ↗<span className="sr-only"> {t.nouvelOnglet}</span>
            </a>
          )}
        </div>
        {p.lenteur && <p className="carte-note">{p.lenteur}</p>}
      </>
    );
  }
  if (zone.type === "parcours") {
    if (zone.index < 0) {
      const f = c.formations[-1 - zone.index];
      return (
        <>
          <p className="carte-type">
            {t.natures.formation} · {f.periode}
          </p>
          <h2 className="carte-titre">{sansBalisage(f.intitule)}</h2>
        </>
      );
    }
    const e = c.parcours[zone.index];
    return (
      <>
        <p className="carte-type">
          {t.natures.experience} · {e.periode}
        </p>
        <h2 className="carte-titre">{e.structure}</h2>
        <p className="carte-sous-titre">{e.poste}</p>
        <ul className="carte-liste">
          {e.points.map((p, i) => (
            <li key={i}>
              {sansBalisage(p.texte)}
              {p.sous.length > 0 && (
                <ul>
                  {p.sous.map((s, j) => (
                    <li key={j}>{sansBalisage(s)}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </>
    );
  }
  if (zone.type === "competence") {
    const k = c.competences[zone.index];
    return (
      <>
        <p className="carte-type">{t.quartiers.competences}</p>
        <h2 className="carte-titre">{k.famille}</h2>
        <ul className="carte-pastilles">
          {k.liste.split(/,\s*|\s·\s/).map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </>
    );
  }
  return (
    <>
      <div className="carte-contact">
        {photo}
        <div>
          <p className="carte-type">{t.quartiers.contact}</p>
          <h2 className="carte-titre">{t.ecrire}</h2>
        </div>
      </div>
      <a href={`mailto:${c.identite.email}`} className="carte-email">
        {c.identite.email}
      </a>
      <div className="carte-liens">
        <a href={`tel:${c.telephoneLien}`} className="hud-bouton">
          {c.identite.telephone}
        </a>
        <a href={c.identite.liens.linkedin} target="_blank" rel="noopener noreferrer" className="hud-bouton">
          LinkedIn ↗<span className="sr-only"> {t.nouvelOnglet}</span>
        </a>
        <a href={c.identite.liens.github} target="_blank" rel="noopener noreferrer" className="hud-bouton">
          GitHub ↗<span className="sr-only"> {t.nouvelOnglet}</span>
        </a>
        <a href={pdf} className="hud-bouton hud-bouton-plein" download>
          {t.pdf}
        </a>
      </div>
    </>
  );
}

// Les modalités d'alternance, mises en avant : c'est ce qu'un recruteur doit
// voir tout de suite.
export function Modalites({ contenu: c }: { contenu: ContenuLangue }) {
  return (
    <p className="modalites-fortes">
      <span>{c.alternance.region}</span>
      <span>{c.alternance.rythme}</span>
      <span>{c.alternance.disponibilite}</span>
    </p>
  );
}
