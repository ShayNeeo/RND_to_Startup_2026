---
phase: 01-mvp-72h-walking-skeleton
plan: 03
subsystem: api
tags: [fastapi, sqlite, carbon, flutter, image_picker, report, openapi]

requires:
  - phase: 01-mvp-72h-walking-skeleton
    provides: Stored baseline/optimized totals on POST /optimize, frozen PATCH/DELETE /orders/{id} and POST /stops/{id}/photo, Flutter StopDetailScreen (01-01/01-02)
provides:
  - GET /report before/after km, litres, kg CO2 and percent deltas from stored totals
  - Dispatcher TTW strip plus PATCH/DELETE order controls (409 after publish)
  - POST /stops/{id}/photo uuid jpg/png under data/uploads
  - Optional image_picker POD; picker null still POSTs delivered
  - Root README 72h jury script; cold start GREENLOGIX_DEMO=1 only
affects: [verify-work, contest-demo, flutter-driver, dispatcher-api]

tech-stack:
  added:
    - image_picker 1.2.3
  patterns:
    - Report delta is optimized minus baseline (negative km when the plan is shorter)
    - Same HCMC_CIRCUITY 1.35 and emission_factors.json on both sides
    - POD photo is best-effort; status writeback does not depend on camera

key-files:
  created:
    - apps/api/tests/test_report.py
    - apps/api/tests/test_orders_crud.py
    - apps/mobile-driver/test/photo_null_test.dart
  modified:
    - apps/api/src/greenlogix_api/routers/report.py
    - apps/api/src/greenlogix_api/routers/orders.py
    - apps/api/src/greenlogix_api/routers/driver.py
    - apps/api/src/greenlogix_api/carbon.py
    - apps/api/templates/dispatcher.html
    - apps/api/openapi.json
    - README.md
    - apps/api/README.md
    - apps/mobile-driver/lib/screens/stop_detail.dart
    - apps/mobile-driver/lib/api/client.dart
    - apps/mobile-driver/pubspec.yaml
    - apps/mobile-driver/README.md

key-decisions:
  - "GET /report delta.km = optimized.km - baseline.km (negative when shorter); km_pct from totals, not marketing 8/15/5/10/12"
  - "PATCH/DELETE on an order assigned to a published route is 409 so the live list is not silently mutated"
  - "POD photo: uuid4 filename, jpg/png MIME + magic bytes, ignore client path, 5MB cap, unpublished 404"
  - "Cold start documents only GREENLOGIX_DEMO=1 and optional TZ; Nominatim is not on the jury path"

patterns-established:
  - "Pattern 9: ReportOut.delta is computed from last_report.json totals; dispatcher strip is a consumer of GET /report"
  - "Pattern 10: Photo upload field name is photo; status endpoints stay independent (D-20)"

requirements-completed: [ORD-03, DRV-04, RPT-02, COST-01, COST-02]

