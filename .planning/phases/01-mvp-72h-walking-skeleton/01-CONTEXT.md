# Phase 1: 72h Walking Skeleton - Context

**Gathered:** 2026-09-02
**Status:** Ready for planning

<domain>
## Phase Boundary

72-hour contest-proof loop: Excel/seed → heuristic cluster+NN+2opt → Leaflet OSM dispatcher confirm → Flutter driver list + Maps deep-link + status writeback → before/after km/litres/CO₂. Zero paid map, routing, traffic, or carbon APIs. Two builders only.

</domain>

<decisions>
## Implementation Decisions

### People
- **D-01:** Phạm Quốc Thanh owns `apps/mobile-driver` Flutter app only (list, deep-link, status, optional photo).
- **D-02:** Nguyễn Quang Chiến owns `apps/api` (new FastAPI) + solver + CO₂ + seed + one dispatcher HTML page. He does **not** wait on a Next.js portal.

### Calendar
- **D-03:** Wall clock is 72 hours. If a task does not fit, cut it; do not silently extend.

### Money / APIs
- **D-04:** No Google Maps, Mapbox, HERE, Goong, or commercial VRP API keys in this phase.
- **D-05:** Map display = Leaflet + OSM tiles.
- **D-06:** Geocode = optional Nominatim (1 req/s, disk cache) **or** lat/lng columns in the Excel (preferred for demo). Paste Google Maps URL parser is allowed (client-side, no billed API).
- **D-07:** Distances = haversine × circuity factor `HCMC_CIRCUITY=1.35` (named constant in code + README).
- **D-08:** Turn-by-turn = Android/iOS intent to Google Maps / Apple Maps / `geo:`.
- **D-09:** CO₂ = km × (L/100km) × factor_kg_per_litre from `packages/shared-types` or `apps/api/data/emission_factors.json` (GLEC/IPCC published defaults). No SaaS carbon API.

### Stack
- **D-10:** API: Python 3.12+ FastAPI via `uv`. Package manager `uv` only (AGENTS.md).
- **D-11:** DB: SQLite file `apps/api/data/greenlogix.db`. No Postgres/PostGIS/Redis/K8s this phase.
- **D-12:** Driver: Flutter (user lock). Sideload / `flutter run`. No store.
- **D-13:** Dispatcher UI: server-rendered HTML (Jinja or HTMX) served by FastAPI, not `apps/web-portal` Next.js.
- **D-14:** Monorepo stays pnpm for JS landing; API is a sibling `apps/api` with its own `pyproject.toml`.
- **D-15:** Shared contracts: OpenAPI from FastAPI + a small `packages/shared-types` TS types **or** a checked-in `openapi.yaml` that Flutter codegen/consumes. Do not invent a third contract.

### Algorithm
- **D-16:** Cluster-first (k-means or greedy radius on lat/lng), then nearest-neighbor + 2-opt per route. OR-Tools allowed **only** if it installs via `uv` with no extra system deps and still runs offline. Default path must work without OR-Tools.
- **D-17:** Baseline for RPT-02: fill vehicles in spreadsheet order until capacity, sequence as given. That is the "trước".

### Demo
- **D-18:** Seed is the 80-order / 10-truck HCMC food-distributor case. Coordinates must be real-ish inner HCMC (Q1, Q3, Bình Thạnh, Phú Nhuận, Q7, Thủ Đức) so the Leaflet map is not a blob.
- **D-19:** Auth: single dispatcher bearer `DEMO` and driver PIN `0000` hardcoded behind env `GREENLOGIX_DEMO=1`. Not production auth.
- **D-20:** Success photo: optional. Status update is mandatory.

### Claude's Discretion
- Exact Flutter folder layout under `apps/mobile-driver`.
- Exact 2-opt iteration cap.
- Whether Nominatim is wired at all if seed xlsx already has lat/lng.
- Hosting: documented `uv run` + `flutter run` is enough; Cloudflare Tunnel optional.

</decisions>

<specifics>
## Specific Ideas

- MVP.xlsx row "Chỉ đường đến từng điểm (Google Maps/Apple Maps)" is the driver navigation contract.
- MVP.xlsx row "Hỗ trợ thuật toán VRP cơ bản (heuristic)" is the solver contract.
- Dual-value KPIs from BRAINSTORM: −8–15% km, −5–10% fuel, −5–12% CO₂/order — demo must **compute** deltas, not hardcode the marketing numbers.
- Landing stays untouched except a "Demo" link if time leftover (not a must_have).

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Product / contest
- `MVP.xlsx` — bắt buộc vs nên có
- `docs/planning/MVP.xlsx` — duplicate
- `PROJECT_DESCRIPTION.md` — 80 orders / 10 trucks case
- `docs/planning/BRAINSTORM_IDEA.md` — GĐ 1, KPI table, API cost risk
- `docs/planning/Master_sheet.xlsx` sheets CAPEX + OPEX — what we are **not** buying
- `docs/planning/User_acquisition_plan.xlsx` — DAU later, not Phase 1
- `README.md` — monorepo layout
- `apps/web-portal/README.md` — future portal; do not build in 72h
- `apps/mobile-driver/README.md` — driver capability list (deep-link, POD)
- `/home/shayneeo/.agents/AGENTS.md` — uv, pnpm, CR/worktree

### Cost sweet spot
- Reject OPEX 1.1 (5M VND map) and 1.2 (2.5M VND traffic) for this phase.
- Keep Cloudflare Pages for existing landing only.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `apps/landing` Vite/React — marketing only; do not couple the skeleton to it.
- `packages/shared-types` README only — Phase 1 may add emission factor types + VRPTW JSON shapes.
- `apps/mobile-driver` is a README placeholder; Flutter app is greenfield.
- `apps/web-portal` is a README placeholder; skip.

### Patterns to Follow
- pnpm workspace already lists `apps/*` and `packages/*`.
- Python: `uv init` in `apps/api`, `uv add fastapi uvicorn openpyxl`.

### Integration Points
- Flutter talks HTTP to FastAPI. CORS `*` in demo mode.
- Shared OpenAPI is the file ownership seam between Thanh and Chiến (Chiến publishes, Thanh consumes). Hour 0–4 contract freeze.

</code_context>

<deferred>
## Deferred Ideas

- Next.js dispatcher (`apps/web-portal`)
- Flutter store
- Live GPS / traffic
- OR-Tools as default
- Goong Vietnam geocoder
- Backhaul suggestions (MVP.xlsx nên có)
- Multi-depot (MVP.xlsx nên có)
- ISO 14083 PDF
- Real SME onboarding

</deferred>

<scope_fence>
## Out of Scope for This Phase

Paid APIs, Next.js portal, store publish, live GPS, K8s, PostGIS, auth productization, landing redesign, financial model changes.

</scope_fence>
