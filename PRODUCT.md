# Product

## Register

brand

## Users

Deux publics reçoivent le lien de Kevin, par e-mail, dans une candidature ou
depuis LinkedIn :

- **Recruteurs RH et chargés de recrutement** d'entreprises qui prennent des
  alternants en développement. Ils ouvrent le lien au bureau, en journée,
  souvent depuis l'aperçu d'un client mail, parfois sur téléphone, entre deux
  dizaines d'autres candidatures. Ils donnent environ 30 secondes. Leur tâche :
  décider si le profil mérite un entretien, et retrouver le contact.
- **Développeurs et responsables techniques** qui relisent la candidature avant
  un entretien. Ils veulent juger la stack, voir du code et des projets réels,
  et repèrent vite un modèle de CV recopié.

Les deux lisent en français ou en anglais.

## Product Purpose

Remplacer le CV PDF générique par une page qu'on retient, sans perdre ce qu'un
PDF fait bien : se lire vite. Kevin, en M1 à Paris, cherche une alternance en Île-de-France de
développeur fullstack et IA. La page doit faire passer en une demi-minute qui
il est, ce qu'il a livré, et comment le joindre, puis récompenser celui qui
reste avec des preuves.

Réussite : un recruteur retrouve le nom, le positionnement et le contact sans
chercher ; un développeur clique vers une démo ou un dépôt ; quelqu'un mentionne
la page en entretien.

## Brand Personality

La voix de Kevin : sobre, directe, à la première personne, sans survente. Pas
de « passionné », « expert », « fort de ». Chaque affirmation a sa preuve, un
lien vers ce qui tourne.

L'émotion visée : la surprise d'abord (ce n'est pas un CV comme les autres),
puis la confiance (c'est quelqu'un qui livre). L'univers vient d'un fait de son
parcours : il a construit le logiciel d'arbitrage qu'une fédération a utilisé
en direct, devant du public, sur un mur LED. Le site emprunte à ce jour de
compétition.

## Anti-references

- Les modèles de CV web à colonne latérale beige, photo ronde, badges technos
  colorés et carte A4 centrée (l'ancien dépôt `Curriculum`).
- Le portfolio de développeur générique : fond sombre, dégradés violets,
  effets de verre, grilles de cartes identiques, chiffres géants.
- Le terminal « hacker » vert sur noir, les néons, le texte qui se tape tout
  seul pendant dix secondes.
- La 3D décorative qui tourne pendant que le contenu attend.

## Design Principles

1. **Le contenu d'abord, l'effet ensuite.** Le nom, le positionnement et le
   contact se lisent avant que la moindre animation ne démarre.
2. **Montrer plutôt qu'affirmer.** Une démo, un dépôt, un fait daté valent
   mieux qu'un adjectif.
3. **Un seul moment fort.** Le mur LED porte l'effet ; le reste se tient
   sobre pour le laisser exister.
4. **Deux lectures, une seule vérité.** Page et terminal, français et anglais
   disent exactement la même chose.
5. **Ne jamais ralentir celui qui est pressé.** Toute interaction est un
   bonus, jamais un passage obligé.

## Accessibility & Inclusion

- WCAG 2.2 AA : contraste du texte et des contrôles, navigation complète au
  clavier, focus visible.
- `prefers-reduced-motion` respecté : scène 3D remplacée par sa version
  statique, animations réduites à des fondus.
- Contenu entier lisible sans WebGL et sans JavaScript ; la scène 3D n'a aucun
  contenu exclusif.
- Le terminal est utilisable au lecteur d'écran (sorties annoncées) et sur
  téléphone sans clavier (suggestions cliquables).
- Langue de la page déclarée et suivie au changement FR / EN.
