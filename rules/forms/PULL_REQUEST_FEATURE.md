<!-- Feature → dev. Canonical: rules/forms/PULL_REQUEST_FEATURE.md -->

## Type

- [ ] Feature (`feature/*` or `cr/*` → `dev`)
- [ ] Fix (`fix/*` → `dev`)
- [ ] Docs

**Base must be `dev`.** Do not target `stable`.

## CR

- Path: `changes/CR-YYYYMMDD-NNN.md`
- Or: N/A (one-file docs typo)

## What changed

<!-- 2–5 bullets. What, not how. -->

## MUST KEEP (from CR)

<!-- Integrator checks these still hold. -->

## MUST CHANGE (from CR)

- [ ]

## MUST NOT TOUCH (from CR)

<!-- If the diff hits these paths, reject. -->

## How to verify

```bash

```

- [ ] CI green
- [ ] I ran the verify commands locally (or CI covers them)

## Agent / human

- Author: human / agent (`<tool>`)
- Worktree: `WT-XX`
- Commit trailers: `CR:` `Task:` `Worktree:` present
