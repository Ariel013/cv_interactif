# 0001 — Le CV maître reste la seule source ; le site lit une copie publique contrôlée

**Statut** : adopté

## Contexte

Les faits du parcours de Kevin sont tenus dans `optimisation_cv/cv/contenu.json`,
corrigés et confirmés un à un (journal de ce projet). L'ancien CV web
(`Curriculum`) avait sa propre copie, recopiée à la main : elle avait dérivé
(localisation, téléphone, chiffres absents du CV maître, projets fictifs).

Contraintes : ce dépôt est public et déployé sur Vercel, qui ne voit pas le
dossier voisin `optimisation_cv` (dépôt privé). Le CV maître contient un
téléphone et un e-mail.

## Décision

- Un script de synchronisation lit le CV maître et écrit dans ce dépôt une
  copie publique (`contenu/cv.json`) : seulement les champs publiables, avec
  une empreinte du fichier source. Téléphone et e-mail en font partie : Kevin a
  choisi de les publier (2026-10-25).
- Il applique les seules transformations décidées ici : les points de
  l'expérience « Freelance » deviennent des projets réalisés (décision de Kevin,
  2026-10-25) ; la section « réserve » n'est jamais copiée.
- Les deux modes du site ne lisent que cette copie, validée par un schéma au build.
  Les textes d'interface (libellés, titres) vivent dans le code ; les faits,
  jamais.
- Un contrôle en local signale quand l'empreinte ne correspond plus au CV
  maître : la copie est périmée, il faut relancer la synchronisation.

## Pourquoi

- Une seule source de faits : c'est la règle d'`optimisation_cv`, et la cause
  exacte de l'échec de `Curriculum`.
- La copie commitée rend le build autonome sur Vercel, sans accès au dépôt
  privé ni secret supplémentaire.
- Options écartées : lire le dossier voisin au build (casse sur Vercel) ;
  sous-module git du dépôt privé (exposerait l'existence du dépôt et compliquerait
  le déploiement) ; recopier à la main (déjà échoué).

## Conséquences

- Corriger un fait = le corriger dans le CV maître, puis synchroniser. Jamais
  d'édition directe de la copie.
- Si le format du CV maître change, le schéma casse le build : c'est voulu.
- La version anglaise n'existe pas dans le CV maître. Elle se décidera à part
  (traduction tenue dans `optimisation_cv`, ou site en français seul).
