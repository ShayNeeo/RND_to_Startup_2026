---
phase: 01-mvp-72h-walking-skeleton
plan: 02
subsystem: driver
tags: [fastapi, flutter, url_launcher, maps, geo, sqlite, dispatcher]

requires:
  - phase: 01-mvp-72h-walking-skeleton
    provides: Published routes in SQLite, frozen POST /stops/{id}/status, Flutter PIN + route list (01-01)
provides:
  - POST /stops/{id}/status persists arrived/delivered/failed on published stops only
  - Dispatcher Refresh re-fetches GET /routes and paints per-stop status
  - openChiDuong Google Maps dir → Apple Maps daddr → geo: via url_launcher (no SDK key)
  - Debug-only Android cleartext HTTP for emulator 10.0.2.2
affects: [01-03, flutter-driver, dispatcher-api]

tech-stack:
  added: []
  patterns:
    - Maps deep-link is url_launcher LaunchMode.externalApplication; never a billed Maps SDK
    - StatusIn enums arrived|delivered|failed; failed requires khach_vang|sai_dia_chi|hang_hong|tu_choi
    - Unpublished routes 404 on driver status POST; PIN must not mutate drafts

key-files:
  created:
    - apps/mobile-driver/lib/api/maps_link.dart
    - apps/mobile-driver/lib/screens/stop_detail.dart
    - apps/mobile-driver/android/app/src/debug/res/xml/network_security_config.xml
    - apps/api/tests/test_status.py
    - apps/mobile-driver/test/maps_link_test.dart
    - apps/mobile-driver/test/status_test.dart
  modified:
    - apps/api/src/greenlogix_api/routers/driver.py
    - apps/api/src/greenlogix_api/schemas.py
    - apps/api/templates/dispatcher.html
    - apps/api/openapi.json
    - apps/mobile-driver/lib/api/client.dart
    - apps/mobile-driver/lib/screens/route_list.dart
    - apps/mobile-driver/lib/screens/pin_screen.dart
    - apps/mobile-driver/android/app/src/debug/AndroidManifest.xml
    - apps/mobile-driver/ios/Runner/Info.plist

key-decisions:
  - "Maps URI query is lat,lng and address label only; phone is never appended (T-01-02-01)"
  - "StatusIn enums dumped additively into openapi.json; failed without reason is 422"
  - "Debug-only Android network_security_config cleartext; no iOS NSAllowsArbitraryLoads (no Runner debug entitlements file)"
  - "OS Maps on-device intent is user_setup; unit tests prove URL construction when no AVD is listed"

patterns-established:
  - "Pattern 7: Driver writeback requires require_driver + Route.published, else 404"
  - "Pattern 8: Chỉ đường tries Google then Apple then geo: with LaunchMode.externalApplication"

requirements-completed: [DRV-02, DRV-03, DSP-01]

coverage:
  - id: D1
    description: POST /stops/{id}/status arrived on a published stop persists and GET /routes returns arrived
    requirement: DRV-03
    verification:
      - kind: unit
        ref: apps/api/tests/test_status.py#test_post_arrived_on_published_stop_then_routes_show_status
        status: pass
    human_judgment: false
  - id: D2
    description: failed without reason is 422; khach_vang stores fail_reason
    requirement: DRV-03
    verification:
      - kind: unit
        ref: apps/api/tests/test_status.py#test_failed_without_reason_returns_422
        status: pass
      - kind: unit
        ref: apps/api/tests/test_status.py#test_failed_with_reason_stores_fail_reason
        status: pass
    human_judgment: false
  - id: D3
    description: Unpublished route stops cannot be updated (404)
    requirement: DSP-01
    verification:
      - kind: unit
        ref: apps/api/tests/test_status.py#test_unpublished_stop_status_returns_404
        status: pass
    human_judgment: false
  - id: D4
    description: Dispatcher HTML Refresh re-fetches GET /routes and lists stop status
    requirement: DSP-01
    verification:
      - kind: unit
        ref: apps/api/tests/test_status.py#test_dispatcher_html_has_refresh_and_stop_status
        status: pass
    human_judgment: false
  - id: D5
    description: openChiDuong builds Google maps/dir, Apple daddr, then geo: for (10.776, 106.700, Q1)
    requirement: DRV-02
    verification:
      - kind: unit
        ref: apps/mobile-driver/test/maps_link_test.dart#chiDuongUris is Google dir, then Apple daddr, then geo for Q1
        status: pass
    human_judgment: false
  - id: D6
    description: ApiClient.postStatus sends StatusIn JSON with X-Driver-Pin; no photo field
    requirement: DRV-03
    verification:
      - kind: unit
        ref: apps/mobile-driver/test/status_test.dart#postStatus POSTs StatusIn JSON to /stops/{id}/status with PIN
        status: pass
    human_judgment: false
  - id: D7
    description: Tapping Chỉ đường on a real Android/iOS device opens an OS Maps app
    requirement: DRV-02
    verification: []
    human_judgment: true
    rationale: "Linux desktop cannot prove the OS Maps intent. flutter devices listed only Linux; no AVD. Unit tests cover URI construction."

