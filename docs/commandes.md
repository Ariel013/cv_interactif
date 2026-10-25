# Commandes

| Commande | Effet |
|---|---|
| `pnpm dev` | Serveur de développement |
| `pnpm build` puis `pnpm start` | Construction et serveur de production en local |
| `pnpm synchroniser` | Réécrit `contenu/cv.json` depuis le CV maître (`optimisation_cv`, référence `dev`) |
| `pnpm synchroniser:pdf` | Idem, et régénère les PDF publics FR et EN dans `public/cv/`. Exécute le générateur d'`optimisation_cv` tel qu'il est sur `dev`, avec tes droits : ne le lancer que sur ce dépôt-là |
| `pnpm verifier-contenu` | Dit si `contenu/cv.json` est périmé par rapport au CV maître |
| `pnpm test` | Tests de la transformation et de la parité FR / EN |
| `pnpm typecheck`, `pnpm lint` | Vérifications statiques |

Variables facultatives : `CV_MAITRE_DEPOT` (chemin du dépôt source),
`CV_MAITRE_REF` (référence git lue, `dev` par défaut),
`NEXT_PUBLIC_SITE_URL` (adresse publique, sinon celle de Vercel).

## À ne jamais faire

- Modifier `contenu/cv.json` à la main : il est écrasé à la prochaine
  synchronisation, et un fait n'existe que dans le CV maître (ADR 0001).
- Lire les fichiers du CV maître dans la copie de travail d'`optimisation_cv` :
  une autre session y change de branche ; le script lit l'historique git.
