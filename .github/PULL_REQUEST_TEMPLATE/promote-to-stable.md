<!-- dev → stable. Canonical: rules/forms/PULL_REQUEST_STABLE.md -->

## Type

- [x] Promotion (`dev` → `stable`)
- [ ] Hotfix (explain why this is not a `dev` promotion)

**Head must be `dev` unless hotfix.**

## QA

- Sign-off: `changes/QA-YYYYMMDD.md`
- QA owner:

## What's going to production

<!-- Features already on dev. No new commits on this branch except merge. -->

## Checks

- [ ] CI green on `dev`
- [ ] QA sign-off attached
- [ ] Landing / API / driver smoke as in the QA form
- [ ] Rollback: revert this PR on `stable`, then back-merge to `dev` if needed