coverage:
  - id: D1
    description: GET /report delta.km equals optimized.km minus baseline.km and is negative on a zig-zag set; percents are not marketing constants
    requirement: RPT-02
    verification:
      - kind: unit
        ref: apps/api/tests/test_report.py#test_report_delta_is_optimized_minus_baseline_and_negative
        status: pass
    human_judgment: false
  - id: D2
    description: Dispatcher HTML shows ước tính TTW CO₂ (IPCC/GLEC factors) and PATCH/DELETE controls
    requirement: RPT-02
    verification:
      - kind: unit
        ref: apps/api/tests/test_report.py#test_dispatcher_has_ttw_strip_and_order_edit_delete
        status: pass
    human_judgment: false
  - id: D3
    description: PATCH kg then GET; DELETE then GET 404; assigned published order PATCH/DELETE 409
    requirement: ORD-03
    verification:
      - kind: unit
        ref: apps/api/tests/test_orders_crud.py#test_patch_then_get_updates_kg
        status: pass
      - kind: unit
        ref: apps/api/tests/test_orders_crud.py#test_delete_then_get_404
        status: pass
      - kind: unit
        ref: apps/api/tests/test_orders_crud.py#test_patch_and_delete_assigned_published_order_409
        status: pass
    human_judgment: false
  - id: D4
    description: POD photo stores uuid under uploads; unpublished 404; non-image 400
    requirement: DRV-04
    verification:
      - kind: unit
        ref: apps/api/tests/test_orders_crud.py#test_photo_stores_uuid_under_uploads
        status: pass
      - kind: unit
        ref: apps/api/tests/test_orders_crud.py#test_photo_unpublished_404
        status: pass
      - kind: unit
        ref: apps/api/tests/test_orders_crud.py#test_photo_rejects_non_image
        status: pass
    human_judgment: false
  - id: D5
    description: ImagePicker null still POSTs delivered with no multipart photo
    requirement: DRV-04
    verification:
      - kind: unit
        ref: apps/mobile-driver/test/photo_null_test.dart#picker null still posts delivered without photo
        status: pass
    human_judgment: false
  - id: D6
    description: Root README 72h jury script has seed, HCMC_CIRCUITY, dispatcher, PIN 0000, 0.0.0.0, 10.0.2.2, seed xlsx
    requirement: COST-02
    verification:
      - kind: other
        ref: grep greenlogix_api.seed HCMC_CIRCUITY 0.0.0.0 0000 dispatcher 10.0.2.2 apps/api/data/seed/hcmc_80_orders.xlsx README.md
        status: pass
    human_judgment: false
  - id: D7
    description: Tracked env examples contain no commercial geospatial key names; gitignore db + uploads
    requirement: COST-01
    verification:
      - kind: other
        ref: cost-freeze python scan of tracked env/README samples
        status: pass
    human_judgment: false

duration: 13min
completed: 2026-09-02
status: complete
---

# Phase 1 Plan 03: Before/after CO₂ + jury README + optional photo Summary

**GET /report and the dispatcher TTW strip compute baseline vs optimized km/litres/kg CO₂ from HCMC_CIRCUITY 1.35 and emission_factors.json; dispatcher can PATCH/DELETE orders before optimize (409 after publish); optional uuid POD photos; 72h jury README cold-starts with GREENLOGIX_DEMO=1 only.**

## Performance

- **Duration:** 13 min
- **Started:** 2026-09-02T10:50:54Z
- **Completed:** 2026-09-02T11:03:43Z
- **Tasks:** 3
- **Files modified:** 20

## Accomplishments

- GET /report returns `baseline`, `optimized`, `delta` with `km_pct` computed as `(optimized - baseline) / baseline * 100` — not BRAINSTORM marketing ranges.
- Dispatcher strip labeled `ước tính TTW CO₂ (IPCC/GLEC factors)` plus per-order PATCH/DELETE forms.
- POST `/stops/{id}/photo` multipart field `photo` writes `data/uploads/{uuid}.jpg|.png`; unpublished stops 404; status remains independent.
- Flutter `image_picker` on Đã giao; null/exception still POSTs delivered.
- Root README 72h contest demo: `uv python pin 3.12 && uv sync`, seed, uvicorn `0.0.0.0`, dispatcher, Flutter `10.0.2.2` / linux / LAN, PIN `0000`, Chỉ đường, Đã giao, `/report`.

## Task Commits

Each task was committed atomically:

1. **Task 1 RED:** `1a92b41` test(01-03): add failing tests for report deltas and order CRUD
2. **Task 1 GREEN:** `f98fc30` feat(01-03): compute before/after report, 409 CRUD, local POD photo
3. **Task 2:** `b1c5235` docs(01-03): add 72h contest demo script and cost freeze
4. **Task 3 RED:** `3b58501` test(01-03): add failing test for picker-null delivered
5. **Task 3 GREEN:** `2640ad7` feat(01-03): optional image_picker POD; status still posts

**Plan metadata:** skipped (commit_docs disabled)

## Files Created/Modified

