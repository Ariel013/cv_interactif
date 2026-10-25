# Workflow git

Dérivé de `brain/00-methode/workflow-git.md`, qui fait foi.

## La règle absolue

**Jamais de `git push` sans confirmation explicite de Kevin, à chaque fois.**
Le reste (branche, `add`, `commit`, fusion locale, tag), l'agent l'exécute.

## Branches

```
main       ← PRODUCTION (Vercel). Reçoit uniquement staging.
 └ staging  ← RECETTE. Miroir de la prochaine prod.
    └ dev    ← INTÉGRATION. On y teste tout.
       └ <type>/<slug>  ← une branche par tâche, issue de dev.
```

- Jamais de commit direct sur `main`, `staging`, `dev` : des fusions seulement.
- `type` ∈ `feat`, `fix`, `refactor`, `docs`, `chore`, `test`, `style`.
- Promotion en local, un niveau à la fois, fusions non-FF, tag à chaque
  release (`v1.0`…). Pas de PR web `dev→main`.
- Jamais de `reset --hard` sur une branche partagée ; rattraper en
  `merge --ff-only`.
- Le hook `scripts/pre-push` (copié dans `.git/hooks/`) refuse force-push et
  suppression sur `main`, `staging`, `dev`. À réinstaller après un nouveau
  clone : `cp scripts/pre-push .git/hooks/pre-push`.

## Séquence d'une tâche

1. Lire les docs que `CLAUDE.md` désigne.
2. Brancher `<type>/<slug>` depuis `dev` à jour.
3. Coder.
4. Vérifier : typecheck, tests, build, **et regarder la page** à 375, 768 et
   1440 px, WebGL coupé compris.
5. Revue `code-reviewer`, et `security-reviewer` si le diff touche au mode terminal,
   aux secrets ou aux données publiées.
6. Rapport de tâche ; Kevin valide le commit.
7. `git add <chemins nommés>` — jamais `git add .` ni `-A`.
8. Mettre à jour `A-FAIRE.md` et `JOURNAL.md`.

## Format de commit

```
<type>: <résumé court à l'impératif>

<corps optionnel : le pourquoi>
```

Jamais de propriété non mesurée dans un message de commit.
