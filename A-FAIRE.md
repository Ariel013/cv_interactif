# À faire — hors code

> Ce qui doit être fait **hors code** : comptes, secrets, décisions. Quand une
> tâche de code fait apparaître une action externe, elle est ajoutée ici **dans
> la même tâche**, avec la date. On ne laisse aucun prérequis implicite.

Dernière mise à jour : 2026-10-25.

---

## 1. Variables d'environnement / secrets

| Variable | Où l'obtenir | Statut |
|---|---|---|
| Clé d'API du modèle du chat | Console du fournisseur choisi (ADR 0003) | requise — fournisseur à choisir |

- ⚠️ Ne jamais committer le fichier d'environnement. La clé vit dans les
  variables d'environnement Vercel, jamais côté navigateur.

## 2. Comptes / services externes

| Service | Usage | Statut |
|---|---|---|
| GitHub `Ariel013/cv-interactif` (public) | Dépôt | à créer — sur confirmation de Kevin |
| Vercel | Hébergement + route du chat | projet à créer |
| Fournisseur du modèle | Chat « Demande à mon CV » | plafond mensuel à fixer côté console |

## 3. Migrations à appliquer

Aucune : pas de base de données.

## 4. Décisions en attente

| Question | Qui tranche | Échéance | Impact si non tranché |
|---|---|---|---|
| Trois mots de personnalité, site qui inspire, anti-références, charte | Kevin | avant `PRODUCT.md` | pas de brief, pas de code |
| Fournisseur du chat (clé Anthropic ou OpenAI) et plafond mensuel | Kevin | avant le chat | chat non livrable |
| Le CV maître d'`optimisation_cv` dit-il bien que la FIBDA est une fédération ? Son journal notait « non fédérale » | Kevin, dans `optimisation_cv` | avant publication | fait contradictoire entre les deux sites |
| Archiver le dépôt GitHub `Curriculum` | Kevin | à la mise en ligne | deux CV web en ligne, dont un faux |

## 5. Ops et sauvegardes

- Rien à sauvegarder ici : le contenu vient du CV maître, le code vit sur
  GitHub.
