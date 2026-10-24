# 0004 — Deux modes de lecture, page et terminal, sur le même contenu

**Statut** : adopté

## Contexte

Kevin envoie son lien à deux publics : des recruteurs RH ou généralistes, et
des équipes tech. Un terminal parle aux seconds et déroute les premiers. Le
chat IA envisagé (0003) est abandonné : il demandait une clé payante.

## Décision

- Deux modes, au choix du visiteur par un bouton visible, et fixables par
  l'adresse (`?mode=terminal`) pour que Kevin envoie le bon lien selon la
  candidature.
- Le mode **page** est le défaut : lecture en 30 secondes, scène 3D (0002).
- Le mode **terminal** : une invite qui accepte des commandes prédéfinies
  (aide, profil, projets, parcours, compétences, contact, cv) et des
  suggestions cliquables, pour qui ne veut pas taper. Les réponses sont
  calculées dans le navigateur depuis le même contenu, sans serveur ni modèle.
- Une commande inconnue répond par la liste des commandes, jamais par une
  erreur muette.

## Pourquoi

- Un seul lien ne sert pas bien deux publics ; deux sites ne tiennent pas une
  seule source.
- Des commandes prédéfinies sont gratuites, instantanées, et ne peuvent pas
  inventer un fait.
- Options écartées : chat IA (coût, abus, risque d'invention) ; modèle exécuté
  dans le navigateur (centaines de Mo à télécharger pour un recruteur) ;
  terminal seul (perd le public non tech).

## Conséquences

- Tout fait ajouté au contenu doit apparaître dans les deux modes ; un test le
  vérifie.
- Le mode terminal reste utilisable au clavier et au lecteur d'écran, et sur
  téléphone grâce aux suggestions.
- Le mode choisi par le visiteur se retient localement, l'adresse prime.
