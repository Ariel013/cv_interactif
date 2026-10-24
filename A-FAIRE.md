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
| Vercel | Hébergement | projet à créer |

## 3. Migrations à appliquer

Aucune : pas de base de données.

## 4. Décisions en attente

| Question | Qui tranche | Échéance | Impact si non tranché |
|---|---|---|---|
| Valider les trois mots et la direction de style proposés le 2026-10-25 | Kevin | avant `PRODUCT.md` | pas de brief, pas de code |
| Langue : français seul en V1, anglais ensuite (recommandé) | Kevin | avant le brief | périmètre du contenu |
| Le CV maître d'`optimisation_cv` dit-il bien que la FIBDA est une fédération ? Son journal notait « non fédérale » | Kevin, dans `optimisation_cv` | avant publication | fait contradictoire entre les deux sites |
| Archiver le dépôt GitHub `Curriculum` | Kevin | à la mise en ligne | deux CV web en ligne, dont un faux |

## 5. Ops et sauvegardes

- Rien à sauvegarder ici : le contenu vient du CV maître, le code vit sur
  GitHub.
