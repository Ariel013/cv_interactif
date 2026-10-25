"use client";

import { useRef, useState, type PointerEvent } from "react";
import type { Manette } from "./SceneMonde";

// Joystick tactile, affiché seulement sur écran tactile (CSS) : on pousse le
// bouton dans une direction, le personnage y marche. Remplace le toucher du
// sol, qui faisait défiler la page sur téléphone.

const RAYON = 44;

export function Joystick({ manette, libelle }: { manette: React.RefObject<Manette>; libelle: string }) {
  const base = useRef<HTMLDivElement>(null);
  const [bouton, setBouton] = useState({ x: 0, y: 0 });
  const actif = useRef(false);

  function suivre(e: PointerEvent<HTMLDivElement>) {
    const zone = base.current?.getBoundingClientRect();
    if (!zone) return;
    let dx = e.clientX - (zone.left + zone.width / 2);
    let dy = e.clientY - (zone.top + zone.height / 2);
    const d = Math.hypot(dx, dy);
    if (d > RAYON) {
      dx = (dx / d) * RAYON;
      dy = (dy / d) * RAYON;
    }
    setBouton({ x: dx, y: dy });
    manette.current = { x: dx / RAYON, z: dy / RAYON };
  }

  function relacher() {
    actif.current = false;
    setBouton({ x: 0, y: 0 });
    manette.current = { x: 0, z: 0 };
  }

  return (
    <div
      ref={base}
      className="joystick"
      role="application"
      aria-label={libelle}
      onPointerDown={(e) => {
        actif.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        suivre(e);
      }}
      onPointerMove={(e) => actif.current && suivre(e)}
      onPointerUp={relacher}
      onPointerCancel={relacher}
      onLostPointerCapture={relacher}
    >
      <span className="joystick-bouton" style={{ transform: `translate(${bouton.x}px, ${bouton.y}px)` }} />
    </div>
  );
}
