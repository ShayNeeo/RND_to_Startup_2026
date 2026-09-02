# QA sign-off — `dev` → `stable`

**Date:** YYYY-MM-DD  
**QA owner:** (person or agent that is not the sole author of the tip)  
**`dev` SHA:**

## Automated

- [ ] `pnpm run build:landing` (or CI) passes
- [ ] API tests if `apps/api` exists: `cd apps/api && uv run pytest`
- [ ] Flutter tests if driver changed: `cd apps/mobile-driver && flutter test`

## Manual (contest / product)

- [ ] Dispatcher path: seed or upload → optimize → map tiles load (OSM) → publish
- [ ] Driver path: PIN → stop list → Chỉ đường opens Maps → status writeback
- [ ] No paid map API keys required in `.env`
- [ ] Dual-value numbers (km / CO₂) are computed, not hardcoded marketing copy

## Process

- [ ] Every CR merged since last `stable` is in `changes/archive/` or linked
- [ ] No feature branch is being merged into `stable` on this PR

## Result

- [ ] **PASS** — open `dev` → `stable` PR
- [ ] **FAIL** — `fix/` from `dev`, do not promote

Notes:
