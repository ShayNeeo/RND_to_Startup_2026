# Pull Request

Two PR kinds. Pick the template that matches the **base** branch.

| Base | Head | Template |
|------|------|----------|
| `dev` | `feature/*` or `cr/*` | [forms/PULL_REQUEST_FEATURE.md](forms/PULL_REQUEST_FEATURE.md) |
| `stable` | `dev` only | [forms/PULL_REQUEST_STABLE.md](forms/PULL_REQUEST_STABLE.md) |

GitHub copies live in `.github/PULL_REQUEST_TEMPLATE/`. Keep them in sync with `rules/forms/`.

## Feature → `dev`

- CR path is required unless the change is a one-file docs typo.
- CI (landing build, later API/Flutter tests) must be green.
- Reviewer checks the CR **MUST KEEP / MUST NOT TOUCH** lists, not vibes.
- Squash or merge commit is fine; rebase onto latest `dev` before merge.

## `dev` → `stable`

- Head **must** be `dev`. No feature branches.
- Attach a filled [forms/QA_SIGN_OFF.md](forms/QA_SIGN_OFF.md).
- This is a promotion, not a new feature dump. Diff should already have lived on `dev`.

```bash
gh pr create --base dev --head cr/001-api --template feature-to-dev.md
gh pr create --base stable --head dev --template promote-to-stable.md
```

## Title

```
[<app>] <imperative summary>
```

Examples: `[api] freeze OpenAPI for driver`, `[mobile] PIN screen hits /health`, `[release] promote 2026-09-02 QA`.
