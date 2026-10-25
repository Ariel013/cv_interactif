# CV interactif — contexte projet pour Claude Code

Lis ce fichier en entier avant toute tâche. Il pointe vers les docs de
référence — lis aussi celles qui concernent ta tâche avant de coder.

> **⚡ EN TOUT PREMIER, à chaque nouvelle session : lis `JOURNAL.md`.**
> C'est le fil de continuité (où on en est, la prochaine action, les leçons
> apprises). Tu le **mets à jour en fin de session**.

## Le projet en une phrase

Le CV de Kevin (Ariel Kevin SODJINOU), envoyé par lien dans ses candidatures
d'alternance fullstack et IA : une île en 3D qu'on explore avec un personnage
à son image, et un mode terminal à côté (ADR 0006, 0004). Stade : prototype
validé dans sa direction, pas encore en ligne.

## Où en est le projet — LIS CECI AVANT TOUTE CHOSE

- **Phase actuelle : avant la mise en ligne.** Île et terminal commités sur
  `dev` le 2026-10-25 ; pas encore de dépôt distant ni de déploiement.
- Pas de version classique en page : décision de Kevin (ADR 0006). Le secours
  sans 3D est une introduction courte.
- Univers visuel : celui du portfolio de Kevin (indigo, cyan, Inter).

## Stack technique

- Next.js (App Router) + TypeScript, Tailwind, hébergé sur Vercel.
- 3D : React Three Fiber + drei, une île chargée à la demande, avec une
  introduction de secours (ADR 0006).
- Mode terminal : commandes prédéfinies, réponses tirées du même contenu,
  aucun appel serveur (ADR 0004).
- Contenu : copie publique du CV maître d'`optimisation_cv` (ADR 0001).
  Pas de base de données.

## Documents de référence — à consulter selon la tâche

| Doc | Quand le lire |
|---|---|
| `JOURNAL.md` | **En tout premier, à chaque session.** |
| `A-FAIRE.md` | Pour les actions manuelles/externes en attente |
| `PRODUCT.md` | Avant tout travail de design |
| `docs/brief-v1.md` | Avant de coder un écran de la V1 |
| `docs/workflow-git.md` | Avant tout commit |
| `docs/commandes.md` | Pour lancer, synchroniser, tester |
| `docs/decisions/` | Avant de remettre en cause un choix déjà fait |

## Règles d'or, non négociables

1. **Ne jamais faire `git push` sans confirmation explicite, à chaque fois.**
2. **Aucun fait hors du CV maître.** Tout ce que le site affirme
   vient de `~/PROJETS/optimisation_cv/cv/contenu.json`, via la copie publique.
   Pas de chiffre du portfolio, pas de formulation enjolivée. Un fait absent du
   CV maître s'y ajoute d'abord, jamais directement ici.
3. **Dépôt public : seulement ce que Kevin a choisi de publier.** Téléphone et
   e-mail publiés (décision du 2026-10-25), en liens cliquables. Jamais
   d'adresse postale ni de secret.
4. **Personne n'est bloqué par la 3D.** Sans WebGL ou en mouvement réduit,
   l'introduction de secours, le terminal et le PDF donnent l'essentiel ; dans
   l'île, « Aller à… » et le PDF restent toujours à portée.
5. **Les missions freelance de 2026 s'affichent comme projets réalisés**, pas
   comme une expérience « Freelance » (décision de Kevin, 2026-10-25).
6. **Les deux modes et les deux langues disent la même chose.** Page et
   terminal, français et anglais lisent le même contenu ; aucun fait n'existe
   dans un seul des quatre (ADR 0004, 0005).
7. **Sur une décision d'architecture ambiguë, s'arrêter et demander** plutôt
   que d'improviser silencieusement.

## Après chaque tâche — format de rapport attendu

Tout retour de l'agent donne **l'utile seulement** (format du coffre,
`brain/00-methode/rapport-de-tache.md`) :

```
## <la tâche en une ligne>
**Fait** : actions effectuées et résultat mesuré ; ce qui reste non vérifié
**Sécurité** : revue du diff faite → constats ; ou non faite → pourquoi
**Challenge** : ce que je remets en cause, et ma recommandation
**À toi** : décisions à prendre, actions manuelles, dans l'ordre
**Commit proposé** : <message exact, non encore exécuté>
```

Pas de liste de fichiers, pas de code, pas de commandes. Une nouvelle
dépendance, un changement touchant aux secrets ou une décision qui mériterait
un ADR se signale toujours, en une ligne.

Kevin valide le commit avant qu'il ne soit fait.

## Continuité entre sessions

1. **Reprise sans relecture du code** : `JOURNAL.md` + ce fichier suffisent.
2. **Apprendre des erreurs** : toute erreur corrigée va dans « Leçons
   apprises » de `JOURNAL.md`.
3. **Être force de proposition** : recommander la suite, pas lister des options.

En fin de session, mettre à jour `JOURNAL.md`.
