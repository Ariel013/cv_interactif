# Brief de design — V1 (page + terminal)

**Statut** : validé par Kevin le 2026-10-25.
Issu d'`impeccable shape`. Sondes visuelles non générées : l'environnement n'a
pas de génération d'image native.

## 1. Résumé

Le CV web de Kevin en deux modes au choix, page et terminal, en français et en
anglais. La page se lit en 30 secondes, puis offre un moment fort : le mur LED
du Strongman, un écran par projet. Le terminal donne la même chose à taper,
pour un public tech.

## 2. Action principale

Comprendre en un coup d'œil « développeur fullstack & IA, en M1, cherche une
alternance en Île-de-France, a livré des logiciels utilisés en vrai », puis le
contacter.

## 3. Direction

- **Stratégie de couleur** : *Committed*. Un orange signal (dossard, panneau de
  compétition) porte le nom, les liens, les accents et les LED ; neutres
  légèrement teintés vers lui. Pas de beige, pas de bleu SaaS, pas de violet.
- **Scène** : une chargée de recrutement ouvre le lien depuis Outlook, au
  bureau, en plein jour, sur un écran de portable, entre deux candidatures.
  → **Page claire.** Le mur LED est la seule zone sombre : en défilant, on
  entre dans la salle de compétition. Le terminal est sombre (on regarde des
  LED), orange sur presque-noir, jamais vert.
- **Références** : un programme officiel d'épreuve sportive imprimé (hiérarchie,
  numéros, ordre de passage) ; un tableau d'affichage de stade à LED
  (matrice de points, chiffres) ; les panneaux de signalisation d'un aéroport
  (lisibilité à distance, typographie condensée).
- **Typographie** (provisoire, fixée au premier écran) : titres en grotesque
  condensée d'affichage ; texte en sans-serif très lisible ; dates, chiffres et
  terminal en monospace.

## 4. Périmètre

Qualité production, site entier (page, mur LED, terminal, FR/EN, PDF),
interactif, livré en ligne. Livraison en trois lots, chacun montrable :

1. **Lot 1** — contenu synchronisé (FR + EN), page complète en 2D, bascules
   langue et mode, aperçu de partage pour e-mail et LinkedIn.
2. **Lot 2** — le mur LED en 3D avec son repli.
3. **Lot 3** — le mode terminal.

## 5. Mise en page

**Page, desktop (1440 px)** — fini la carte A4, la page occupe l'écran :

1. **Ouverture** (plein écran) : nom en très grand ; titre « Développeur
   Fullstack & IA » ; une phrase de positionnement ; une ligne « Alternance
   Île-de-France · 3 sem. entreprise / 1 sem. école · disponible » ; deux actions :
   *Me contacter* et *Télécharger le CV (PDF)*. En haut à droite : FR/EN et
   Page/Terminal.
2. **Le mur** : section sombre, le mur LED en 3D, un écran par projet (huit
   projets). Survol ou focus : l'écran s'allume, le nom et la stack défilent.
   Clic : la fiche du projet s'ouvre à côté du mur (pas de modale) : ce qu'il
   fait, la stack, le lien démo ou dépôt.
3. **Parcours** : présenté comme un ordre de passage, du plus récent au plus
   ancien, en colonne de dates à chasse fixe : formation à EPITECH, formations
   We.Code, analyse cyber à l'ASIN, puis les diplômes.
4. **Compétences** : regroupées par famille, en texte, sans badges colorés.
5. **Contact** : grand, en fin de page : e-mail, téléphone, LinkedIn, GitHub,
   PDF. Copie de l'e-mail au clic avec confirmation.

**Page, mobile (375 px)** : même ordre. L'ouverture tient en un écran avec le
contact accessible dès le haut. Le mur devient une bande d'écrans qu'on fait
défiler du doigt, ou sa version statique sur appareil modeste.

**Terminal** : plein écran sombre, une invite, une ligne d'accueil courte et
les suggestions cliquables visibles dès l'ouverture (profil, projets,
parcours, compétences, contact, cv, aide). Sur mobile, les suggestions
remplacent le clavier.

## 6. États

- **Chargement** : le texte arrive rendu par le serveur ; le mur affiche sa
  version statique tant que la 3D charge, puis fond enchaîné.
- **Sans WebGL / mouvement réduit / appareil modeste** : mur statique (image
  des écrans + liste des projets), pas de message d'erreur.
- **Échec de la scène** : repli statique silencieux.
- **Sans JavaScript** : page complète lisible ; bascules par liens.
- **Terminal, commande inconnue** : « Commande inconnue. Essaie : … » avec les
  suggestions.
- **Copie de l'e-mail** : « Copié » pendant deux secondes ; si la copie est
  refusée, le lien `mailto:` reste.
- **Projet sans démo ni dépôt public** : la fiche le dit (« code privé, démo
  sur demande »), pas de lien mort.

## 7. Interactions

- Défilement : apparitions par fondu court, une seule fois ; le mur s'allume
  à son entrée à l'écran.
- Mur : survol ou focus clavier allume un écran ; flèches pour passer d'un
  écran à l'autre ; Entrée ouvre la fiche ; Échap la ferme.
- Bascules FR/EN et Page/Terminal : instantanées, sans recharger, adresse mise
  à jour pour partager le lien exact.
- Terminal : historique avec flèche haut, Tab complète, `clear` efface ;
  aucune animation de frappe imposée.

## 8. Contenu

- **Faits** : seulement la copie publique du CV maître (ADR 0001), en deux
  langues (ADR 0005).
- **Ce qui manque au CV maître pour ce site** (à y ajouter, validé par Kevin,
  avant le lot 2) :
  - une fiche courte par projet (problème, ce que j'ai fait, résultat), car le
    CV maître n'a qu'une ligne par projet ;
  - les faits qui font l'effet, s'ils sont vrais : Strongman utilisé en direct
    au championnat national, le nombre d'écrans du mur LED ;
  - les lignes « alternance » (rythme, disponibilité) aujourd'hui dans la
    lettre seulement.
- **Huit écrans du mur** : Strongman, FIBDA Bodybuilding, United Kizdom World
  Congress, RAG-RH, NearYou, BlueLock, API de streaming simulé, Dashboard de
  suivi académique.
- **Textes d'interface** à écrire en FR et EN : boutons, titres de section,
  aide du terminal, messages d'état, aperçu de partage.

## 9. Références impeccable pour la réalisation

`brand.md`, `typeset.md`, `layout.md`, `animate.md`, `overdrive.md` (la
scène 3D), `adapt.md`, `audit.md` avant livraison.

## 10. Questions ouvertes

- Photo : oui, petite, dans le contact (Kevin, 2026-10-25).
- Nom de domaine : sous-domaine Vercel (Kevin, 2026-10-25).
- Le PDF anglais est à produire dans `optimisation_cv`.
