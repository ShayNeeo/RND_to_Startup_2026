# Branching

Three long-lived branches. No force-push on `dev` or `stable`.

```
feature/<slug>  or  cr/<nnn>-<slug>
        │
        │  Change Request + Pull Request
        ▼
       dev          integration. CI must pass. QA/QC happens here.
        │
        │  QA sign-off + Pull Request (from `dev` only)
        ▼
     stable         production. Cloudflare Pages / release.
```

`main` is a legacy alias of `stable`. Do not push new work to `main`.

## Names

| Kind | Pattern | Example |
|------|---------|---------|
| Feature | `feature/<area>-<slug>` | `feature/api-optimize` |
| Change-request worktree | `cr/<nnn>-<scope>` | `cr/001-api` |
| Bugfix | `fix/<slug>` | `fix/xlsx-row-errors` |
| Docs | `docs/<slug>` | `docs/contest-packet` |
| Integration | `dev` | — |
| Production | `stable` | — |

`<nnn>` is the CR number (`001`). `<slug>` is lowercase kebab-case.

## Merge rules

| From | To | Vehicle | Who |
|------|----|---------|-----|
| `feature/*` or `cr/*` | `dev` | **CR** (required) + **PR** (`feature-to-dev`) | Author + reviewer (human or agent) |
| `dev` | `stable` | **QA sign-off** + **PR** (`promote-to-stable`) | QA owner. Head branch **must** be `dev` |
| hotfix | `stable` | Exception: `fix/` PR to `stable`, then back-merge `stable` → `dev` | Tech lead |

Never merge a feature branch straight into `stable`.

## Local setup

```bash
git fetch origin
git switch -c dev origin/dev 2>/dev/null || git switch -c dev
git switch -c stable origin/stable 2>/dev/null || git switch -c stable
```

Worktrees (parallel agents/people) go in `.worktrees/` (gitignored):

```bash
git worktree add .worktrees/cr-001-api -b cr/001-api origin/dev
```

## Commits

```
<type>(<scope>): <summary>

CR: CR-YYYYMMDD-NNN
Task: T-XX
Worktree: WT-XX
```

Types: `feat` `fix` `docs` `chore` `test` `refactor` `ci`.

## Remote (one-time)

```bash
git push -u origin dev
git push -u origin stable
```

On GitHub: Settings → General → Default branch = `dev`. Protect `dev` and `stable` (PR required, status checks). Pages/production tracks `stable`.
