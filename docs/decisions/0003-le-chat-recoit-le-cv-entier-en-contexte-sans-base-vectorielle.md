# 0003 — Le chat reçoit le CV entier en contexte, sans base vectorielle

**Statut** : abandonné le 2026-10-25, remplacé par 0004

> Kevin renonce au chat : il exige une clé d'API payante, un plafond et une
> surveillance pour un gain incertain. Le mode terminal (0004) donne
> l'interactivité sans modèle. Ce qui suit reste comme trace du choix étudié.

## Contexte

Le chat « Demande à mon CV » doit répondre aux questions d'un recruteur sur le
parcours de Kevin, sans jamais inventer. Le CV public tient en quelques milliers
de tokens. La page est publique : n'importe qui peut écrire n'importe quoi dans
le champ, y compris pour faire dépenser la clé ou détourner le modèle.

## Décision

- Une route serveur sur Vercel appelle le modèle. La clé ne quitte jamais le
  serveur.
- Le contexte envoyé est la copie publique du CV (ADR 0001) en entier, avec une
  consigne : répondre seulement à partir de ce texte, dire « ce n'est pas dans
  mon CV » sinon, refuser les autres sujets.
- Pas de base vectorielle ni de découpage : le CV entier tient dans le contexte.
- Garde-fous : longueur de question bornée, réponse bornée, limite de requêtes
  par visiteur, plafond de dépense côté fournisseur, aucune conversation
  stockée, désactivation par variable d'environnement.
- Modèle : un petit modèle rapide (Claude Haiku 5.5 si clé Anthropic).

## Pourquoi

- Un RAG avec index se justifie quand le corpus dépasse le contexte ; ici il
  ajouterait une base, un coût et des erreurs de récupération pour rien.
  Donner le texte entier réduit le risque d'invention.
- Le plafond côté fournisseur est la seule borne qui tient même si le code a
  un défaut.

## Conséquences

- Le chat ne sait que ce que dit le CV public : la qualité de ses réponses
  dépend du CV maître.
- Revue de sécurité obligatoire sur la route avant la mise en ligne
  (injection de consigne, abus de quota, fuite de clé).
- Si le corpus grossit (articles, études de cas longues), revoir cet ADR.
