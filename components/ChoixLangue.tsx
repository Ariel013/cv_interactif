"use client";

import type { Langue } from "@/lib/contenu";

// Lien vers l'autre langue, sur la même page (île ou terminal). Le choix se
// retient dans un cookie que le proxy lit sur « / » (ADR 0005) ; l'adresse,
// elle, fixe toujours la langue.

export function ChoixLangue({ vers, chemin, libelle, nom }: { vers: Langue; chemin: string; libelle: string; nom: string }) {
  return (
    <a
      href={`/${vers}${chemin}`}
      hrefLang={vers}
      lang={vers}
      className="choix-langue"
      aria-label={nom}
      onClick={() => {
        document.cookie = `langue=${vers}; path=/; max-age=31536000; samesite=lax${location.protocol === "https:" ? "; secure" : ""}`;
      }}
    >
      {libelle}
    </a>
  );
}
