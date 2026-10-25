# 0006 — Le CV est une île à explorer, avec un terminal à côté

**Statut** : adopté (2026-10-25) — remplace 0002

## Contexte

Le lot 1 (page 2D, puis une ouverture « mur LED » en 3D) ne correspondait pas
à l'attente de Kevin : il veut une expérience interactive façon jeu, où l'on
découvre le CV au fur et à mesure, pas un document à lire, et dans l'univers
visuel de son portfolio (indigo et cyan, Inter), pas en orange.

## Décision

- Le mode principal est une île en 3D (React Three Fiber). Un personnage
  stylisé, aux couleurs du portfolio, s'y déplace au clic, au toucher ou au
  clavier. *(Sa tête était d'abord la photo de Kevin ; retirée à sa demande le
  2026-10-25. La photo reste dans la carte contact et dans la commande
  `photo` du terminal, qui l'affiche dans un cercle ; une version en art
  ASCII a été essayée puis écartée, Kevin ne s'y reconnaissait pas.)* S'approcher d'un lieu le découvre et ouvre une carte :
  projets au nord, parcours à l'est (jalons « formation » ou « expérience
  pro »), compétences à l'ouest, contact au sud. Un compteur suit la
  progression, gardée dans le navigateur du visiteur.
- Un écran titre précède le jeu ; « Aller à… », le PDF et le terminal restent
  accessibles à tout moment, pour le recruteur pressé.
- Le mode terminal (ADR 0004) est une page à côté, `/fr/terminal` et
  `/en/terminal`, reliée par la barre du haut.
- Plus de « version classique » sous l'île (décision de Kevin). Sans WebGL ou
  en mouvement réduit, une introduction la remplace : photo, nom, titre,
  accroche, modalités, contact, PDF, terminal.
- Univers visuel : celui du portfolio, identité qui prime sur les préférences
  typographiques générales.

## Pourquoi

- C'est la demande explicite de Kevin, et la seule des trois versions
  essayées qu'il a jugée dans la bonne direction.
- Le contenu reste entièrement accessible hors 3D : par le terminal, par le
  PDF, par l'introduction de secours, et dans l'île par « Aller à… ».

## Conséquences

- La page 2D du lot 1 et le mur LED disparaissent ; `docs/brief-v1.md` ne vaut
  plus que pour le contenu et les états.
- Le poids de la page (three.js) et la fluidité sur téléphone d'entrée de
  gamme sont à mesurer avant la mise en ligne.
- Un lieu ajouté au contenu (projet, expérience) apparaît sur l'île sans code
  à écrire : les lieux sont calculés depuis le contenu.
