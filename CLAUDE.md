# CV interactif — contexte projet pour Claude Code

Lis ce fichier en entier avant toute tâche. Il pointe vers les docs de
référence — lis aussi celles qui concernent ta tâche avant de coder.

> **⚡ EN TOUT PREMIER, à chaque nouvelle session : lis `JOURNAL.md`.**
> C'est le fil de continuité (où on en est, la prochaine action, les leçons
> apprises). Tu le **mets à jour en fin de session**.

## Le projet en une phrase

Le CV web de Kevin (Ariel Kevin SODJINOU), envoyé par lien dans ses
candidatures d'alternance fullstack et IA : une page qui se lit en 30 secondes,
une scène 3D signature (le mur LED du Strongman, un écran par projet) et un
chat « Demande à mon CV ». Stade : amorce, aucun code.

## Où en est le projet — LIS CECI AVANT TOUTE CHOSE

- **Phase actuelle : amorce.** Pas de code, pas de `PRODUCT.md` validé, pas de
  brief de design. Aucun écran ne se code avant un brief `impeccable shape`
  validé par Kevin.
- Remplace le dépôt `Curriculum` (dérivé d'un modèle open-source), abandonné :
  on n'en reprend ni le code ni le contenu.
- Le chat attend une clé d'API et un plafond de dépense (`A-FAIRE.md`).

## Stack technique

- Next.js (App Router) + TypeScript, Tailwind, hébergé sur Vercel.
- 3D : React Three Fiber, une seule scène, chargée à la demande, avec repli
  statique (ADR 0002).
- Chat : une route serveur, contexte = le CV public (ADR 0003).
- Contenu : copie publique du CV maître d'`optimisation_cv` (ADR 0001).
  Pas de base de données.

## Documents de référence — à consulter selon la tâche

| Doc | Quand le lire |
|---|---|
| `JOURNAL.md` | **En tout premier, à chaque session.** |
| `A-FAIRE.md` | Pour les actions manuelles/externes en attente |
| `PRODUCT.md` | Avant tout travail de design (quand il existera) |
| `docs/workflow-git.md` | Avant tout commit |
| `docs/decisions/` | Avant de remettre en cause un choix déjà fait |

## Règles d'or, non négociables

1. **Ne jamais faire `git push` sans confirmation explicite, à chaque fois.**
2. **Aucun fait hors du CV maître.** Tout ce que le site ou le chat affirme
   vient de `~/PROJETS/optimisation_cv/cv/contenu.json`, via la copie publique.
   Pas de chiffre du portfolio, pas de formulation enjolivée. Un fait absent du
   CV maître s'y ajoute d'abord, jamais directement ici.
3. **Dépôt public : aucune donnée privée.** Ni téléphone, ni adresse, ni
   secret. L'e-mail ne s'écrit pas en clair dans le HTML.
4. **Le contenu passe avant la 3D.** Le CV se lit sans WebGL, sans JavaScript
   lourd, sur un téléphone modeste et dans l'aperçu d'un client mail. La scène
   3D est un bonus qui ne bloque jamais l'accès au texte.
5. **Les missions freelance de 2026 s'affichent comme projets réalisés**, pas
   comme une expérience « Freelance » (décision de Kevin, 2026-10-25).
6. **Le chat ne répond que sur le CV**, refuse le reste, ne garde aucune
   conversation, et ne peut pas dépasser son plafond de dépense.
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
