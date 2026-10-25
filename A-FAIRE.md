# À faire — hors code

> Ce qui doit être fait **hors code** : comptes, secrets, décisions. Quand une
> tâche de code fait apparaître une action externe, elle est ajoutée ici **dans
> la même tâche**, avec la date. On ne laisse aucun prérequis implicite.

Dernière mise à jour : 2026-10-25.

---

## 1. Variables d'environnement / secrets

Aucune : pas de chat IA (ADR 0003 abandonné), pas de service à clé.

- ⚠️ Ne jamais committer de fichier d'environnement si un jour il en faut un.

## 2. Comptes / services externes

| Service | Usage | Statut |
|---|---|---|
| GitHub `Ariel013/cv-interactif` (public) | Dépôt | à créer — sur confirmation de Kevin |
| Vercel | Hébergement, sous-domaine `*.vercel.app` (décidé le 2026-10-25) | projet à créer, relié au dépôt GitHub ; aucune variable requise |

## 3. Migrations à appliquer

Aucune : pas de base de données.

## 4. Décisions en attente

| Question | Qui tranche | Échéance | Impact si non tranché |
|---|---|---|---|
| Archiver le dépôt GitHub `Curriculum` | Kevin | à la mise en ligne | deux CV web en ligne, dont un faux |
| Mesurer le chargement de l'île sur un vrai téléphone moyen | Kevin + agent | avant d'envoyer le lien | recruteurs mobiles qui attendent |

## 5. Ops et sauvegardes

- Rien à sauvegarder ici : le contenu vient du CV maître, le code vit sur
  GitHub.
