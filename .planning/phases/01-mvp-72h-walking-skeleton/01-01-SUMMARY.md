---
phase: 01-mvp-72h-walking-skeleton
plan: 01
subsystem: api
tags: [fastapi, sqlite, vrp, leaflet, osm, flutter, openpyxl, carbon]

requires:
  - phase: 01-mvp-72h-walking-skeleton
    provides: Frozen OpenAPI + FastAPI demo auth + Flutter PIN client (01-00)
provides:
  - 80/10 HCMC seed xlsx and `python -m greenlogix_api.seed`
  - Haversine × HCMC_CIRCUITY 1.35 cluster + NN + 2-opt + D-17 baseline
  - Jinja Leaflet OSM dispatcher (Seed / Optimize / Publish / xlsx upload)
  - Flutter RouteListScreen for published stops after PIN 0000
  - TTW CO₂ from in-repo emission_factors.json (petrol 2.31, diesel 2.68)
affects: [01-02, 01-03, flutter-driver, dispatcher-api]

tech-stack:
  added: []
  patterns:
    - Distances are haversine × named HCMC_CIRCUITY on both baseline and optimized
    - Publish flag gates GET /driver/route (unpublished drafts hidden)
    - OSM tiles via Leaflet 1.9.4 CDN; no Mapbox

key-files:
  created:
    - apps/api/data/emission_factors.json
    - apps/api/data/seed/hcmc_80_orders.xlsx
    - apps/api/data/seed/hcmc_10_trucks.xlsx
    - apps/api/src/greenlogix_api/solver/distance.py
    - apps/api/templates/dispatcher.html
    - apps/mobile-driver/lib/screens/route_list.dart
  modified:
    - apps/api/src/greenlogix_api/main.py
    - apps/api/src/greenlogix_api/models.py
    - apps/api/src/greenlogix_api/routers/optimize.py
    - apps/api/src/greenlogix_api/routers/driver.py
    - apps/mobile-driver/lib/screens/pin_screen.dart

key-decisions:
  - "Stop.route_id FK column added on the existing stops table (not a new table)"
  - "Baseline/optimized totals persisted to data/last_report.json (gitignored) so GET /report is not hardcoded later"
  - "Greedy cluster radius uses haversine_km on lat/lng; road_km (×1.35) is for sequencing and CO₂ only"
  - "API + Flutter implemented in this executor worktree; isolation branches WT-01/WT-02 still exist from 01-00"

patterns-established:
  - "Pattern 4: GET /driver/route returns published routes only, grouped by plate"
  - "Pattern 5: Dispatcher is Jinja + Leaflet OSM CDN, same origin as FastAPI"
  - "Pattern 6: Ingest maps bilingual headers; missing lat/lng become ImportResult.errors"

requirements-completed: [ORD-01, ORD-02, VEH-01, VEH-02, VRP-01, VRP-02, VRP-03, VRP-04, DSP-01, DSP-02, DRV-01, RPT-01]

coverage:
  - id: D1
    description: Seed CLI loads 80 inner-HCMC orders and 10 trucks (one maintenance)
    requirement: ORD-02
    verification:
      - kind: unit
        ref: apps/api/tests/test_tracer_e2e.py#test_seed_optimize_publish_driver_and_osm_dispatcher
        status: pass
      - kind: other
        ref: GREENLOGIX_DEMO=1 uv run python -m greenlogix_api.seed
        status: pass
    human_judgment: false
  - id: D2
    description: road_km = haversine × HCMC_CIRCUITY 1.35
    requirement: VRP-03
    verification:
      - kind: unit
        ref: apps/api/tests/test_distance.py
        status: pass
    human_judgment: false
  - id: D3
    description: Maintenance unused; overload flagged; depot-stop-depot; zig-zag baseline km differs
    requirement: VRP-02
    verification:
      - kind: unit
        ref: apps/api/tests/test_solver.py
        status: pass
      - kind: unit
        ref: apps/api/tests/test_baseline.py
        status: pass
    human_judgment: false
  - id: D4
    description: Diesel 100 km at 12 L/100km → 12 L and 12×2.68 kg CO₂
    requirement: RPT-01
    verification:
      - kind: unit
        ref: apps/api/tests/test_carbon.py#test_diesel_100km_12l
        status: pass
    human_judgment: false
  - id: D5
    description: Dispatcher HTML uses HTTPS OSM tiles and OpenStreetMap attribution
    requirement: DSP-02
    verification:
      - kind: e2e
        ref: apps/api/tests/test_tracer_e2e.py GET /dispatcher
        status: pass
    human_judgment: false
  - id: D6
    description: After publish, GET /driver/route with PIN 0000 returns nonempty stops
    requirement: DRV-01
    verification:
      - kind: e2e
        ref: apps/api/tests/test_tracer_e2e.py
        status: pass
    human_judgment: false
  - id: D7
    description: Flutter RouteListScreen sorts by seq and shows Vietnamese empty state
    requirement: DRV-01
    verification:
      - kind: unit
        ref: apps/mobile-driver/test/route_list_test.dart
        status: pass
    human_judgment: false
  - id: D8
    description: xlsx ingest bilingual headers, missing-lat errors, 5MB/500-row caps; vehicles GET/PATCH
    requirement: ORD-01
    verification:
      - kind: unit
        ref: apps/api/tests/test_ingest.py
        status: pass
    human_judgment: false

