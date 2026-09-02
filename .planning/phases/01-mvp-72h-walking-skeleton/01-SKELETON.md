# Walking Skeleton — GreenLogix (CargoX)

**Phase:** 1
**Generated:** 2026-09-02

## Capability Proven End-to-End

A HCMC dispatcher seeds 80 inner-city orders and 10 trucks, runs cluster+NN+2-opt, sees Leaflet OSM routes, publishes them, and a Flutter driver with PIN `0000` executes the ordered list with an OS Maps deep-link and status writeback, while the dispatcher reads computed before/after km, litres, and TTW kg CO₂ — with zero paid map, routing, traffic, or carbon APIs.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| API framework | FastAPI 0.141.x on **Python 3.12** via `uv` (`apps/api`, package `greenlogix-api`) | D-10. System Python is 3.14 — do not use it. `uv` only (AGENTS.md). |
| Data layer | SQLite file `apps/api/data/greenlogix.db` + SQLModel 0.0.42 | D-11. No Postgres, PostGIS, Redis, or K8s this phase. `check_same_thread=False`. |
| Auth | Env `GREENLOGIX_DEMO=1`; dispatcher `Authorization: Bearer DEMO`; driver header `X-Driver-Pin: 0000` | D-19. Contest localhost, not a product IdP. 401 when the flag is off. |
| Driver app | Flutter 3.47 / Dart 3.13, `apps/mobile-driver`, org `vn.greenlogix`, sideload / `flutter run` | D-12 / D-01. Overwrites the stale React PWA README. No store. |
| Dispatcher UI | One Jinja2 HTML page `GET /dispatcher` served by FastAPI | D-13. Not `apps/web-portal` Next.js. |
| Map display | Leaflet **1.9.4** CDN + `https://tile.openstreetmap.org/{z}/{x}/{y}.png` | D-05 / D-04. No Mapbox token. HTTPS tiles + OSM attribution. |
| Distances | `haversine_km * HCMC_CIRCUITY` with `HCMC_CIRCUITY = 1.35` | D-07 / VRP-03. Same factor on baseline and optimized. |
| Solver | Greedy-radius cluster (default 3.0 km) → NN + 2-opt (cap 500, hard stop 2000). No OR-Tools on the default path. | D-16 / VRP-01. Offline, explainable. |
| Baseline | Spreadsheet `excel_row` order, greedy-fill ready vehicles by `capacity_kg` | D-17 / RPT-02. |
| CO₂ | `km * (l_per_100km/100) * kg_co2_per_litre` from `apps/api/data/emission_factors.json` (petrol 2.31, diesel 2.68, tank-to-wheel) | D-09 / RPT-01. IPCC 2006 + GLEC v3.2 citations. Not ISO 14083. |
| Geocode | Seed xlsx **has lat/lng**. Nominatim unwired. | D-06 / COST-01. Paste-Maps-URL parser optional in HTML. |
| Navigation | `url_launcher` Google Maps URL → Apple Maps → `geo:` | D-08 / DRV-02. No in-app SDK, no `maps_launcher`. |
| Shared contract | Checked-in `apps/api/openapi.json` (Chiến writes, Thanh hand-writes Dart) | D-15. Do not also invent `packages/shared-types` TS this phase. |
| People / layout | Thanh: `apps/mobile-driver/**` only. Chiến: `apps/api/**`. CR + worktrees WT-01/WT-02. | D-01, D-02. `lib/{api,models,screens}` Flutter layout. |
| Deployment | Documented `uv run` + `flutter run` on LAN. Uvicorn `--host 0.0.0.0 --port 8000`. | Discretion. Cloudflare Tunnel leftover only. Emulator API_BASE `http://10.0.2.2:8000`. |
| Directory layout | Flat FastAPI (`main, db, models, schemas, auth, ingest_xlsx, carbon, seed, solver/*, routers/*`). No 8-layer template. | 72h (D-03). Monorepo keeps pnpm for landing; API is a sibling `pyproject.toml` (D-14). |

## Stack Touched in Phase 1

- [ ] Project scaffold (uv FastAPI + Flutter create, ruff/pytest, flutter test)
- [ ] Routing — FastAPI frozen paths in `openapi.json`; Flutter `PinScreen` → `RouteListScreen` → `StopDetailScreen`
- [ ] Database — SQLite real insert (seed/import) AND real update (stop status, optional photo path)
- [ ] UI — dispatcher Optimize/Publish/Leaflet; Flutter list + Chỉ đường + status buttons
- [ ] Deployment — local full-stack: `GREENLOGIX_DEMO=1 uv run uvicorn greenlogix_api.main:app --host 0.0.0.0 --port 8000` and `flutter run --dart-define=API_BASE=...`

## Frozen HTTP surface (hour 4)

See plan `01-00-PLAN.md` `<interfaces>`. Paths: `/health`, `/openapi.json`, `/dispatcher`, `/seed`, `/orders/import`, `/orders`, `/orders/{id}`, `/vehicles`, `/vehicles/{id}`, `/optimize`, `/routes`, `/routes/publish`, `/report`, `/driver/route`, `/stops/{id}/status`, `/stops/{id}/photo`.

## Out of Scope (Deferred to Later Slices)

> Explicit so later phases do not re-litigate Phase 1's minimalism.

- Next.js dispatcher (`apps/web-portal`)
- Flutter store listing
- Live GPS / traffic
- OR-Tools as default solver
- Goong / Google / Mapbox / HERE billed APIs
- Nominatim bulk geocode
- Backhaul suggestions (MVP.xlsx nên có)
- Multi-depot (MVP.xlsx nên có)
- ISO 14083 PDF pack / GLEC WTW CO₂e
- Real SME onboarding
- Excel/PDF report export, late-risk flags, order filters, check-in map history (Phase 2)
- Dispatcher drag-and-drop reorder (MVP.xlsx bắt buộc remainder → Phase 2)
- Cloudflare Tunnel / VPS hosting
- `packages/shared-types` TypeScript SDK (OpenAPI is the contract)
- Product auth (SSO, per-driver PIN beyond `0000`)

## Subsequent Slice Plan

Each later phase adds one vertical slice on top of this skeleton without altering its architectural decisions:

- Phase 2: Remaining `MVP.xlsx` bắt buộc rows — order filters, late warnings (haversine ETA), Excel/PDF export, check-in map history, dispatcher drag-and-drop if still required
- Phase 3: Pilot ops — real SME, PIN-per-driver, cheap VPS or Cloudflare Tunnel documented
- Phase 4: Paid maps only if revenue — distance-matrix behind an interface; default remains haversine × 1.35

## People split (locked)

| Person | Owner of | Worktree |
|--------|----------|----------|
| Nguyễn Quang Chiến | `apps/api/**`, `openapi.json`, seed, solver, CO₂, Jinja dispatcher, root README demo script | WT-01 `../repo-cr001-api` `cr/001-api` |
| Phạm Quốc Thanh | `apps/mobile-driver/**` only | WT-02 `../repo-cr001-flutter` `cr/001-flutter` |
