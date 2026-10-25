# 🧭 Journal de bord — CV interactif

> **Nouvelle session : LIS CE FICHIER EN PREMIER**, puis `CLAUDE.md`. Tu sauras
> où on en est, quoi faire ensuite et quoi éviter — sans relire tout le code.
>
> **Discipline** :
> 1. Au **démarrage** : lire les trois sections ci-dessous, puis agir / proposer.
> 2. En **fin de session** : mettre à jour « État & prochaine action », ajouter
>    une entrée au journal des sessions, consigner toute erreur en « Leçons ».
> 3. Convertir les dates relatives en absolues. Rester concis.

Carte des documents : `CLAUDE.md` (règles), `A-FAIRE.md` (actions hors code),
`docs/decisions/` (pourquoi les choix), `docs/workflow-git.md` (branches).

---

## 📍 État actuel & prochaine action

*(Mis à jour le 2026-10-25.)*

- **Version en prod** : aucune.
- **État des branches** : `main` = `staging` (amorce) ; `dev` = amorce +
  ADR 0004 ; local seul, pas de dépôt distant. Branche `docs/produit-et-langues`
  en cours.
- **Prochaine action** : après fusion des deux branches d'`optimisation_cv`
  (correction du CV maître, fiches projets), rédiger la version anglaise du
  CV maître et des fiches (ADR 0005), puis lot 1
  (synchronisation FR + EN, page 2D, bascules). Fin du lot 1 : page servie en
  local, regardée à 375, 768 et 1440 px.

## 📓 Journal des sessions

### 2026-10-25 — Amorce du projet

- Critique du dépôt `Curriculum` (impeccable : revue de design + détection
  automatique). Constat : 25/40 aux heuristiques, modèle reconnaissable,
  contenu de démonstration encore en ligne (projets de Jane Doe, PDF factice
  de 590 octets), infos périmées (Abidjan, téléphone +229, titre sans « IA »),
  21 contrastes insuffisants sur les badges.
- Décisions de Kevin : refonte complète sur un dépôt neuf et public,
  `cv-interactif` ; scène 3D « mur LED du Strongman » ; chat intégré ; pas de
  téléphone ; projets freelance en projets réalisés ; Master = M1 ; la FIBDA
  est une fédération ; le lien sera aussi envoyé par e-mail.
- Décisions techniques : ADR 0001 à 0003. Commit d'amorce validé par Kevin ;
  branches `staging` et `dev` créées.
- Puis Kevin revient sur trois points : téléphone publié ; chat IA abandonné
  (clé payante, ADR 0003 abandonné) ; deux modes au choix, page et terminal
  (ADR 0004). Direction de style « Jour de compétition » validée, sans les
  trois mots de personnalité (retirés à sa demande). Français et anglais au
  choix du visiteur (ADR 0005). `PRODUCT.md` écrit, brief V1 proposé.

### 2026-10-25 (suite) — Fiches projets et correction du CV maître

- Premier jet des fiches vérifié dans les dépôts de chaque projet. Deux
  erreurs trouvées dans le CV maître, donc dans le PDF envoyé : RAG-RH
  annonçait ChromaDB et OpenAI (remplacés), NearYou une revendication par OTP
  SMS (c'est WhatsApp, en pause). Corrigées dans `optimisation_cv`, PDF
  régénéré sur une page, texte vérifié par extraction.
- Kevin confirme : mur LED utilisé le 19 septembre, projets faits seul, RAG-RH
  projet personnel pensé pour AEIG, API de streaming en mai 2024, dashboard en
  janvier 2024. Pas de chiffres de vente. BlueLock retiré du mur (lien mort).
- Fiches versées à côté du CV maître (`cv/fiches-projets.json`, ADR 0017 de
  `optimisation_cv`), zone « Île-de-France » dans `cv/lettre.json`. Faites
  dans des worktrees : la copie principale d'`optimisation_cv` porte un
  travail en cours d'une autre session.

## 🎓 Leçons apprises

*(Aucune pour l'instant.)*