duration: 17min
completed: 2026-09-02
status: complete
---

# Phase 1 Plan 01: Excel → OSM map → Flutter list Summary

**Heuristic VRP (haversine × 1.35, cluster + NN + 2-opt) with Jinja Leaflet OSM dispatcher, TTW CO₂ from in-repo factors, and Flutter PIN 0000 ordered stop list**

## Performance

- **Duration:** 17 min
- **Started:** 2026-09-02T10:16:30Z
- **Completed:** 2026-09-02T10:33:19Z
- **Tasks:** 3
- **Files modified:** 34

## Accomplishments

- One command `GREENLOGIX_DEMO=1 uv run python -m greenlogix_api.seed` loads 80 zig-zag inner-HCMC orders and 10 trucks (nine ready, one maintenance). Depot Tân Bình DC `10.801, 106.661`.
- `POST /optimize` clusters (default 3 km), sequences NN+2-opt, flags overload, persists `Route`/`Stop` with depot ends, and returns km / litres / kg_co2 on the dispatcher totals strip.
- `GET /dispatcher` is Jinja + Leaflet 1.9.4 + `https://tile.openstreetmap.org/{z}/{x}/{y}.png`. Publish then `GET /driver/route` (PIN 0000) returns published stops only.
- Flutter `RouteListScreen` lists seq-ordered address, phone, window, notes; empty published set is `Chưa có tuyến đã xuất bản`. PIN 401 stays on `PinScreen`.
- Excel ingest accepts bilingual headers, normalizes time cells to `HH:MM`, and rejects non-xlsx / >5 MB / >500 rows.

## Task Commits

Each task was committed atomically (TDD tasks have RED then GREEN):

1. **Task 1: End-to-end seed → optimize → Leaflet OSM → publish → GET /driver/route** - `5ae8da9` (feat)
2. **Task 2 RED: Flutter ordered route list tests** - `c413b55` (test)
3. **Task 2 GREEN: PIN 0000 → RouteListScreen** - `1e8ee1b` (feat)
4. **Task 3 RED: xlsx ingest and vehicles tests** - `2303d29` (test)
5. **Task 3 GREEN: ingest + vehicle registry + dispatcher upload** - `d680388` (feat)

**Plan metadata:** skipped (commit_docs disabled)

## Files Created/Modified

- `apps/api/data/emission_factors.json` — TTW petrol 2.31 / diesel 2.68, `tank_to_wheel`
- `apps/api/data/seed/hcmc_80_orders.xlsx` / `hcmc_10_trucks.xlsx` — contest seed
- `apps/api/src/greenlogix_api/solver/distance.py` — `HCMC_CIRCUITY = 1.35`
- `apps/api/src/greenlogix_api/solver/{cluster,nn_two_opt,baseline}.py` — VRP-01..04, D-17
- `apps/api/src/greenlogix_api/carbon.py` / `seed.py` / `ingest_xlsx.py`
- `apps/api/templates/dispatcher.html` — Seed, Optimize, Publish, xlsx file input, OSM map
- `apps/mobile-driver/lib/screens/route_list.dart` — ordered stop list
- `apps/mobile-driver/lib/screens/pin_screen.dart` — navigate on 200, error on 401
- Tests: `test_{distance,solver,carbon,baseline,tracer_e2e,ingest}.py`, `route_list_test.dart`