duration: 9min
completed: 2026-09-02
status: complete
---

# Phase 1 Plan 02: Chỉ đường + status writeback Summary

**OS Maps deep-link (Google dir → Apple daddr → geo:) plus PIN-gated arrived/delivered/failed writeback visible on dispatcher Refresh, with zero billed Maps SDK keys**

## Performance

- **Duration:** 9 min
- **Started:** 2026-09-02T10:38:01Z
- **Completed:** 2026-09-02T10:47:10Z
- **Tasks:** 3 (6 TDD commits: RED+GREEN each)
- **Files modified:** 17

## Accomplishments

- `POST /stops/{id}/status` with `X-Driver-Pin: 0000` persists `arrived` / `delivered` / `failed`; `failed` requires a reason enum; unpublished routes 404; delivered/failed copy onto `Order.status` when `kind` is stop.
- Dispatcher **Refresh** calls `GET /routes` and lists each stop address with its status next to the Leaflet map. Publish from 01-01 is unchanged.
- Flutter `Chỉ đường` launches Google Maps dir, then Apple Maps, then `geo:` via `url_launcher` `LaunchMode.externalApplication`. URI query is lat,lng + address label only (no phone).
- Debug Android `network_security_config.xml` permits cleartext to `10.0.2.2`; debug manifest `queries` for geo/https/http/google.navigation; iOS `LSApplicationQueriesSchemes` = comgooglemaps, maps.

## Task Commits

Each task was committed atomically (TDD RED then GREEN):

1. **Task 1: Persist stop status** — `c4dd912` (test) → `97383ef` (feat)
2. **Task 2: Chỉ đường via url_launcher** — `cb151ce` (test) → `01bef67` (feat)
3. **Task 3: Status buttons writeback** — `fd3e380` (test) → `f140f4e` (feat)

**Plan metadata:** skipped (commit_docs disabled)

## Files Created/Modified

- `apps/api/src/greenlogix_api/routers/driver.py` — implements POST status; photo stays 503
- `apps/api/src/greenlogix_api/schemas.py` — StatusIn enums + failed-requires-reason validator
- `apps/api/templates/dispatcher.html` — Refresh + per-stop status list
- `apps/api/openapi.json` — additive StatusIn enums
- `apps/api/tests/test_status.py` — arrived, 422, fail_reason, unpublished 404, dispatcher Refresh
- `apps/mobile-driver/lib/api/maps_link.dart` — chiDuongUris + openChiDuong
- `apps/mobile-driver/lib/screens/stop_detail.dart` — Chỉ đường, Đã đến, Đã giao, Thất bại + reason picker
- `apps/mobile-driver/lib/api/client.dart` — postStatus
- `apps/mobile-driver/lib/screens/route_list.dart` — tap opens detail; local status refresh
- `apps/mobile-driver/lib/screens/pin_screen.dart` — passes ApiClient into the list
- `apps/mobile-driver/android/app/src/debug/res/xml/network_security_config.xml` — debug cleartext
- `apps/mobile-driver/android/app/src/debug/AndroidManifest.xml` — networkSecurityConfig + queries
- `apps/mobile-driver/ios/Runner/Info.plist` — LSApplicationQueriesSchemes
- `apps/mobile-driver/README.md` — emulator 10.0.2.2, LAN IP, Linux cannot prove OS Maps

## Decisions Made

