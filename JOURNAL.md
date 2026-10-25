# 🧭 Journal de bord — CV interactif

> **Nouvelle session : LIS CE FICHIER EN PREMIER**, puis `CLAUDE.md`. Tu sauras
> où on en est, quoi faire ensuite et quoi éviter — sans relire tout le code.
>
> **Discipline** :
> 1. Au **démarrage** : lire les trois sections ci-dessous, puis agir / proposer.
> 2. En **fin de session** : mettre à jour « État & prochaine action », ajouter
>    une entrée au journal des sessions, consigner toute erreur en « Leçons ».
> 3. Convertir les dates relatives en absolues. Rester concis.

Carte des documents : `CLAUDE.md` (règles), `A-FAIRE.md` (actions hors code),
`docs/decisions/` (pourquoi les choix), `docs/workflow-git.md` (branches).

---

## 📍 État actuel & prochaine action

*(Mis à jour le 2026-10-25.)*

- **Version en prod** : https://iamariel.vercel.app, `main` = `staging` =
  `dev` au 2026-10-25 (commit `cf0a650`). Vérifié en ligne : bouton d'envoi
  du terminal et adresses longues sans débordement (320 px), flèche vers le
  contact, carte de fin refermable. Kevin a vérifié sur son téléphone le
  terminal et la flèche.
- **Décisions de Kevin (2026-10-25)** : bouton « Mode terminal » au style
  terminal (ardoise, cyan) gardé ; son actif par défaut ; flèche vers le
  contact visible dès le début de l'exploration.
- **Non vérifié** : pas de zoom iOS sur le champ du terminal (pas d'iPhone
  testé) ; volume et rendu des sons sur appareil réel.
- **Prochaine action** : aucune en cours. Pistes si Kevin relance : envoyer
  le lien dans les candidatures, désactiver GitHub Pages sur l'ancien dépôt
  `Curriculum` (Kevin a choisi de garder le dépôt).

## 📓 Journal des sessions

### 2026-10-25 — Amorce du projet

- Critique du dépôt `Curriculum` (impeccable : revue de design + détection
  automatique). Constat : 25/40 aux heuristiques, modèle reconnaissable,
  contenu de démonstration encore en ligne (projets de Jane Doe, PDF factice
  de 590 octets), infos périmées (Abidjan, téléphone +229, titre sans « IA »),
  21 contrastes insuffisants sur les badges.
- Décisions de Kevin : refonte complète sur un dépôt neuf et public,
  `cv-interactif` ; scène 3D « mur LED du Strongman » ; chat intégré ; pas de
  téléphone ; projets freelance en projets réalisés ; Master = M1 ; la FIBDA
  est une fédération ; le lien sera aussi envoyé par e-mail.
- Décisions techniques : ADR 0001 à 0003. Commit d'amorce validé par Kevin ;
  branches `staging` et `dev` créées.
- Puis Kevin revient sur trois points : téléphone publié ; chat IA abandonné
  (clé payante, ADR 0003 abandonné) ; deux modes au choix, page et terminal
  (ADR 0004). Direction de style « Jour de compétition » validée, sans les
  trois mots de personnalité (retirés à sa demande). Français et anglais au
  choix du visiteur (ADR 0005). `PRODUCT.md` écrit, brief V1 proposé.

### 2026-10-25 (suite) — Fiches projets et correction du CV maître

