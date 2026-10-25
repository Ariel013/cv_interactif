import type { Langue } from "@/lib/contenu";
import { initiales, nomAffiche } from "@/lib/contenu";
import type { Textes } from "@/lib/textes";
import { ChoixLangue } from "./ChoixLangue";

// Barre du haut, commune aux deux modes : l'île et le terminal (ADR 0004).
export function Barre({ langue, mode, textes }: { langue: Langue; mode: "ile" | "terminal"; textes: Textes }) {
  const chemin = mode === "terminal" ? "/terminal" : "";
  return (
    <header className="barre">
      <a href="#contenu" className="evitement">
        {textes.allerAuContenu}
      </a>
      <a href={`/${langue}`} className="barre-monogramme" aria-label={nomAffiche}>
        {initiales}
      </a>
      <nav className="barre-modes" aria-label={textes.modes.titre}>
        <a href={`/${langue}`} aria-current={mode === "ile" ? "page" : undefined}>
          {textes.modes.ile}
        </a>
        <a href={`/${langue}/terminal`} aria-current={mode === "terminal" ? "page" : undefined}>
          {textes.modes.terminal}
        </a>
      </nav>
      <ChoixLangue
        vers={textes.autreLangue.code as Langue}
        chemin={chemin}
        libelle={textes.autreLangue.libelle}
        nom={textes.autreLangue.nom}
      />
    </header>
  );
}
