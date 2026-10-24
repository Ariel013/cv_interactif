# 0005 — Français et anglais au choix ; la traduction vit à côté du CV maître

**Statut** : adopté

## Contexte

Kevin veut que le visiteur choisisse entre français et anglais. Le CV maître
d'`optimisation_cv` n'existe qu'en français. Une traduction tenue dans ce dépôt
créerait une seconde source de faits, ce que l'ADR 0001 interdit.

## Décision

- La version anglaise est un fichier frère du CV maître, dans
  `optimisation_cv` (même structure, mêmes entrées, mêmes liens et dates).
  L'agent la rédige à partir du français ; Kevin la valide. Aucun fait n'y
  entre qui ne soit dans la version française.
- Le script de synchronisation copie les deux langues ; le build échoue si
  elles n'ont pas le même nombre d'entrées, les mêmes liens et les mêmes dates.
- Les textes d'interface (boutons, titres, commandes du terminal) sont traduits
  dans le code.
- Le visiteur choisit par un bouton FR / EN visible. À la première visite, la
  langue du navigateur décide (anglais par défaut hors francophonie).
  L'adresse fixe la langue (`?lang=en`) pour que Kevin envoie le bon lien ;
  elle prime sur le reste. Le choix se retient localement.
- Les commandes du terminal ont une forme française et une forme anglaise
  (`projets` et `projects`), acceptées dans les deux langues.

## Pourquoi

- Une seule source de faits par langue, au même endroit : la traduction se
  corrige en même temps que l'original.
- Le contrôle de parité attrape la traduction qui a pris du retard.
- Options écartées : traduction automatique au chargement (fautes, faits
  déformés) ; traduction dans ce dépôt (seconde source).

## Conséquences

- Toute modification du CV maître demande la mise à jour de la version
  anglaise avant synchronisation, sinon le build casse.
- Le PDF téléchargeable existe dans les deux langues ; l'anglais est à
  produire dans `optimisation_cv`.