## Decisions Made

- Added `Stop.route_id` on the existing table rather than a new join table.
- Stored baseline vs optimized totals in gitignored `data/last_report.json` so 01-03 does not invent percents.
- Cluster radius is geographic haversine; circuity applies to tour km and CO₂ only (fair vs baseline).
- Implemented API + Flutter in this worktree per orchestrator instruction (WT-01/WT-02 branches remain from 01-00).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Stop.route_id FK**
- **Found during:** Task 1
- **Issue:** 01-00 `Stop` had no `route_id`; publish/driver grouping cannot join otherwise.
- **Fix:** Added nullable indexed `route_id` FK plus SQLite `ALTER` if the old file lacked the column.
- **Files modified:** `apps/api/src/greenlogix_api/models.py`, `db.py`
- **Committed in:** `5ae8da9`

**2. [Rule 2 - Missing Critical] Persist baseline totals**
- **Found during:** Task 1
- **Issue:** Plan requires storing D-17 totals so RPT-02 is not hardcoded later.
- **Fix:** `save_report` / `load_report` JSON; `GET /report` reads it after optimize.
- **Files modified:** `apps/api/src/greenlogix_api/carbon.py`, `routers/report.py`
- **Committed in:** `5ae8da9`

**3. [Rule 2 - Missing Critical] PATCH/DELETE `/orders/{id}` while filling orders router**
- **Found during:** Task 3
- **Issue:** GET `/orders` needed a session; leaving PATCH/DELETE as 503 would strand ORD-03 API.
- **Fix:** Wired SQLModel get/update/delete. Dispatcher HTML edit forms still 01-03.
- **Files modified:** `apps/api/src/greenlogix_api/routers/orders.py`
- **Committed in:** `d680388`

---

**Total deviations:** 3 auto-fixed (Rule 2)
**Impact on plan:** Required for VRP persist, report honesty, and ingest/vehicle loop. No paid APIs, no Next.js, no landing edits.

## Issues Encountered

- Flutter `find.text(phone)` failed while phone lived inside a combined subtitle `Text`; split into per-field widgets (Rule 1, folded into Task 2 GREEN).
- `from greenlogix_api.db import engine` would pin the pre-fixture engine; tests/seed use `dbmod.engine` after `set_engine`.

## Auth Gates

None. `GREENLOGIX_DEMO=1` already in 01-00.

## Known Stubs

| File | Line | Stub | Reason |
|------|------|------|--------|
| `apps/api/src/greenlogix_api/routers/driver.py` | 49 | `POST /stops/{id}/status` → 503 | 01-02 writeback (DRV-03) |
| `apps/api/src/greenlogix_api/routers/driver.py` | 59 | `POST /stops/{id}/photo` → 503 | Optional POD (DRV-04), 01-02/01-03 |

These do not block 01-01 (seed → map → published Flutter list). Chỉ đường deep-link is 01-02, not stubbed as a fake button.

## TDD Gate Compliance

Plan `type: execute` (not `type: tdd`). Tasks 2 and 3 had `tdd="true"`: RED commits `c413b55` / `2303d29` then GREEN `1e8ee1b` / `d680388`. Global `tdd_mode` was false so the MVP+TDD halt gate did not apply.

## User Setup Required

None - no external service configuration required. Demo: `GREENLOGIX_DEMO=1`, Bearer `DEMO`, PIN `0000`.

## Next Phase Readiness

- 01-02 can wire Chỉ đường (`url_launcher`) and status writeback on existing `Stop.id`.
- 01-03 can render `GET /report` HTML from stored baseline/optimized totals (do not hardcode −8–15%).
- Frozen OpenAPI paths unchanged; additive DB column `stops.route_id` only.

## Leftover gaps

- Flutter Maps deep-link and status buttons (01-02).
- Dispatcher HTML order edit/delete forms (ORD-03 UI; API PATCH/DELETE exist).
- Jury README script (COST-02, 01-03).
- Isolation branches `cr/001-api` / `cr/001-flutter` were not fast-forwarded from this worktree (commits landed on `feature/landing-qa-72h`).

---
*Phase: 01-mvp-72h-walking-skeleton*
*Completed: 2026-09-02*

## Self-Check: PASSED
