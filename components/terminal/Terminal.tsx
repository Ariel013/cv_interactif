"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import type { ContenuLangue, Langue } from "@/lib/contenu";
import type { Textes } from "@/lib/textes";
import { sansBalisage } from "@/lib/texte";

// Le mode terminal (ADR 0004) : des commandes prédéfinies, calculées dans le
// navigateur depuis le même contenu que l'île. La saisie ne sert qu'à choisir
// une commande : elle n'est jamais interprétée comme du HTML ni évaluée.

type TextesTerminal = Textes["terminal"];
type Bloc = { id: number; commande: string | null; sortie: ReactNode };

// Chaque commande accepte sa forme française et anglaise.
const alias: Record<string, string> = {
  aide: "aide", help: "aide", "?": "aide",
  profil: "profil", profile: "profil", whoami: "profil", neofetch: "profil",
  projets: "projets", projects: "projets", ls: "projets",
  projet: "projet", project: "projet", cat: "projet",
  parcours: "parcours", experience: "parcours", experiences: "parcours",
  formation: "formation", formations: "formation", education: "formation",
  competences: "competences", "compétences": "competences", skills: "competences",
  contact: "contact",
  photo: "photo", image: "photo", picture: "photo", portrait: "photo",
  cv: "cv", pdf: "cv",
  ile: "ile", "île": "ile", island: "ile", jeu: "ile", game: "ile",
  effacer: "effacer", clear: "effacer", cls: "effacer",
  sudo: "sudo",
};

const nomsCommandes = (langue: Langue) =>
  langue === "fr"
    ? ["profil", "projets", "projet", "parcours", "formation", "competences", "contact", "photo", "cv", "ile", "effacer"]
    : ["profile", "projects", "project", "experience", "education", "skills", "contact", "photo", "cv", "island", "clear"];


