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
- **Prochaine action** : faire valider le brief V1 par Kevin, puis lot 1
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

## 🎓 Leçons apprises

*(Aucune pour l'instant.)*