- Premier jet des fiches vérifié dans les dépôts de chaque projet. Deux
  erreurs trouvées dans le CV maître, donc dans le PDF envoyé : RAG-RH
  annonçait ChromaDB et OpenAI (remplacés), NearYou une revendication par OTP
  SMS (c'est WhatsApp, en pause). Corrigées dans `optimisation_cv`, PDF
  régénéré sur une page, texte vérifié par extraction.
- Kevin confirme : mur LED utilisé le 19 septembre, projets faits seul, RAG-RH
  projet personnel pensé pour AEIG, API de streaming en mai 2024, dashboard en
  janvier 2024. Pas de chiffres de vente. BlueLock retiré du mur (lien mort).
- Fiches versées à côté du CV maître (`cv/fiches-projets.json`, ADR 0017 de
  `optimisation_cv`), zone « Île-de-France » dans `cv/lettre.json`. Faites
  dans des worktrees : la copie principale d'`optimisation_cv` porte un
  travail en cours d'une autre session.

- Fusion dans `optimisation_cv` : l'autre session a créé sa branche
  `fix/texte-visible-lineaire` entre ma vérification (copie sur `dev`) et ma
  fusion ; les deux fusions sont tombées sur sa branche. Rattrapé sans toucher
  à sa copie : `dev` avancé en avance rapide sur ces fusions (vérifié par
  `git log dev`), sa branche se retrouve partie du nouveau `dev`.
- Version anglaise du CV maître et des fiches rédigée (brouillon dans un
  worktree d'`optimisation_cv`, branche `feat/cv-anglais`), parité vérifiée :
  même structure, mêmes liens, mêmes dates de fin.

### 2026-10-25 (suite) — Lot 1 : la page 2D

- Next.js 16.4.3 (Cache Components), une route par langue `/fr` et `/en`,
  statiques ; `/` renvoie selon le cookie puis la langue du navigateur
  (ADR 0005 amendé : chemin plutôt que `?lang=`).
- Synchronisation depuis l'historique git d'`optimisation_cv` (référence
  `dev`), parité FR/EN contrôlée, PDF FR et EN générés par le générateur de
  ce dépôt. Le PDF anglais tient sur deux pages : correction prête dans
  `optimisation_cv`, non commitée.
- Page : dossard orange (nom, titre, alternance), modalités et actions, trois
  preuves qui ouvrent la fiche du projet, profil, mur 2D à sept écrans (fiches
  toutes lisibles sans JavaScript), ordre de passage, compétences, formation,
  contact avec photo. Aperçu de partage généré par langue.
- Vérifié : build, typecheck, lint, 5 tests (dont un cassé exprès),
  détecteur impeccable à 0 constat FR et EN, captures 320 / 390 / 820 /
  1440 px, clavier du mur, ancres des preuves, redirections de `/`.
- Revue sécurité (guidance, diff) et revue de code : corrigés : liste fermée
  des champs publiés, liens https seulement, référence git validée, fiches
  rendues côté serveur, faits sortis du code (lenteur, nom, initiales),
  langue par défaut conforme à l'ADR, licences OFL jointes.

### 2026-10-25 (suite) — Du lot 1 à l'île à explorer

- Kevin rejette la page 2D (« un portfolio ») puis le mur LED orange
  (couleurs) : il veut un jeu 3D de découverte progressive, dans l'univers de
  son portfolio. Prototype de l'île fait et jugé « mieux » ; ADR 0006.
- Ajouts demandés : personnage humain avec sa photo en cercle, terminal à
  côté (`/fr/terminal`), jalons « formation » / « expérience pro », plus de
  version classique, accroche raccourcie (tirée d'un champ `accroche` à
  ajouter au CV maître, branche `feat/accroche-cv-web` d'optimisation_cv, non
  commitée).
- Vérifié : build, typecheck, lint, tests ; captures desktop et mobile ;
  déplacement clavier et toucher ; découvertes ; commandes du terminal.
- Puis : photo retirée de la tête du personnage (tête stylisée) ; commande
  `photo` (alias image, picture, `whoami --photo`) : portrait en ASCII calculé
  dans le navigateur, bouton vers la vraie photo. Écarté le même jour : Kevin
  ne s'y reconnaît pas. `photo` affiche désormais la vraie photo en cercle.

### 2026-10-25 (suite) — Revue, mise en avant de l'alternance, commits

- Modalités d'alternance mises en avant (pastilles) sur l'écran titre, la
  carte de départ, le terminal et le secours ; rythme écrit en chiffres
  (« 3 semaines… 1 semaine ») dans le CV maître (optimisation_cv, fusionné
  dans `dev`). « CV interactif » retiré au-dessus du nom.
- Revue sécurité (guidance, diff) + relecture : aucun bloquant. Corrigé :
  secours si la scène plante ou perd son contexte WebGL, CSP de production
  (sans nonce), « Aller à… » utilisable au clavier (bouton « Y aller »), Tab
  et focus du terminal, touches vidées au changement de fenêtre, liens
  Markdown nettoyés dans l'île, parité île / terminal (cadre, technos,
  certifications, langues, lenteur), textes morts retirés, garde contre la
  publication d'une copie de travail, OG en 404 sur langue inconnue.
- Vérifié en production locale : CSP active, aucune erreur console sur l'île
  et le terminal, PDF FR et EN d'une page.

### 2026-10-25 (suite) — Mise en ligne

- Premier déploiement Vercel : « No framework detected », seules les pièces de
  `public/` répondaient, toutes les pages en 404. Corrigé par `vercel.json`
  (`framework: nextjs`), poussé sur confirmation ; en ligne après ~2 min.
- Vérification en ligne : les flèches ne déplaçaient plus le personnage après
  « Commencer » : le focus allait au menu « Aller à… », qui avalait les
  flèches. Le focus va désormais à l'île. Corrigé et vérifié en local.

### 2026-10-25 (suite) — Joystick mobile

- Retour de Kevin sur téléphone : déplacer le personnage faisait bouger la page.
  Ajout d'un joystick tactile (écrans tactiles seulement, `pointer: coarse`),
  vitesse selon l'inclinaison ; l'île bloque le défilement et le zoom de la
  page (`touch-action: none`). Vérifié en émulation tactile : le personnage
  avance, la page ne défile pas.
- L'ancien CV (dépôt `Curriculum`) répond toujours sur GitHub Pages
  (`ariel013.github.io/Curriculum`, « Interactive Resume ») ; Kevin garde le
  dépôt.

### 2026-10-25 (suite) — Écran de chargement

- Retour de Kevin : l'île met du temps à apparaître, un visiteur pressé ne la
  voit pas. Ajout d'un écran de chargement (logo, nom, barre, raccourcis PDF
  et terminal) jusqu'à ce que l'île soit réellement prête (police des textes
  3D chargée), puis l'écran titre ; au-delà de 10 s, l'écran titre s'affiche
  quand même. Police 3D réduite aux caractères utilisés (327 Ko → 32 Ko) et
  préchargée dès le HTML. Consigne retirée sur écran tactile.