- `apps/api/src/greenlogix_api/routers/report.py` — recomputes km_pct from stored totals
- `apps/api/src/greenlogix_api/carbon.py` — delta = optimized − baseline
- `apps/api/src/greenlogix_api/routers/orders.py` — GET/PATCH/DELETE; 409 if published assignment
- `apps/api/src/greenlogix_api/routers/driver.py` — local uuid photo write
- `apps/api/templates/dispatcher.html` — TTW strip + edit/delete
- `apps/api/openapi.json` — photo field name `photo`; GET `/orders/{id}`
- `apps/api/tests/test_report.py` / `test_orders_crud.py` — RPT-02 / ORD-03 / DRV-04
- `README.md` / `apps/api/README.md` — 72h jury path
- `apps/mobile-driver/lib/screens/stop_detail.dart` — ImagePicker best-effort
- `apps/mobile-driver/lib/api/client.dart` — multipart `photo`
- `apps/mobile-driver/test/photo_null_test.dart` — picker-null still delivered

## Decisions Made

- Delta sign follows the plan (`optimized - baseline`, negative when shorter) rather than positive “savings”.
- GET `/orders/{id}` added so DELETE then GET is 404 (the path previously 405’d).
- Photo filenames never use the client path; suffix comes from MIME + magic bytes.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] JSON float identity on litres/CO₂**
- **Found during:** Task 1 GREEN
- **Issue:** `opt["litres"] == opt["km"] * 10 / 100` failed on IEEE rounding after JSON round-trip
- **Fix:** `pytest.approx` on the factor invariants; delta.km equality stayed exact
- **Files modified:** `apps/api/tests/test_report.py`
- **Commit:** `f98fc30`

**2. [Rule 2 - Missing Critical] GET /orders/{id}**
- **Found during:** Task 1 RED (`DELETE then GET 404` returned 405)
- **Issue:** PATCH/DELETE occupied `/orders/{id}` with no GET
- **Fix:** GET returns `OrderOut` or 404
- **Files modified:** `apps/api/src/greenlogix_api/routers/orders.py`, `apps/api/openapi.json`
- **Commit:** `f98fc30`

**3. [Rule 2 - Missing Critical] Photo size + magic-byte check**
- **Found during:** Task 1 (ASVS V12 / T-01-03-01)
- **Issue:** Plan required MIME/suffix whitelist; a size cap was needed to avoid disk fill
- **Fix:** 5MB cap, JPEG/PNG magic bytes must match `image/jpeg` or `image/png`
- **Files modified:** `apps/api/src/greenlogix_api/routers/driver.py`
- **Commit:** `f98fc30`

---

**Total deviations:** 3 auto-fixed (1 bug, 2 missing critical)
**Impact on plan:** Required for the stated tests and upload safety. No scope creep.

## Issues Encountered

None beyond the float-approx and GET 405 items above.

## Auth Gates

None.

## Threat Flags

| Flag | File | Description |
|------|------|-------------|
| threat_flag: new_endpoint | apps/api/src/greenlogix_api/routers/orders.py | GET `/orders/{id}` (Bearer DEMO, same boundary as GET `/orders`) |

## User Setup Required

None - no external service configuration required. Jury path is localhost `GREENLOGIX_DEMO=1`.

## Next Phase Readiness

- Contest loop is closed: seed → optimize → map → Flutter list → Chỉ đường → delivered → computed report.
- Leftover (intentional cuts): Nominatim still unwired; Cloudflare Tunnel not documented; `packages/shared-types` TS SDK not added.
- WINDOWS.md stub #3 (photo 503) marked fixed. Open leftover: httpx2 dev-only (#1).

## TDD Gate Compliance

- Task 1: RED `1a92b41` then GREEN `f98fc30`
- Task 3: RED `3b58501` then GREEN `2640ad7`

---
*Phase: 01-mvp-72h-walking-skeleton*
*Completed: 2026-09-02*

## Self-Check: PASSED

- FOUND: apps/api/src/greenlogix_api/routers/report.py
- FOUND: README.md
- FOUND: apps/api/data/emission_factors.json
- FOUND: apps/api/src/greenlogix_api/routers/orders.py
- FOUND: apps/mobile-driver/lib/screens/stop_detail.dart
- FOUND: 1a92b41, f98fc30, b1c5235, 3b58501, 2640ad7