- Maps URIs never include phone (T-01-02-01).
- OpenAPI StatusIn tightened with enums (additive D-15 dump).
- iOS NSAllowsArbitraryLoads not set: no Runner debug entitlements file; cleartext is Android-debug only.
- No `maps_launcher` / `image_picker` (D-08, D-20). Photo remains 01-03.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] StatusIn validation lives in schemas.py**
- **Found during:** Task 1
- **Issue:** Plan listed `models.py` (columns already existed). Enum + failed-requires-reason had to sit on Pydantic `StatusIn` so 422 is automatic.
- **Fix:** `Literal` enums + `model_validator`; additive openapi dump.
- **Files modified:** `apps/api/src/greenlogix_api/schemas.py`, `apps/api/openapi.json`
- **Verification:** `uv run pytest -x tests/test_status.py` 5 passed
- **Committed in:** `97383ef`

**2. [Rule 2 - Missing Critical] PinScreen passes ApiClient into RouteListScreen**
- **Found during:** Task 3
- **Issue:** `pin_screen.dart` was not in the task `<files>` list; without it `postStatus` has no PIN client.
- **Fix:** `RouteListScreen(routes: routes, client: client)`.
- **Files modified:** `apps/mobile-driver/lib/screens/pin_screen.dart`
- **Verification:** `flutter test test/status_test.dart` passed
- **Committed in:** `f140f4e`

---

**Total deviations:** 2 auto-fixed (Rule 2)
**Impact on plan:** Required for 422 validation and live writeback. No paid APIs, no landing/portal edits, no photo upload.

## Issues Encountered

- `flutter devices` listed only Linux desktop. No AVD (`emulator -list-avds` empty). Plan said not to block; URI unit tests landed.
- WINDOWS ledger stub #2 (`POST /stops/{id}/status` 503) marked fixed. Photo 503 remains #3 for 01-03.

## Auth Gates

None. `GREENLOGIX_DEMO=1`, Bearer `DEMO`, PIN `0000`.

## Known Stubs

| File | Line | Stub | Reason |
|------|------|------|--------|
| `apps/api/src/greenlogix_api/routers/driver.py` | 76 | `POST /stops/{id}/photo` → 503 | Optional POD (DRV-04), plan 01-03. Status works with no photo (D-20). |

This does not block 01-02 (status is mandatory, photo is not).

## TDD Gate Compliance

Plan `type: execute` (not `type: tdd`). All three tasks had `tdd="true"`:

| Task | RED | GREEN |
|------|-----|-------|
| 1 | `c4dd912` | `97383ef` |
| 2 | `cb151ce` | `01bef67` |
| 3 | `fd3e380` | `f140f4e` |

Global `tdd_mode` was false so the MVP+TDD halt gate did not apply. Sequence still followed.

## User Setup Required

**Android emulator or phone is not available on this executor host.** See plan `user_setup.android-avd-or-phone`:

1. Start an AVD or plug a phone (`flutter devices` must list android).
2. API: `GREENLOGIX_DEMO=1 uv run uvicorn greenlogix_api.main:app --host 0.0.0.0 --port 8000`
3. App: `flutter run --dart-define=API_BASE=http://10.0.2.2:8000` (emulator) or LAN IP (phone).
4. Tap Chỉ đường — expect Google Maps / Apple Maps / geo: to open with the stop lat,lng.

Linux desktop can list stops and mark status against localhost; it cannot prove the OS Maps intent.

## Next Phase Readiness

- 01-03 can add optional photo (`POST /stops/{id}/photo`) and `GET /report` HTML from stored baseline/optimized totals.
- Publish remains the only way a draft appears in `GET /driver/route`.
- No Maps SDK keys were added.

## Leftover gaps

- Human AVD/phone tap of Chỉ đường (coverage D7).
- Optional POD photo (01-03).
- Isolation branches `cr/001-api` / `cr/001-flutter` were not fast-forwarded; commits landed on `feature/landing-qa-72h`.

## Test results

- `cd apps/api && uv run pytest -x tests/test_status.py` — 5 passed
- `cd apps/api && uv run pytest -x tests/test_tracer_e2e.py` — 1 passed (publish still gates driver route)
- `cd apps/mobile-driver && flutter test` — 8 passed (maps_link, status, route_list, widget, api_client)

---
*Phase: 01-mvp-72h-walking-skeleton*
*Completed: 2026-09-02*

## Self-Check: PASSED