export function Terminal({
  contenu: c,
  langue,
  textes: t,
  pdf,
}: {
  contenu: ContenuLangue;
  langue: Langue;
  textes: TextesTerminal;
  pdf: string;
}) {
  const [blocs, setBlocs] = useState<Bloc[]>([{ id: 0, commande: null, sortie: <p>{t.accueil}</p> }]);
  const [saisie, setSaisie] = useState("");
  const [historique, setHistorique] = useState<string[]>([]);
  const [rang, setRang] = useState<number | null>(null);
  const champ = useRef<HTMLInputElement>(null);
  const fin = useRef<HTMLDivElement>(null);
  const compteur = useRef(1);
  const noms = nomsCommandes(langue);

  useEffect(() => {
    fin.current?.scrollIntoView({ block: "end" });
  }, [blocs]);

  useEffect(() => {
    if (window.matchMedia("(pointer: fine)").matches) champ.current?.focus();
  }, []);

  function executer(brute: string) {
    const ligne = brute.trim().slice(0, 80);
    if (!ligne) return;
    const [mot, ...args] = ligne.toLowerCase().split(/\s+/);
    const cle = mot === "whoami" && args.includes("--photo") ? "photo" : alias[mot];
    setHistorique((h) => [...h.slice(-30), ligne]);
    setRang(null);
    if (cle === "effacer") {
      setBlocs([]);
      return;
    }
    const sortie = cle ? repondre(cle, args) : <p className="terminal-erreur">
        {t.inconnue} {mot}. {t.inconnueSuite}
      </p>;
    // On garde les 50 derniers échanges.
    setBlocs((b) => [...b.slice(-49), { id: compteur.current++, commande: ligne, sortie }]);
  }

  function repondre(cle: string, args: string[]): ReactNode {
    switch (cle) {
      case "aide":
        return (
          <>
            <p className="terminal-titre">{t.aide}</p>
            <dl className="terminal-aide">
              {(Object.keys(t.commandes) as (keyof TextesTerminal["commandes"])[]).map((k, i) => (
                <div key={k}>
                  <dt>{noms[i]}</dt>
                  <dd>{t.commandes[k]}</dd>
                </div>
              ))}
            </dl>
          </>
        );
      case "profil":
        return (
          <div className="terminal-profil">
            <p className="terminal-nom">{c.identite.nom}</p>
            <p className="terminal-accent">{c.identite.titre}</p>
            <p>{c.accroche}</p>
            <p className="terminal-alternance">
              {c.alternance.region} · {c.alternance.rythme} · {c.alternance.disponibilite}
            </p>
            <ul className="terminal-cles">
              <li><span>{t.cles.stack}</span> {c.identite.technos.join(" · ")}</li>
            </ul>
          </div>
        );
      case "projets":
        return (
          <ol className="terminal-liste">
            {c.projets.map((p, i) => (
              <li key={p.id}>
                <button type="button" className="terminal-lien" onClick={() => executer(`${noms[2]} ${i + 1}`)}>
                  <span className="terminal-numero">{String(i + 1).padStart(2, "0")}</span> {p.titre}
                </button>
                <span className="terminal-discret"> {p.periode}</span>
              </li>
            ))}
          </ol>
        );
      case "projet": {
        const n = Number(args[0]);
        const p = c.projets[n - 1];
        if (!p) return <p className="terminal-erreur">{t.projetInconnu}</p>;
        return (
          <div>
            <p className="terminal-nom">{p.titre}</p>
            <p className="terminal-discret">
              {p.cadre} · {p.periode}
            </p>
            <p className="terminal-accent">{p.ecran}</p>
            <p>{p.probleme}</p>
            <ul className="terminal-puces">
              {p.realisations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
            {p.resultat && <p className="terminal-resultat">→ {p.resultat}</p>}
            <p className="terminal-discret">[{p.stack.join(", ")}]</p>
            <p className="terminal-liens">
              {p.liens.demo && (
                <a href={p.liens.demo} target="_blank" rel="noopener noreferrer">
                  {t.cles.demo} ↗<span className="sr-only"> {t.nouvelOnglet}</span>
                </a>
              )}
              {p.liens.code && (
                <a href={p.liens.code} target="_blank" rel="noopener noreferrer">
                  {t.cles.code} ↗<span className="sr-only"> {t.nouvelOnglet}</span>
                </a>
              )}
            </p>
            {p.lenteur && <p className="terminal-discret">{p.lenteur}</p>}
          </div>
        );
      }
      case "parcours":
        return (
          <ul className="terminal-blocs">
            {c.parcours.map((e, i) => (
              <li key={i}>
                <p>
                  <span className="terminal-accent">{e.structure}</span> <span className="terminal-discret">{e.periode}</span>
                </p>
                <p>{e.poste}</p>
                <ul className="terminal-puces">
                  {e.points.map((p, j) => (
                    <li key={j}>
                      {sansBalisage(p.texte)}
                      {p.sous.length > 0 && (
                        <ul>
                          {p.sous.map((s, k) => (
                            <li key={k}>{sansBalisage(s)}</li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        );
      case "formation":
        return (
          <>
            <ul className="terminal-blocs">
              {c.formations.map((f, i) => (
                <li key={i}>
                  <span className="terminal-discret">{f.periode}</span> {sansBalisage(f.intitule)}
                </li>
              ))}
            </ul>
            <ul className="terminal-puces">
              {c.certifications.map((x, i) => (
                <li key={i}>{sansBalisage(x)}</li>
              ))}
            </ul>
            <p className="terminal-discret">{c.langues.join(" · ")}</p>
          </>
        );
      case "competences":
        return (
          <dl className="terminal-aide">
            {c.competences.map((k) => (
              <div key={k.famille}>
                <dt>{k.famille}</dt>
                <dd>{k.liste}</dd>
              </div>
            ))}
          </dl>
        );
      case "contact":
        return (
          <ul className="terminal-cles">
            <li><span>{t.cles.email}</span> <a href={`mailto:${c.identite.email}`}>{c.identite.email}</a></li>
            <li><span>{t.cles.tel}</span> <a href={`tel:${c.telephoneLien}`}>{c.identite.telephone}</a></li>
            <li><span>{t.cles.linkedin}</span> <a href={c.identite.liens.linkedin} target="_blank" rel="noopener noreferrer">{c.identite.liens.linkedin.replace(/^https:\/\/(www\.)?/, "")}<span className="sr-only"> {t.nouvelOnglet}</span></a></li>
            <li><span>{t.cles.github}</span> <a href={c.identite.liens.github} target="_blank" rel="noopener noreferrer">{c.identite.liens.github.replace(/^https:\/\//, "")}<span className="sr-only"> {t.nouvelOnglet}</span></a></li>
          </ul>
        );
      case "photo":
        return <Portrait textes={t} />;
      case "cv":
        return (
          <p>
            <a href={pdf} download className="terminal-bouton">
              {t.telecharger} ↓
            </a>
          </p>
        );
      case "ile":
        return (
          <p>
            <a href={`/${langue}`} className="terminal-bouton">
              {t.ouvrirIle} →
            </a>
          </p>
        );
      case "sudo":
        return <p className="terminal-accent">{t.sudo}</p>;
    }
    return null;
  }

  function soumettre(e: FormEvent) {
    e.preventDefault();
    executer(saisie);
    setSaisie("");
  }

  function surTouche(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp" && historique.length) {
      e.preventDefault();
      const r = rang === null ? historique.length - 1 : Math.max(0, rang - 1);
      setRang(r);
      setSaisie(historique[r]);
    } else if (e.key === "ArrowDown" && rang !== null) {
      e.preventDefault();
      const r = rang + 1;
      if (r >= historique.length) {
        setRang(null);
        setSaisie("");
      } else {
        setRang(r);
        setSaisie(historique[r]);
      }
    } else if (e.key === "Tab" && saisie) {
      // Complète seulement si la saisie est un début de commande : sinon Tab
      // garde son rôle et fait sortir du champ.
      const trouve = noms.find((n) => n.startsWith(saisie.toLowerCase()) && n !== saisie.toLowerCase().trim());
      if (trouve) {
        e.preventDefault();
        setSaisie(trouve + (trouve === noms[2] ? " " : ""));
      }
    }
  }

  return (
    <section
      className="terminal"
      aria-label={t.titre}
      onClick={() => {
        // Un clic dans la fenêtre rend la main au champ, sauf pendant une
        // sélection de texte (copier un e-mail).
        if (!window.getSelection()?.toString()) champ.current?.focus();
      }}
    >
      <div className="terminal-fenetre">
        <div className="terminal-barre" aria-hidden="true">
          <span />
          <span />
          <span />
          <p>ariel@cv: ~</p>
        </div>
        <div className="terminal-ecran" role="log" aria-live="polite">
          {blocs.map((b) => (
            <div key={b.id} className="terminal-bloc">
              {b.commande !== null && (
                <p className="terminal-ligne">
                  <span className="terminal-invite" aria-hidden="true">
                    ariel@cv:~$
                  </span>{" "}
                  {b.commande}
                </p>
              )}
              <div className="terminal-sortie">{b.sortie}</div>
            </div>
          ))}
          <div ref={fin} />
        </div>
        <form className="terminal-ligne terminal-saisie" onSubmit={soumettre}>
            <label htmlFor="commande" className="terminal-invite">
              ariel@cv:~$<span className="sr-only"> {t.invite}</span>
            </label>
            <input
              id="commande"
              ref={champ}
              value={saisie}
              onChange={(e) => setSaisie(e.target.value)}
              onKeyDown={surTouche}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              maxLength={80}
              enterKeyHint="send"
            />
            <button type="submit" className="terminal-envoyer" aria-label={t.envoyer} title={t.envoyer}>
              <span aria-hidden="true">↵</span>
            </button>
          </form>
      </div>
      <nav className="terminal-suggestions" aria-label={t.suggestions}>
        {noms.slice(0, -1).map((n) => (
          <button key={n} type="button" onClick={() => executer(n === noms[2] ? `${n} 1` : n)}>
            {n === noms[2] ? `${n} 1` : n}
          </button>
        ))}
      </nav>
    </section>
  );
}

// La commande « photo » : la vraie photo, dans un cercle, avec sa légende
// façon fichier ouvert. (Un portrait en ASCII a été essayé puis écarté :
// Kevin ne s'y reconnaissait pas.)
function Portrait({ textes: t }: { textes: TextesTerminal }) {
  return (
    <figure className="terminal-portrait">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/photo.jpg" alt={t.portrait} className="terminal-photo" width={176} height={176} />
      <figcaption className="terminal-discret">photo.jpg</figcaption>
    </figure>
  );
}
