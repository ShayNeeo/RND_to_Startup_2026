# GreenLogix (CargoX)

## What This Is

B2B urban logistics optimizer for Vietnamese SMEs: Excel/Sheets in, VRPTW-ish routes out, driver execution on phone, km + fuel + CO₂ on a dashboard. Dual value is cheaper trips and a number a jury can read (CO₂/order). Landing already ships at `apps/landing`. Dispatcher portal and driver app are placeholders.

## Core Value

A dispatcher can import today's orders, get a route that beats their old sequence on km and estimated CO₂, and a driver can execute that list with a Maps deep-link — without paying for map, routing, or traffic APIs.

## Business Context

- **Customer**: SME vận tải / phân phối (food, FMCG, last-mile) in inner HCMC. Direct users: chủ DN, điều phối, tài xế.
- **Revenue model**: SaaS subscription by Monthly Active Driver after a free 4–6 week pilot. Implementation fee later. ESG reports and backhaul commissions are GĐ 4–6, not GĐ 1.
- **Success metric (GĐ 1 / this PLAN)**: contest-ready demo of Excel → clustered routes → Flutter driver → before/after km+CO₂ on the HCMC 80-order / 10-truck case from `PROJECT_DESCRIPTION.md`.
- **Strategy notes**: `docs/planning/BRAINSTORM_IDEA.md`, `MVP.xlsx`, `docs/planning/Master_sheet.xlsx`. OPEX model priced Google/Mapbox at 5M VND/mo + traffic 2.5M VND/mo — **rejected for GĐ 1**.

## Requirements

### Validated

- Landing page (CargoX/GreenLogix) live on Cloudflare Pages.

### Active

- 72-hour walking skeleton: import, optimize, drive, report (see REQUIREMENTS.md v1).

### Out of Scope

- Paid Google/Mapbox/HERE/Goong routing, distance-matrix, or live traffic — no budget.
- Live GPS tracking — MVP.xlsx uses check-in pins only; 72h uses status updates only.
- Full ISO 14083/GLEC auditor-grade report — use a published factor table × litres.
- Flutter store listing, ERP/WMS, multi-depot, backhaul marketplace, EV referral.
- Next.js dispatcher portal (planned in `apps/web-portal/README.md`) — deferred past 72h.

## Context

- Contest: RND to Startup 2026. Team of 5; engineering this phase is two people.
- `MVP.xlsx` already specified the cheap path (heuristic VRP, Maps deep-link, Excel ingest).
- `Master_sheet.xlsx` CAPEX assumed Flutter+dispatcher in 3–4 months / 45M VND. User overrode calendar to **72 hours** and will personally build Flutter; Chiến owns the API.
- AGENTS.md: `uv` for Python, `pnpm`/`bun` for JS, worktree CR for multi-contributor, graphify before shared-type edits.

## Constraints

- **Timeline**: 72 hours wall-clock for Phase 1.
- **Budget**: 0 VND paid logistics/map/traffic APIs. Hosting = local + existing Cloudflare Pages for landing.
- **People**: Phạm Quốc Thanh (Flutter driver app), Nguyễn Quang Chiến (API + solver + CO₂ + thin dispatcher HTML).
- **Stack**: Python FastAPI via `uv`; Flutter for driver; SQLite; Leaflet + OSM tiles; Nominatim with cache + paste lat/lng fallback.
- **Pilot math later**: 3–5 DN, 30–100 vehicles — not this phase.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Zero paid map/routing APIs | No balance; Master_sheet 7.5M VND/mo is GĐ 2+ | Pending implement |
| Flutter driver (Thanh) | User will build the app; Chiến does API | Pending implement |
| 72-hour calendar | User lock | Pending implement |
| Contest demo on sample HCMC set | Highest yield per hour vs onboarding a real SME | Pending implement |
| Heuristic VRP not commercial solver API | Free, explainable, fits 30–100 orders/day | Pending implement |

---
*Last updated: 2026-09-02 after grill lock*