- Mesuré en émulation mobile à 1,6 Mbit/s (latence 150 ms) : écran de
  chargement à 0,7 s, écran titre avec l'île à 28 s. Sur un vrai 4G, non
  mesuré.

### 2026-10-25 (suite) — Écran de chargement retiré

- En ligne, l'écran de chargement est apparu sans mise en forme (CSS périmée
  du cache Vercel). Kevin le trouve laid et demande de le retirer : l'écran
  titre s'affiche de nouveau d'emblée, l'île apparaît en fondu dès qu'elle est
  prête (signal réel, police 3D réduite et préchargée : conservés).

### 2026-10-25 (suite) — Flèches du joystick, sons, animations

- Joystick : quatre flèches indigo dans l'anneau blanc.
- Effets sonores synthétisés (Web Audio, aucun fichier) : pas, découverte,
  retour sur un lieu, clic, fanfare de fin ; démarrent au clic sur
  « Commencer » ; bouton 🔊/🔇 dans le tableau de bord, choix retenu.
- Animations : un lieu découvert saute, tourne sur lui-même et lâche une onde
  et des éclats de sa couleur (effet monté seulement pendant l'animation) ;
  le contenu des cartes arrive en cascade.
- Corrigé en route : le bouton de fermeture des cartes passait sous les
  éléments animés (couche propre) ; l'effet d'éclats d'abord monté en
  permanence (16 objets × 21 lieux) faisait planter le navigateur de test.

### 2026-10-25 (suite) — Sonorités par quartier, écran titre

- Une sonorité par quartier à la découverte : projets (arpège), parcours
  (marimba), compétences (cloche de cristal), contact (accord), départ.
- Écran titre : « Commencer » et « Mode terminal » sur une ligne, « CV en
  PDF » dessous ; bouton terminal à l'allure d'un terminal (ardoise, cyan,
  chasse fixe) en attendant le choix de couleur de Kevin.
- Débordements chassés à 320, 360 et 390 px : libellés qui passent à la
  ligne, « Aller à… » sur sa ligne en très petite largeur, bouton son et
  « Y aller » de nouveau visibles sur téléphone (ils étaient masqués). La
  consigne n'était pas centrée : son centrage par `transform` était écrasé
  par l'animation d'entrée.

### 2026-10-25 (suite) — Terminal mobile, flèche vers le contact, clôture

- Poussé : sonorités, écran titre, débordements (lot précédent).
- Terminal : bouton d'envoi ↵ (Kevin ne pouvait pas envoyer une commande
  depuis son téléphone), `enterKeyHint`, champ en 16 px sur écran tactile ;
  les adresses longues (LinkedIn) élargissaient la fenêtre à 320 px, elles
  passent maintenant à la ligne.
- Île : triangle cyan au sol devant le personnage, qui pointe toujours vers
  le contact et s'efface une fois arrivé ; la carte « Île explorée » se
  ferme pour continuer à regarder.
- Ces deux lots ont été commités directement sur `dev`, sans branche de
  travail : écart au workflow, sans conséquence (fusion vers `staging` et
  `main` faite comme d'habitude).
- Capitalisé au coffre (voir Leçons).

## 🎓 Leçons apprises

- **Vérifier la mise en ligne par les pages, pas par le statut du
  déploiement** : Vercel a « réussi » un déploiement sans framework qui ne
  servait aucune page. Déclarer le framework dans `vercel.json`. (2026-10-25)
- **Le cache de build Turbopack a servi une feuille de style périmée en
  production** (deuxième fois après le local) : HTML neuf (écran de
  chargement), CSS d'avant (joystick à gauche, aucune règle du chargement).
  Vercel restaure `.next` entre deux builds ; le build part désormais d'un
  `.next` vide (`vercel.json`). Vérifier le CSS servi après chaque mise en
  ligne. (2026-10-25)
- **Un focus déplacé se teste avec les touches qu'il capte** : envoyer le
  focus sur un `<select>` lui donne les flèches du jeu. (2026-10-25)

- **Un build Turbopack peut servir une feuille de style périmée** après une
  réécriture complète de `globals.css` : le CSS servi ne contenait pas les
  nouvelles règles. Vérifier le CSS servi (pas seulement « Compiled ») et,
  au doute, `rm -rf .next` avant de reconstruire. (2026-10-25)

- **Ne jamais fusionner dans la copie de travail d'une autre session.** La
  branche courante peut changer entre la vérification et la commande. Fusionner
  dans un worktree dédié à la branche cible (`git worktree add <dossier> dev`),
  ou avancer la référence avec `git update-ref <ref> <nouveau> <ancien>`, qui
  refuse si elle a bougé. (2026-10-25)

- **Un champ qui ne s'envoie qu'avec Entrée bloque le téléphone** : le
  terminal n'avait pas de bouton d'envoi ; tous les tests pressaient Entrée.
  Coffre : `un-champ-qui-ne-s-envoie-qu-avec-entree-est-bloque-sur-telephone`.
  Les deux leçons de cache CSS ci-dessus sont montées au coffre
  (`un-cache-de-build-restaure-peut-servir-l-ancienne-feuille-de-style`).
  (2026-10-25)
- **`pkill -f "next start"` s'est tué lui-même** (code 144, build suivant
  jamais lancé), et un `next-server` orphelin tenait le port : arrêter par
  PID, vérifier par `ss -ltnp`. (2026-10-25)
