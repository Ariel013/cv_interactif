# 0002 — Page 2D d'abord, une seule scène 3D chargée à la demande, avec repli

**Statut** : adopté

## Contexte

Kevin veut un CV qui capte l'attention, avec de la 3D, et choisit comme scène
le mur LED du Strongman (un écran par projet) : c'est sa preuve la plus forte,
un logiciel utilisé en direct le jour d'un championnat national.

Le lien part par e-mail et depuis des candidatures : il s'ouvre dans l'aperçu
d'un client mail, sur un ordinateur de bureau d'entreprise sans carte
graphique, ou sur un téléphone. Le recruteur donne environ 30 secondes.

## Décision

- La page est en HTML rendu côté serveur : nom, positionnement, preuves,
  parcours, contact, lisibles sans WebGL ni JavaScript.
- Une seule scène 3D (React Three Fiber), le mur LED, chargée **après** le
  contenu et seulement quand elle entre à l'écran.
- Repli statique (image du mur, mêmes projets en liste) quand : WebGL absent,
  `prefers-reduced-motion`, appareil modeste, ou échec de chargement.
- La 3D ne porte aucun contenu exclusif : chaque projet du mur existe aussi en
  texte.

## Pourquoi

- Une page tout en 3D fait payer son temps de chargement au recruteur qui a le
  moins de patience, et se lit mal dans un client mail ou un lecteur d'écran.
- Une seule scène qui raconte quelque chose de vrai marque plus qu'une 3D
  décorative partout.
- Options écartées : site entièrement 3D (lent, fragile, inaccessible) ; 2D
  sans 3D (renonce à l'effet voulu par Kevin).

## Conséquences

- Budget : la page sans la scène reste légère ; la scène a son propre budget
  de poids, mesuré avant chaque livraison.
- Chaque livraison se vérifie aussi WebGL coupé et en mouvement réduit.
- Ajouter une seconde scène 3D demande un nouvel ADR.
