# Landing visual QA — 2026-09-02 (in progress)

Local: http://127.0.0.1:5173/
Prod: https://cargox-group-3qm.pages.dev/

## Pass (user-facing, this loop)

- Desktop 1440×900 hero: headline, OSM-style map, 3M+ strip, CTA all in first viewport
- Mobile 390×844 hero: 3-line slogan, map icons, 3M+, CTA in first viewport
- Calculator, 8-step workflow, team portraits, 4-tier pricing
- Pilot modal: fill → success; Esc/overlay close; z-index above navbar
- Zero console errors; zero figma.site image requests
- Hero no longer waits on 11MB CloudFront video before showing copy

## Fixes shipped this loop

- Self-host + compress hero/team assets to WebP
- `whileInView` amount lowered so workflow cannot stay opacity 0
- Modal a11y (`role=dialog`, Esc, body scroll lock)
- `scroll-mt-32` so hash nav clears the glass navbar
- New Thanh portrait from `thanh.jpeg`

## Still open

- Lead form is client-side only (no inbox)
- Hero loop still CloudFront (11MB); poster/local WebP fallback exists
- GitHub ruleset still unchecked (human click)
- Prod Pages deploy is `stable` — this branch is `feature/landing-qa-72h`
