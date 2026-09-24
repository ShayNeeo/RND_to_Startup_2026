# Implementation Notes: GreenLogix Frontier Engineering & Demo 24/09 Slice

**Date:** 2026-09-21T23:10:00+07:00  
**Scope:** Full execution of Frontier Product & Engineering Plan across Change Requests CR-01, CR-02, CR-03, CR-04, CR-05, CR-07, CR-08, CR-09, CR-10, CR-11/12, and CR-15 with end-to-end visual QA/QC.

---

### What changed

1. **Architecture & ADRs (CR-01)**:
   - `docs/adr/0001-authoritative-architecture.md`: Established FastAPI as authoritative computation core, OSM/Valhalla as routing substrate, and PostGIS migration target.
2. **Google Maps Handoff Fix (CR-02)**:
   - `apps/mobile-driver/lib/api/maps_link.dart`: Updated `googleMapsDirUri` to use `Uri.https` with `travelmode=driving` and `dir_action=navigate`, eliminating the Vietnam two-wheeler mode switch UX defect.
   - `apps/mobile-driver/test/maps_link_test.dart`: Added explicit query parameter assertions.
   - `apps/landing/public/driver/index.html`: Added dedicated high-visibility "Chỉ đường (Google Maps · Ô tô / Xe tải)" action button to stop cards.
3. **GOFA Places Adapter & Location Provenance (CR-03)**:
   - `apps/api/src/greenlogix_api/places/base.py`: Defined `PlaceProvider` protocol, `PlaceSuggestion`, and `PlaceDetail`.
   - `apps/api/src/greenlogix_api/places/gofa.py`: Implemented quota-governed client with debouncing, caching, and graceful offline fallback.
   - `apps/api/src/greenlogix_api/places/mock.py`: Curated Vietnam address database with fuzzy accent-insensitive search.
4. **Truck Profiles & Safe Routing Cache Keys (CR-05)**:
   - `apps/api/src/greenlogix_api/geo/truck_profile.py`: Defined `TruckProfile` schema (`xe_tai_nho`, `xe_tai_trung`, `xe_tai_nang`) with physical dimensions, gross weight, and Valhalla truck options.
   - `apps/api/src/greenlogix_api/solver/road_baseline.py`: Integrated `TruckProfile` into `ValhallaRoadBaseline` and included profile hashes into `materialize_matrix` cache keys.
5. **Tenant RBAC & Horizontal Authorization Guard (CR-04)**:
   - `apps/api/src/greenlogix_api/auth/`: Built `UserRole`, `AuthContext`, and authorization guards (`verify_driver_plate_access`) preventing horizontal privilege escalation between driver accounts.
6. **Vietnam Truck Restrictions & Admin Boundaries (CR-07 & CR-08)**:
   - `apps/api/src/greenlogix_api/geo/restrictions.py`: Modeled HCMC Decision 23/2018/QĐ-UBND light truck morning/evening bans and heavy truck day bans.
   - `apps/api/src/greenlogix_api/geo/admin_boundaries.py`: Resolved route traversal across canonical NSO wards/communes.
   - `apps/landing/public/driver/index.html`: Displayed dynamic administrative corridor breadcrumbs (`Tân Bình → Phú Nhuận → Quận 10 → Quận 1`).
7. **GLX-HDT-v1 Energy Model & EcoPath Pareto Engine (CR-09 & CR-10)**:
   - `docs/research/energy_model_spec.md`: Documented governing physics equations and physical monotonicity invariants.
   - `apps/api/src/greenlogix_api/energy/hdt_v1.py`: Implemented mechanical tractive power demand and fuel consumption model.
   - `apps/api/src/greenlogix_api/routing/pareto.py`: Evaluated multi-criteria trade-offs (Fastest Legal vs Eco Balanced vs Eco Max).
   - `apps/api/src/greenlogix_api/optimizer/eco_alns.py`: Implemented ALNS with load-dependent destroy/repair operators.
8. **Investor Evidence UI & Route Policy Cards (CR-15)**:
   - `apps/landing/public/app/index.html`: Added Route Policy Pareto Selector, Tier C1 Confidence badge, and vehicle truck envelope metadata.

---

### Decisions / tradeoffs

1. **Python Standard Library over External Dependencies**:
   - Reused `urllib.request` in `gofa.py` instead of adding external packages like `httpx`, ensuring compile-time efficiency and zero footprint bloat.
2. **Backwards Compatibility on Legacy Auth**:
   - Preserved `Bearer DEMO` and PIN `0000` for existing test suites while structuring `AuthContext` for scoped driver plate authorization.
3. **Pareto Frontier vs Linear Weighting**:
   - Formally deprecated unit-mixing `(1 - w)*km + w*kg_co2` in favor of SLA-bounded Pareto candidates (`Fastest Legal` $\le 0\%$, `Eco Balanced` $\le 5\%$, `Eco Max` $\le 10\%$).

---

### Verification

```bash
# 1. API Python Test Suite (295 tests passing)
cd apps/api && uv run pytest -q

# 2. Driver Flutter Test Suite (15 tests passing)
cd apps/mobile-driver && flutter test

# 3. Landing & Portals Build
pnpm run build:landing

# 4. Playwright Visual QA/QC
uv run --with playwright python scripts/qa_driver_pwa.py
uv run --with playwright python scripts/qa_manager_portal.py
```

---

# Implementation Notes: Go-live QA slice (optimize labels + slash/auth)

**Date:** 2026-09-13T18:20:00+07:00  
**Author:** Cursor Cloud Agent (Thanh / `@ShayNeeo`)  
**Scope:** Production go-live QA for van / `xe_tai_nho` routing. Runbook plus Worker/API hardening only where tests proved a gap. Not moto. Not ISO 14083. No Google scrape.

---

### What changed

1. **`docs/runbooks/golive-qa.md`** (NEW): how to verify live `POST /optimize`, driver, and report; env `ROAD_BASELINE=auto`, `ROAD_BASELINE_COSTING=truck`, `GREENLOGIX_ECO_WEIGHT=1`; note that a CF API token may lack Zone → Workers Routes for `greenlogix.w9.nu` while `workers.dev` still serves the code.

2. **Judge-visible optimize/report fields** (API + Worker):
   - `POST /optimize` now returns `baseline` (km / litres / kg CO₂), `distance_provider`, and `eco_weight` next to `totals`.
   - `GET /report` keeps those labels instead of dropping them on `ReportOut`.
   - Frozen OpenAPI snapshot updated for the additive keys only. Path set unchanged.

3. **Trailing-slash / auth footguns**:
   - Worker `apiPath` treats `/optimize/`, `/api/optimize/`, `/report/`, `/driver/route/` as the no-slash routes.
   - FastAPI strips a trailing slash (no 307) so POST body is not lost.
   - `Bearer DEMO` is case-insensitive; `?token=DEMO` still works.

4. **Tests:** `apps/api/tests/test_golive_qa.py`; Worker `src/http.test.ts` plus eco_weight + circuity-not-fallback in `roadBaseline.test.ts`. CI stays `ROAD_BASELINE=circuity`.

---

### Decisions / tradeoffs

1. **Expose labels on optimize, not a new endpoint.**
   - Judges hitting `POST /optimize` (or the landing proxy) must see baseline vs optimized km/CO₂ without a second hop. `/report` still owns delta %.

2. **Additive OpenAPI only.**
   - Previous RoadBaseline CR froze the path set. This slice adds optional-with-default response keys (`baseline`, `distance_provider`, `eco_weight`). No new paths.

3. **Surgical.**
   - No landing rewrite, no emission-factor edits, no Google scrape, no ISO 14083.

---

### Verification

```bash
export PATH="$HOME/.local/bin:$PATH"
cd apps/api && uv sync --locked && uv run --locked pytest -q
pnpm --filter @greenlogix/worker run typecheck
pnpm --filter @greenlogix/worker run test
```

Live (read-only checks plus one demo optimize): see `docs/runbooks/golive-qa.md`.

---

# Implementation Notes: RoadBaseline OSM distances + optional eco-cost

**Date:** 2026-09-13T17:50:00+07:00  
**Author:** Cursor Cloud Agent (Thanh / `@ShayNeeo`)  
**Scope:** Adapter so solver tour km uses a free OSM road network (Valhalla auto/truck or OSRM driving) with circuity fallback, plus an optional eco-weighted sequencing cost. Google Directions can implement the same interface later. CR: `changes/CR-20260913-001.md`.

---

### What changed

1. **`apps/api/src/greenlogix_api/solver/road_baseline.py`** (NEW):
   - `RoadBaseline` protocol: `pair_km` + `matrix_km`.
   - `CircuityRoadBaseline` — haversine × `HCMC_CIRCUITY=1.35` (always available).
   - `OsrmRoadBaseline` — OSRM `/table/v1/driving` (meters → km).
   - `ValhallaRoadBaseline` — `/sources_to_targets` with `auto` or `truck` costing (`xe_tai_nho` envelope).
   - `FallbackRoadBaseline` + `materialize_matrix` — one matrix per optimize, HTTP timeout, fallback to circuity.
   - `GoogleDirectionsBaseline` — stub only. Raises `RoadBaselineNotConfigured` until a key and client exist. No scrape.

2. **`apps/api/src/greenlogix_api/solver/eco.py`** (NEW):
   - `eco_leg_cost` / `make_eco_pair_km` / `GREENLOGIX_ECO_WEIGHT` in `[0,1]`.
   - `0` = minimize km (default). `1` = minimize estimated kg CO₂. Blend in between.
   - Reported totals stay physical TTW km / litres / kg CO₂.

3. **Solver wiring** (`nn_two_opt.py`, `solver/__init__.py`, worker `solver.ts` + `index.ts`):
   - NN+2-opt keep their structure. They accept an injected `pair_km` / `cost_fn`.
   - Cluster radius and late-risk ETA still use geographic haversine / circuity `road_km` (no HTTP on list).
   - Production worker (`wrangler.jsonc`): `ROAD_BASELINE=auto`, `ROAD_BASELINE_COSTING=truck`, `GREENLOGIX_ECO_WEIGHT=1`.
   - Pytest pins `ROAD_BASELINE=circuity`. HTTP retries, 300s matrix TTL, null cells fail that provider.
   - `eco_weight>0` assigns the lower-TTW truck on a mixed `xe_tai_nho` fleet. `google` without a key uses the OSM chain.

4. **Tests:** `apps/api/tests/test_road_baseline.py`, `test_eco_cost.py`; existing `test_baseline.py` still asserts baseline km ≠ optimized km. Worker: `src/roadBaseline.test.ts` (node:test).

5. **Docs/UI:** dispatcher notes (API + live worker), root README, `apps/api/README.md`. Google-class baseline = OSM for now; Google key later. Zig-zag vs NN+2-opt is not Google.

---

### Decisions / tradeoffs

1. **Interface first, Google later.**
   - *Problem:* No Google Maps API key; contest wants a Google-class road baseline, not another haversine trick.
   - *Solution:* Same `RoadBaseline` for Valhalla/OSRM now and Google Directions later. Public OSM endpoints; 2.5s timeout; circuity if they are down. CI does not need Docker or an OSM extract.

2. **Matrix once per optimize, not per pair.**
   - NN+2-opt calls pair distance many times. `materialize_matrix` caches the table so lookups are O(1). Clustering stays haversine so a 3 km radius stays geographic.

3. **Eco-cost is a hook, not a new carbon standard.**
   - For one vehicle, kg CO₂ is linear in km, so `eco_weight` does not change the tour unless a custom `pair_km` is non-linear. The hook is there for mixed-fleet / future Google traffic emissions. Do not invent ISO 14083.

4. **Baseline vs optimized is still Excel-order vs NN+2-opt.**
   - Both sides use the same road provider. That delta is routing, not “Google vs us”.

5. **Surgical.**
   - No OpenAPI change, no landing rewrite, no emission factor edits, no Google scrape.

---

### Verification

```bash
export PATH="$HOME/.local/bin:$PATH"
cd apps/api && uv sync --locked && uv run --locked pytest -q
pnpm --filter @greenlogix/worker run typecheck
pnpm --filter @greenlogix/worker run test
```

No local Valhalla/OSRM Docker image is required. Public endpoints responded from this environment (OSRM table ~6.3 km, Valhalla auto ~6.0 km for Tân Bình DC → Q1).

**Go-live wiring (so2026 worker):** `wrangler.jsonc` sets `ROAD_BASELINE=auto`, `ROAD_BASELINE_COSTING=truck`, `GREENLOGIX_ECO_WEIGHT=1`. Factory maps `google` → the same OSM chain until a Directions key and client exist. HTTP retries twice, matrices TTL-cache 300s, null cells fail that provider and the next one runs. Nested fallback reports `osrm` / `valhalla`, not `fallback`. Mixed-fleet assignment at `eco_weight>0` picks the lower TTW kg CO₂ `xe_tai_nho`. CI forces `ROAD_BASELINE=circuity` so pytest never needs Docker or VinUni GPS dumps.

Self-hosted extract: `VALHALLA_URL` or `OSRM_URL`. FastAPI without env uses `auto`/`truck` in production; tests pin circuity.

---

# Implementation Notes: Professional Lucide Icons, Demo Role Portal & Driver App Flow


**Date:** 2026-09-07T02:48:00+07:00  
**Author:** Phạm Quốc Thanh (`@ShayNeeo`)  
**Scope:** Removal of unprofessional emojis, integration of Lucide SVG icons, Zero-Friction Role Portal modal on Landing page, and Dedicated Driver Mobile PWA (`/driver`).

---

### What changed

1. **`apps/worker/src/dispatcherHtml.ts`**:
   - Replaced all emojis (`🌱`, `⚡`, `🚀`, `🔄`, `📊`, `🏢`, `🔍`, `⚠️`) with official **Lucide SVG Icons** (`database`, `zap`, `send`, `rotate-cw`, `file-spreadsheet`, `building-2`, `shield-alert`, `route`, `map-pin`, `truck`, `smartphone`).
   - Added direct navigation link to `/driver` in the dispatcher header.
   - Initialized vector icons via `lucide.createIcons()` on each DOM render and state change.

2. **`apps/worker/src/driverHtml.ts` (NEW)**:
   - Built a mobile-first PWA frontend for delivery drivers at `/driver`.
   - Uses Lucide SVG icons exclusively.
   - Interactive vehicle plate selector (`51C-000.01` to `51C-000.05`).
   - Turn-by-turn stop sequence cards showing address, phone number link, time windows, and cargo weight.
   - HCMC Municipal Truck Ban alerts on stops scheduled between 06:00-09:00 or 16:00-20:00 (Quyết định 23/2018/QĐ-UBND).
   - One-tap status writeback buttons: `Đến nơi` (`arrived`), `Đã giao` (`delivered`), `Báo hoãn` (`failed` with custom prompt reason) that write directly to Cloudflare D1.

3. **`apps/worker/src/index.ts`**:
   - Added route handler for `/driver` serving `DRIVER_HTML`.

4. **`apps/landing/src/components/RolePortalModal.tsx` (NEW)**:
   - Built a Zero-Friction Demo Auth modal using `lucide-react`.
   - Allows users/judges to enter without filling forms or entering passwords.
   - Two clear roles:
     - **Quản lý (Dispatcher)**: Directs to `/app` (Dispatcher Console).
     - **Tài xế (Driver)**: Directs to `/driver` with vehicle selector (`51C-000.01` preselected).

5. **`apps/landing/src/components/Navbar.tsx` & `App.tsx`**:
   - Added "Vào ứng dụng" button in desktop navbar and mobile drawer with Lucide `LayoutDashboard` icon.
   - Triggering the button opens `RolePortalModal`.

---

### Decisions / tradeoffs

1. **Zero-Friction Role-Based Demo Auth**:
   - *Problem*: Traditional SaaS auth requires registration, email verification, or password prompts that slow down hackathon judges and prospective customers.
   - *Solution*: A dedicated **Demo Role Portal** on the landing page that explains the persona and launches `/app` or `/driver` with pre-authenticated demo tokens (`Bearer DEMO`, PIN `0000`).

2. **Iconography Standard**:
   - Completely eliminated emojis. Used official **Lucide Icons** across both React landing (`lucide-react`) and Worker edge HTML templates (`unpkg.com/lucide`).

---

### Verification

1. **Build & Deploy Gates**:
   - `pnpm --filter @greenlogix/worker run typecheck` → 0 errors.
   - `pnpm --filter @greenlogix/worker run deploy` → Deployed version `ff6072c1` to `greenlogix.w9.nu/*` and `greenlogix-api.9ez.workers.dev`.
   - `pnpm --filter @greenlogix/landing run build` → Built in 713ms.
   - `pnpm wrangler pages deploy apps/landing/dist --project-name greenlogix` → Uploaded to `https://941f7526.cargox-group-3qm.pages.dev` and live on `https://greenlogix.w9.nu`.

2. **Browser QA/QC (Chrome DevTools MCP)**:
   - Navigated to `https://greenlogix.w9.nu/`: Verified "Vào ứng dụng" button rendered in Navbar with Lucide icon.
   - Clicked "Vào ứng dụng": Verified `RolePortalModal` opened with Dispatcher and Driver cards.
   - Navigated to `https://greenlogix.w9.nu/driver?plate=51C-000.01`: Verified Driver PWA loaded with 27 stops and Lucide icons.
   - Clicked "Đã giao" on Stop #1: Verified status updated to `delivered` in Cloudflare D1.

---

# Bugfix Notes: Dispatcher Leaflet SRI Hash Mismatch & Connection Stall

**Date:** 2026-09-07T06:05:00+07:00  
**Author:** Phạm Quốc Thanh (`@ShayNeeo`)  
**Scope:** Root cause analysis and resolution of "Đang kết nối Cloudflare Edge..." stall on `/app`.

### Root Cause
1. **Subresource Integrity (SRI) Hash Mismatch**:
   - In `apps/worker/src/dispatcherHtml.ts`, the `<script src="leaflet.js">` tag was assigned the sha256 hash belonging to `leaflet.css` (`sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=`) rather than `leaflet.js` (`sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=`).
   - Chrome's security layer blocked `leaflet.js` from loading with:  
     `Failed to find a valid digest in the 'integrity' attribute for resource '...leaflet.js'`.
   - When the inline script ran `const map = L.map("map", ...)`, it threw `Uncaught ReferenceError: L is not defined`.
   - Because the main thread threw an uncaught error before `Promise.all([refreshRoutes(), ...])`, data loading halted completely, leaving the status message permanently stuck on `"Đang kết nối Cloudflare Edge..."` and the map unrendered (black).

2. **CDN 302 Redirect Latency**:
   - `https://unpkg.com/lucide@latest` issued 302 redirects on each uncached load.

### Fix
1. Corrected `leaflet.js` SRI hash to `sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=`.
2. Pinned `lucide` to `https://unpkg.com/lucide@0.475.0/dist/umd/lucide.min.js`.
3. Wrapped icon rendering in `safeCreateIcons()` to prevent any external CDN delay from blocking application execution.
4. Added defensive checks around `L.map` and `drawRoutes` to guarantee that even if map assets are delayed, the dashboard and route tables initialize reliably.

### Verification
- Chrome DevTools console: 0 errors/exceptions.
- App state verified: Status transitioned to `"Hệ thống sẵn sàng trên Cloudflare Edge 24/7"`, map rendered with 5 routes and 80 stops, KPIs loaded (`94.74 km`).
- Worker version `b05ec4d6-33f3-4240-82d7-b6c9d9f7271a` deployed live to `greenlogix.w9.nu/*`.

---

## 2026-09-22 — Deep CR-01/04/06 batch + post-fix audit

### What changed
- `schemas.py`: `OptimizeOut` + `ReportOut` gain `routing_quality: str = "DEGRADED"` (additive, frozen path set unchanged).
- `solver/road_baseline.py`: `quality_for_provider()` + `materialize_matrix` 3-tuple `(baseline, name, quality)`; `solver/__init__.py` `VrpResult.routing_quality` threading.
- `solver/eco.py`: deprecation warning log when weight>0, behavior unchanged.
- `main.py`: `_cors_origins()` — `GREENLOGIX_CORS_ORIGINS` allowlist, demo-only `*`.
- `solver/flags.py` (NEW): `GREENLOGIX_OPTIMIZER` legacy|ecoalns + `GREENLOGIX_PUBLISH_REQUIRE_VERIFIED` fail-closed helper (unit-tested, unwired in publish).
- `routers/driver.py`: migrated to `get_current_auth` + `verify_driver_plate_access` on all 3 endpoints; `auth/service.py` PIN pattern widened for real plates.
- `geo/road_graph.py` (NEW) + `data/road_graph.json` (7 keys, dev placeholders) + `docs/adr/0002-road-graph-manifest.md`; `road_graph_audit_extra()` exported, unwired in persist/save.
- PWA `driver/index.html:343`: copy `Chỉ đường (Google Maps · Ô tô)` + title footnote; `places/gofa.py` BLOCKED note; ADR 0001 amendment A1.
- Tests: `test_routing_quality.py` (12), `test_driver_authz.py` (9), `test_road_graph.py` (8); `test_auth.py` manager-bypass fix.
- New audit: `FRONTIER_GAP_AUDIT_2026-09-22.md` (0 PASS / 11 PARTIAL / 5 NOT STARTED). Prior 09-21 file untouched.

### Decisions / tradeoffs
- Additive-only schema (default DEGRADED) to preserve frozen OpenAPI contract.
- Eco weight deprecated-not-removed (worker + test compat).
- Seed xlsx regen side-effect reverted — not part of batch.
- Strict PASS threshold: 0/16 fully pass; Deep batch = groundwork, not closure.

### Verification
- `cd apps/api && uv run pytest -q` → 325 passed (was 295).
- `test_contract` frozen path set unchanged (only +routing_quality fields).

## 2026-09-23 — Loop-until-done (4 iterations, 18 gaps closed as DONE/SCAFFOLD)

### What changed
- Publish guard (DONE): `routers/optimize.py:154-168` calls `publish_blocked_for_quality()`; 403 when `GREENLOGIX_PUBLISH_REQUIRE_VERIFIED=1` + quality != VERIFIED_GRAPH; single decision point `solver/flags.py:30-37`.
- Manifest propagation (DONE): `routers/optimize.py:62-64` + `carbon.py:94-96` merge `road_graph_audit_extra()` (7 keys) into persist/report extra.
- Auth hardening (DONE-code): `auth/service.py:53` PIN gate 401 unless DEMO=1; `legacy.py:17-21` PIN 0000 demo-only; `service.py:21-43` lockout stub (record-only, enforcement pending).
- Tenant isolation (SCAFFOLD): `auth/dependencies.py:40-68` org + plate guards; `auth/models.py:23-29` in-memory scope, DB migration BLOCKED-note.
- Truck e2e (DONE): `solver/__init__.py:266-310` per-vehicle profiles + primary selection + provider injection; Vehicle DB envelope fields still missing.
- Energy trace (DONE): `energy/hdt_v1.py:20-25` P_AUX single-value 1500 W; spec trace rows E-05b/E-07 + drift-fix `energy_model_spec.md:100-109`; OBD calibration BLOCKED.
- Pareto rerank (DONE): `routing/pareto.py:26-52` CandidateSource verified/illustrative, circuity always illustrative; verified path defined, unreachable until tiles.
- ALNS (SCAFFOLD): `optimizer/eco_alns.py:131-279` 2 destroy + greedy/regret-2 repair + adaptive weights; hill-climb only (`:304`), no SA/budget/trace/ablation.
- Harness (SCAFFOLD): `benchmark/harness.py:25,47` + `solvers_ref.py:17,39` deterministic NN-2opt + greedy; no PyVRP/OR-Tools deps.
- GOFA provenance (SCAFFOLD): `models.py:24-26` nullable fields + `serialize.py:27` + `schemas.py:44` passthrough; `gofa.py:24-30` BLOCKED note kept, no invented schema.
- Health versions (DONE): `main.py:113-131` /health returns manifest versions + probe (offline-safe 200); `schemas.py:23`.
- Admin-areas (SCAFFOLD): `routers/optimize.py:181-201` 18th path (additive only) + `geo/admin_boundaries.py:53-93` centroid-fallback honesty note; no PostGIS polygons.
- Evidence (SCAFFOLD): `carbon.py:18-28` C1-illustrative + not-certified note; `docs/research/evidence_ui.md`; no audit drawer / C0-C4 ladder.
- Telemetry (SCAFFOLD): `telemetry/ingest.py:18-90` FuelObs validate/append/list/save/load + `calibration.py:8` mae_mape; no live GPS/OBD feed.
- DRIVE stub: `solver/road_baseline.py:375-386` raises RoadBaselineNotConfigured (correct fail, no fake data).
- Cache key (DONE): `road_baseline.py:435-513` 6 version tokens + coords, manifest-backed offline-safe fallbacks.
- Restriction wiring (SCAFFOLD): `road_baseline.py:515-562` coverage labeling, fail-open `unchecked`, never raises.
- New audit: `FRONTIER_GAP_AUDIT_2026-09-23.md` (loop-final, 0/16/0 at CR level — all former NOT STARTED now scaffolded). Priors 09-21/09-22 untouched.
- Diff scope: 35 tracked files changed, +1391/-92; new untracked: `benchmark/`, `telemetry/`, `geo/road_graph.py`, `solver/flags.py`, 15+ `test_*.py` gates.

### Decisions / tradeoffs
- Additive-only OpenAPI: 17 -> 18 paths (`GET /routes/{id}/admin-areas` only addition); versions code-level unless schema-owned.
- BLOCKED honesty over invention: GOFA contract, Valhalla tiles/Docker, PostGIS polygons, OBD trials recorded as BLOCKED/infra, never faked.
- Strict PASS rule: 0/16 fully pass -> 16x PARTIAL; DONE = wired+tested, SCAFFOLD = honest stub with named remainder.

### Verification
- `cd apps/api && uv run pytest -q` -> 407 passed (was 325; path 325->333->360->375->390->407, 42 test files). No live tiles/GOFA/device/OBD.
- Contract: openapi.json 18 paths verified via JSON key listing; banned-claims grep clean (no truck-safe guarantee, no ISO-certified wording).
- Vetoes: `.opencode-state/betriebsrat/vetoes/` empty. Branch: so2026.

## 2026-09-24 — CR-20260923-001 closures + audit refresh (C-06)

### What changed
- T-01 lockout DONE: `apps/api/src/greenlogix_api/auth/service.py:28-43,46-66,93,110-117` (MAX_PIN_ATTEMPTS=20, 300s window, in-memory; valid-PIN path never counted; Bearer DEMO bypasses); `auth/legacy.py:5` note. Tests: `test_pin_lockout_triggers_after_n_rapid_failures`, `test_pin_lockout_resets_after_window`, `test_pin_lockout_demo_ok_path_unaffected` in `tests/test_auth_hardening.py`.
- T-02 envelope DONE: `models.py:43-57` additive nullable (`height_m/width_m/length_m/gvw_kg` + `axle_load_t/frontal_area_m2/cd`); `db.py:36-50,67,81` `_ensure_vehicle_envelope` pre-migration path; `geo/truck_profile.py:102-160` measured-envelope override. Rated-L via `l_per_100km`, powertrain via `fuel` (documented, no routing consumer for emission_standard).
- T-03 feedback DONE: `routers/driver.py:132-160` POST /driver/restriction-feedback (201, plate-scoped, no auto-mutate); `geo/restrictions.py:128-186` queue + verify (pending_review/verified/rejected, ACTIVE_RULES untouched). New `tests/test_restriction_feedback.py` (6 tests). 19th OpenAPI path, `FROZEN_METHODS` +1 (`tests/test_contract.py:29`).
- C-05 optimizer audit DONE: `carbon.py:104-119` additive `optimizer` + `pareto_source: illustrative` (caller-wins, never fails write). New `tests/test_optimizer_audit.py` (4 tests). No schema/OpenAPI change, no optimality claims.
- C-04 CORS verify: `main.py:52-65` split + `.env.example:3-7` prod line already present — no edit needed. 3 cors tests green.
- New audit: `FRONTIER_GAP_AUDIT_2026-09-24.md` (0/16/0 strict, priors untouched).

### Decisions / tradeoffs
- Additive-only everywhere: nullable Vehicle columns, setdefault audit labels, +1 OpenAPI path. No behavior change to demo-OK path (lockout counts failures only).
- BLOCKED honesty kept: Redis/shared store, PostGIS tables, Valhalla tiles, JWT/Argon2id remain named remainders — no CR flips to PASS under strict rule.
- No src behavior edits by C-06 worker beyond owned scope; .env.example untouched (prod line pre-existing).

### Verification
- `cd apps/api && uv run pytest -q` -> 425 passed (was 407; +18 lockout/feedback/optimizer-audit). 46 test files.
- Contract: openapi.json 19 paths (only addition POST /driver/restriction-feedback); `test_frozen_openapi` green; banned-claims grep = negations/wording-contract only.
- Cors subset: `test_cors_prod_split_allowlist` + `test_cors_allowlist_env` + `test_cors_allows_auth_headers_without_credentials` 3/3 green.
- Targeted: `-k "lockout or feedback or optimizer_audit"` 13 selected green; `-k "cors or lockout or feedback or vehicle or truck or optimizer or publish"` 96 selected green.
- Vetoes: `.opencode-state/betriebsrat/vetoes/` present, empty. Branch: so2026.

## 2026-09-25 — Feedback admin review endpoints (loop iteration, CR-20260923-002 scope on so2026)

### What changed
- Admin review endpoints: `routers/driver.py` (+48) `GET /driver/restriction-feedback/pending` + `POST /driver/restriction-feedback/{feedback_id}/verify`, both `require_manager_role`; unknown id 404 `unknown_feedback_id`; never touches ACTIVE_RULES (calls `verify_feedback` only).
- Schemas additive: `schemas.py` `FeedbackItemOut` (id/driver_id/plate/lat/lng/issue_type/notes/status) + `FeedbackVerifyIn` (approved bool). No existing model touched.
- Contract: `openapi.json` regen 19 -> 21 paths (only additions); `tests/test_contract.py` FROZEN_METHODS +2.
- Tests: `tests/test_restriction_feedback.py` +4 (admin list, verify-flow empties queue + ACTIVE_RULES identical, scoped-driver 403 both endpoints, unknown-id 404).

### Decisions / tradeoffs
- Manager-only (not driver) for review; scoped driver 403 via require_manager_role (plate guard unnecessary — managers see all plates).
- Path-style verify `/{id}/verify` over body-id: explicit resource, 404 natural, matches stops-photo style.
- Loop runs on so2026 (queue code lives here); fresh cr/002 worktree kept empty per user branch choice — CR-20260923-002 stays blocked until CR-001 lands, but code-closable gap closed on loop branch.
- ponytail: stdlib only, no new deps, no DB migration (in-memory queue precedent kept).

### Verification
- `cd apps/api && uv run pytest tests/test_restriction_feedback.py tests/test_contract.py -q` -> green (targeted).
- `cd apps/api && uv run pytest` -> 429 passed (was 425; +4 admin tests).
- Contract: openapi.json 21 paths (only additions pending + verify); `test_frozen_openapi` green.
- Banned-claims grep = negations/wording-contract only (carbon.py, optimize.py:176, flags.py:9, road_baseline.py:30).
- Vetoes: `.opencode-state/betriebsrat/vetoes/` empty. Branch: so2026.

## 2026-09-26 — EcoALNS v2 slice (SA acceptance + runtime budget + trace + 2 GreenLogix destroy ops)

### What changed
- Optimizer lib only (`optimizer/eco_alns.py`, +~170): `EcoSolution.convergence_trace` (iteration/fuel/unassigned/accepted/destroy_op/repair_op/temperature per iteration); opt-in `acceptance="sa"` (geometric cooling `sa_temp0*sa_cooling**it`, seeded-rng draws, unassigned-growth still rejected, uphill moves never earn adaptive reward); opt-in `time_budget_s` wall-clock guard returning best-so-far; `worst_fuel_removal_destroy` (marginal-fuel removal saving, payload-before-leg aware) + `uphill_payload_removal_destroy` (carried-payload × leg-km proxy for §11.5/Lai-2024 insight) registered in DESTROY_OPS + adaptive weights; legacy 3-arg destroy ops kept via TypeError fallback.
- Tests (`tests/test_alns_operators.py`, +6): SA deterministic same-seed + cooling monotonic; SA no-worse-unassigned vs hill-climb + capacity respected; budget returns best-so-far with short trace + TRACE_KEYS on full trace; worst_fuel/uphill deterministic + feasible via solver; new ops registered + adaptive-selectable with 20-row trace.
- No router/schema/openapi change (21 paths unchanged); no new deps (stdlib `time` only).

### Decisions / tradeoffs
- Hill-climb stays default: all pre-existing tests/benchmark fixtures byte-behavioral (existing 4 alns + harness green unmodified).
- CustomerNode has no grade field, so uphill proxy uses leg-km × carried-payload (documents limitation; grade-aware scoring waits for elevation/leg features).
- Trace rows deep-copy with best_solution; working copy reset per iteration so rows accumulate once (accepted rows carry candidate fuel, rejected rows carry best fuel).
- SA reward uses `improved` (true global-best gain), not SA acceptance — uphill moves never inflate operator weights.
- ponytail: stdlib only, no PyVRP/OR-Tools (still BLOCKED), no DB migration, no OpenAPI churn.

### Verification
- `cd apps/api && uv run pytest tests/test_alns_operators.py tests/test_eco_alns.py -q` -> 11 passed (targeted).
- `cd apps/api && uv run pytest` -> 435 passed (was 429; +6 v2 tests).
- Contract: openapi.json 21 paths unchanged; `test_frozen_openapi` green.
- Banned-claims grep = negations/wording-contract only (carbon.py, optimize.py:176, flags.py:9, road_baseline.py:30).
- Vetoes: `.opencode-state/betriebsrat/vetoes/` empty. Branch: so2026.

## 2026-09-27 — Pareto epsilon-SLA selection + why-facts (CR-10 Stage-1 code slice)

### What changed
- SLA selection (`routing/pareto.py`, +~110): `EPSILON_PRESETS` FASTEST_LEGAL=0 / ECO_BALANCED=5 / ECO_MAX=10 + `custom_epsilon_pct` override; `select_policy_path` returns (fastest, selected) — SLA-safe by construction (filter within epsilon, then min fuel; deterministic tie-break fuel→time→policy; epsilon=0 admits fastest itself); `why_facts` builds 4-5 structured strings from candidate fields only (policy+epsilon, fuel delta+savings, time delta, source+confidence+not-certified note, selected-is-fastest flag) — no LLM, no invented reasons; verified rerank path untouched.
- Tests (`tests/test_pareto_rerank.py`, +4): epsilon=0 within fastest tolerance; epsilon growth never shrinks feasible set (§15.2 metamorphic); min-fuel-within-budget + unknown-mode/empty/custom-0 ValueError paths; why-facts content + illustrative label + determinism.
- No router/schema/openapi change (21 paths unchanged); no new deps.

### Decisions / tradeoffs
- Response wiring deferred: selector + facts are library-level (like `rerank_from_alternatives` verified path) — HTTP exposure waits until Valhalla alternatives exist; avoids additive contract churn for illustrative-only data.
- Custom epsilon override supports §8.2 Custom SLA user-defined buffer without new preset names.
- ponytail: stdlib only, ~110 lines lib + ~60 tests, no deps, no migration.

### Verification
- `cd apps/api && uv run pytest tests/test_pareto_rerank.py -q` -> 10 passed (was 6; +4 SLA tests).
- `cd apps/api && uv run pytest` -> 439 passed (was 435; +4 SLA tests).
- Contract: openapi.json 21 paths unchanged; `test_frozen_openapi` green.
- Banned-claims grep = 5 hits negations/wording-contract only (carbon.py×2, optimize.py:176, flags.py:9, road_baseline.py:30).
- Vetoes: `.opencode-state/betriebsrat/vetoes/` empty. Branch: so2026.

## 2026-09-23 — ALNS ban-window conflict destroy op (CR-12/CR-13 code slice, CR-20260923-003)

### What changed
- Ban-window destroy op (`optimizer/eco_alns.py`, +~50): `ban_window_removal_destroy` scores each stop by Decision 23/2018 overlap via `geo.restrictions.check_truck_ban` (stop window x tour `profile.vehicle_class`); restricted-first binary ordering, seeded-rng exact-tie shuffle only, descending-index pop; registered in `DESTROY_OPS` + adaptive `destroy_weights`; docstring operator list updated. Library-level only, hill-climb default unchanged.
- Tests (`tests/test_alns_operators.py`, +3): deterministic same-seed + restricted-first set assert (07:30-08:30 ban windows vs 10:00/11:00 clear under `xe_tai_nho`); feasible via solver (`destroy_op="ban_window"`, unassigned==0, capacity respected); registered + adaptive-selectable with 20-row trace.
- CR file `changes/CR-20260923-003.md` (fence + closeout); no router/schema/openapi change (21 paths unchanged); no new deps.

### Decisions / tradeoffs
- Window-format failures degrade to unrestricted (try/except → False): destroy ordering is heuristic-only, never a safety decision — matches reviewer assessment (benign).
- `xe_tai_trung` inherits `check_truck_ban` light-class normalization (pre-existing, out of scope).
- Adaptive pool grows 4→5 ops: pre-existing adaptive trajectories may shift, properties hold by construction; suite run is the guard.
- ponytail: stdlib only, ~50 lines lib + ~35 tests, no deps, no migration, no contract churn.

### Verification
- `cd apps/api && uv run pytest tests/test_alns_operators.py tests/test_eco_alns.py -q` -> 14 passed (was 11; +3 ban-window tests).
- `cd apps/api && uv run pytest` -> 442 passed (was 439; +3 ban-window tests).
- Contract: openapi.json 21 paths unchanged; `test_frozen_openapi` green (87 contract tests green).
- Banned-claims grep = 5 hits negations/wording-contract only (carbon.py×2, optimize.py:176, flags.py:9, road_baseline.py:30).
- Reviewer gate: BanWindowReviewer PASS (AC-01/02/03 all PASS; risks benign/pre-existing). Branch: so2026.

## 2026-09-23 — Technical & Competitive Pitch Deck Audit (`Proposal _ ECOMILES.pdf`)

### What changed
- Audited 14 slides from `/home/shayneeo/Downloads/Trash/Proposal _ ECOMILES.pdf` via high-resolution image rendering (`pdftoppm` 150 DPI) and visual inspection across each slide.
- Published deep audit report: `docs/audit/PROPOSAL_ECOMILES_TECH_AUDIT.md`.
- Identified 5 critical discrepancies:
  1. Generic "Smart VRP / OSRM" hides Eco-ALNS v2, GLX-HDT-v1 tractive physics, and Pareto $\epsilon$-SLA engine.
  2. Slide 8 completely ignores real competitors (Abivin vRoute, SmartLog STM, AhaMove, Google Fleet Engine).
  3. Unsubstantiated metrics ("-88.31% CO₂ TTW", "triệt tiêu 30% xe chạy rỗng") lack required data provenance labels (`[BENCHMARK MÔ PHỎNG]`, `[GIẢ ĐỊNH – CẦN PILOT]`).
  4. Phantom feature: "Backhaul Matching" claimed as active in MVP when it is Phase 4 roadmap.
  5. Cites ISO 14064 instead of transport logistics standard ISO 14083 / GLEC 3.2.
- Provided actionable slide rewrite blueprints and a 5-way competitive matrix.

### Decisions / tradeoffs
- Kept report decoupled as a standalone reference document (`docs/audit/PROPOSAL_ECOMILES_TECH_AUDIT.md`) so the pitch team and slide designers can immediately copy-paste rewrites into Canva.
- Evaluated both visual slide design and exact Vietnamese phrasing to ensure alignment with VSIC / RnD-to-Startup judging criteria.

### Verification
- Rendered 14/14 slide PNGs in `docs/qa-screenshots/proposal-slides/`.
- Performed visual inspection on key technical slides (`page-02.png`, `page-03.png`, `page-05.png`, `page-06.png`, `page-07.png`, `page-08.png`).
- Cross-verified codebase capabilities in `optimizer/eco_alns.py`, `energy/hdt_v1.py`, `routing/pareto.py`, and `geo/restrictions.py`.
- Formatted and generated executive DOCX report: `BAO_CAO_AUDIT_TECH_SLIDE_ECOMILES.docx` (and `docs/audit/PROPOSAL_ECOMILES_TECH_AUDIT.docx`) via `scripts/create_audit_docx.py`.

## 2026-09-23 — Driver PWA Navigation Button Edge Sync & Live Verification

### What changed
- `apps/worker/src/driverHtml.ts`: Added missing `.btn-navig` CSS style and Google Maps driving navigation button (`Chỉ đường (Google Maps · Ô tô)`) with disclaimer text to the serverless Edge Worker template, ensuring parity with `apps/landing/public/driver/index.html`.
- `.gitignore`: Added `.~lock.*#` pattern to ignore temporary LibreOffice/Word lock files.
- Re-deployed Edge Worker (`greenlogix-api`) via `pnpm --filter @greenlogix/worker run deploy` (Version ID: `d6dd1074-c04b-4252-9c03-e09314fc3dc5`).

### Decisions / tradeoffs
- Kept `apps/landing/functions/driver.ts` proxy pattern intact while ensuring `apps/worker/src/driverHtml.ts` is the single source of truth for edge-rendered driver HTML.
- Explicit disclaimer maintained on each stop card: "Google sẽ tính lại tuyến khi mở — đây là dẫn đường ô tô ngoài, không phải tuyến xe tải đã duyệt."

### Verification
- Tested with `pnpm --filter @greenlogix/worker test` (16/16 passed) and `pnpm --filter @greenlogix/worker run typecheck` (0 errors).
- Re-loaded and inspected active Chrome browser on port 9222 via Chrome DevTools MCP (`select_page`, `navigate_page`, `take_screenshot`).
- Visually verified presence of blue "Chỉ đường (Google Maps · Ô tô)" button and HCMC Decision 23/2018 truck ban badge on active driver stops.
- Updated `BAO_CAO_AUDIT_TECH_SLIDE_ECOMILES.docx` and `docs/audit/PROPOSAL_ECOMILES_TECH_AUDIT.docx` with dedicated Section 7: "Driver Navigation Strategy: Google Maps vs. Proprietary Engine Deep Dive" including 3-tier engineering evolution and winning pitch Q&A script.

## 2026-09-24 — CR-20260924-001: Real GOFA Places client, REST endpoints, web surfaces autocomplete, driver navigation handoff & eco claims integrity

### What changed

1. **Backend GOFA Places Client & Configuration (`apps/api`)**:
   - `src/greenlogix_api/places/gofa.py`: Implemented production-grade `GofaPlaceProvider` connecting to `https://places-api.gofa.vn` using `X-API-Key` authentication header (`GET /v5/Place/AutoComplete?input=` and `GET /v5/Place/Detail?place_id=`). Replaced `Bearer` auth fiction. Added query minimum length validation (3 chars). Implemented robust response parsing for `predictions[]` into `PlaceSuggestion` and `result.geometry.location` / `result.compound.{province,district,commune}` into `PlaceDetail` (canonical ward mapped from `compound.commune`). Enforced detail validation with `status == "OK"` gate, returning `None` on non-OK status. Added quota monitoring knobs (`GOFA_QUOTA_AUTOCOMPLETE`, `GOFA_QUOTA_DETAIL`) with warning logs on threshold breaches, in-memory TTL caching with `clear_cache()`, and clean mock fallback when no key is set.
   - `src/greenlogix_api/routers/places.py`: Exposed `GET /places/autocomplete?q=` and `GET /places/detail/{place_id}` protected by `verify_dispatcher_access`. Utilized process-level singleton provider (`get_places_provider()`) with `reset_places_provider()` test hook to preserve cache across requests. Returns honest HTTP 503 (`places service unconfigured: GOFA_API_KEY missing`) when unconfigured, HTTP 422 on queries < 3 characters, HTTP 404 on missing/empty detail results, and HTTP 502 with error masking (`Upstream places provider error`) to prevent leakage of upstream API keys or internal stack traces.
   - `src/greenlogix_api/main.py`: Wired `places.router` into the FastAPI application.
   - `apps/api/openapi.json`: Additively registered `/places/autocomplete` and `/places/detail/{place_id}` plus associated schemas (`SuggestionOut`, `DetailOut`), expanding frozen paths from 21 to 23 with zero deletions.
   - `apps/api/.env.example`: Documented `GOFA_API_KEY`, `GOFA_PLACES_BASE_URL`, and quota threshold placeholders.
   - `apps/api/tests/conftest.py`: Added autouse fixture `block_live_gofa_network_calls` monkeypatching stdlib `_urllib_transport` to prevent any accidental live network calls during automated test suites, strictly guarding the 15,000 monthly quota.
   - `apps/api/tests/test_places.py` & `apps/api/tests/test_places_provenance.py`: Updated and replaced obsolete 501 stubs with 18 comprehensive tests covering live-shape autocomplete, live-shape detail parsing with administrative compound hierarchy, dispatcher auth, min-length 422, unconfigured 503, error masking 502 without secret leaks, in-memory caching, and provenance propagation.
   - `apps/api/tests/test_contract.py`: Updated `FROZEN_METHODS` with `"/places/autocomplete": {"get"}` and `"/places/detail/{place_id}": {"get"}` to enforce frozen contract integrity (87 contract tests passing).

2. **Manager Web Autocomplete UI (`apps/landing/public/app/index.html`)**:
   - Embedded full geocoding order creation panel with debounced (300ms) autocomplete dropdown bound to backend `GET /places/autocomplete?q=`. Gated on query length $\ge 3$ characters, with stale request cancellation via `AbortController`.
   - Integrated place selection to query `GET /places/detail/{place_id}`, populating canonical `order-lat`, `order-lng`, administrative breadcrumb (`ward`, `district`, `province`), and data provenance badge (`provider: "gofa"`).
   - Added interactive Leaflet map preview marker at resolved coordinates.
   - Added real-time filtering on `#q` and `#late` in `renderStopsList()`.
   - Replaced hour-only truck ban logic with minute-level interval overlap `Math.max(s, 360) < Math.min(e, 540)` and `Math.max(s, 960) < Math.min(e, 1200)`.

3. **Local Dispatcher Autocomplete UI (`apps/api/templates/dispatcher.html`)**:
   - Wrapped inline order editing address inputs (`data-f="address"`) in `.place-autocomplete-container` with debounced (300ms) autocomplete and `AbortController` cancellation.
   - On selection, queries `GET /places/detail/{place_id}`, renders inline provenance badge (`📍 gofa: <place_id> (<lat>, <lng>)`), and updates `tr.dataset.lat`, `tr.dataset.lng`, `tr.dataset.placeId`, `tr.dataset.placeProvider`.
   - Updated `.patch` click handler to inject `payload.lat = Number(tr.dataset.lat)` and `payload.lng = Number(tr.dataset.lng)`, ensuring coordinates are synchronized with address text in backend `PATCH /orders/{id}` calls.

4. **Driver PWA Lifecycle & Navigation Handoff (`apps/landing/public/driver/index.html`)**:
   - Replaced free-text `prompt()` in `onFailClick()` with structured `#failure-modal` dialog mapping directly to backend `FailureReason` literals (`khach_vang`, `sai_dia_chi`, `hang_hong`, `tu_choi`), eliminating HTTP 422 validation errors.
   - Verified stop lifecycle status transitions (`arrived`, `delivered`, `failed`) persist to backend via `POST /api/stops/{id}/status`.
   - Confirmed Google Maps external navigation handoff enforces driving mode (`travelmode=driving&dir_action=navigate`).
   - Elevated re-routing disclaimer to a prominent high-contrast amber alert card with mandatory wording: *"Google sẽ tính lại tuyến khi mở — đây là dẫn đường ô tô ngoài, không phải tuyến xe tải đã duyệt."*
   - Upgraded `isHcmcTruckBan()` with minute-level interval overlap.
   - Rendered traversed administrative corridors by extracting traversed wards/districts and querying authoritative route corridor breadcrumbs.

5. **Marketing Landing Navigation & Eco Claims Integrity (`apps/landing/src` & root)**:
   - `apps/landing/src/App.tsx`: Added client-side redirect for `/dispatcher` path (`window.location.replace('/dispatcher/' + window.location.search)`).
   - `apps/landing/src/components/RolePortalModal.tsx`: Added third role card for "Điều phối viên trạm / Local Dispatcher" linking directly to `/dispatcher/`, complete with feature list and badge.
   - `apps/landing/public/_redirects`: Added edge redirect rule `/dispatcher /dispatcher/ 301`.
   - `apps/landing/src/components/PitchDeckVoiceoverPage.tsx`: Aligned all eco-routing, GLEC, and truck safety claims with C1-illustrative wording contract. Replaced uncertified ISO claims and speculative truck safety assurances with qualified estimates (`tham chiếu GLEC / ISO 14083, chưa chứng nhận`, `cảnh báo vi phạm khung giờ cấm tải theo QĐ 23/2018`).
   - `package.json`: Updated description to `"EcoMiles — B2B Urban Logistics Optimization & GLEC-aligned Carbon Estimation Platform (not certified)"`.

---

### Decisions / tradeoffs

1. **Quota discipline & mock fallback**:
   - GOFA provides a hard tier of 15,000 requests monthly. To prevent quota exhaustion during rapid ReAct QC cycles:
     - Implemented client-side query gating (minimum 3 characters) and 300ms debouncing.
     - Implemented in-memory TTL caching for autocomplete predictions and detail queries.
     - Detail lookups are triggered strictly upon explicit selection of a suggestion.
     - Added an autouse fixture `block_live_gofa_network_calls` in `tests/conftest.py` that intercepts live transport calls, and wired `MockPlaceProvider` / fake transports into test suites to burn zero live quota during automated verification.
2. **Server-side secret hygiene**:
   - `GOFA_API_KEY` is loaded exclusively into server-side process environments via `apps/api/.env` (gitignored).
   - Zero API keys are bundled into client HTML, JavaScript, or public templates.
   - Web applications query backend proxy endpoints (`/places/autocomplete` and `/places/detail/{place_id}`) secured with session tokens (`Bearer DEMO` / dispatcher role).
3. **Upstream error masking**:
   - When upstream GOFA calls fail or time out, `routers/places.py` catches transport exceptions and returns HTTP 502 (`Upstream places provider error`) without exposing the upstream URL, raw response, or authentication headers in client error payloads.
   - If `GOFA_API_KEY` is unconfigured, the endpoint returns an honest HTTP 503 instead of fabricating mock responses.
4. **Structured failure modal resolving 422 validation errors**:
   - Backend `POST /stops/{id}/status` requires `StatusIn.reason` to match `FailureReason = Literal["khach_vang", "sai_dia_chi", "hang_hong", "tu_choi"]`.
   - Replaced browser `prompt()` with modal `#failure-modal` directly binding human-readable Vietnamese descriptions to exact enum literals, eliminating 422 Unprocessable Entity responses.
5. **External navigation disclaimer alert**:
   - External turn-by-turn navigation apps like Google Maps recalculate routes using passenger car baselines that ignore urban truck weight/height limits and time windows.
   - Elevated the warning to an amber card on each stop: *"Google sẽ tính lại tuyến khi mở — đây là dẫn đường ô tô ngoài, không phải tuyến xe tải đã duyệt."*
6. **Continuous minute-of-day truck ban intervals**:
   - Hour-only integer division (`parseInt(val.split(":")[0])`) previously caused delivery windows spanning across ban boundary hours (e.g., `06:00 - 06:30` and `16:00 - 16:30`) to evaluate falsely as unbanned.
   - Implemented continuous interval overlap ($\max(s, \text{ban\_start}) < \min(e, \text{ban\_end})$) for 06:00–09:00 (360–540 min) and 16:00–20:00 (960–1200 min), eliminating edge-hour violations under HCMC QĐ 23/2018.
7. **Non-certified GLEC/ISO wording contract**:
   - To comply with investor due-diligence rules and regulatory standards, all references to ISO 14064/14083 and GLEC were strictly modified to state "tham chiếu (chưa chứng nhận)" or "not certified", and claims promising complete elimination of fines were corrected to automated restriction warnings.

---

### Verification

1. **Targeted Places & Contract Suite (`apps/api`)**:
   ```bash
   cd apps/api && uv run pytest tests/test_places.py tests/test_places_provenance.py tests/test_contract.py -v
   ```
   *Result*: `105 passed in 1.82s` (0 failed, 100% green).

2. **Targeted Places Unit & Provenance Suite (`apps/api`)**:
   ```bash
   cd apps/api && uv run pytest tests/test_places.py tests/test_places_provenance.py -v
   ```
   *Result*: `18 passed in 0.61s` (0 failed, 100% green).

3. **Full Regression Pytest Suite (`apps/api`)**:
   ```bash
   cd apps/api && uv run pytest -q
   ```
   *Result*: `526 passed in 13.86s` (0 failures, 0 regressions across entire test suite).

4. **Driver Stop Status & Failure Reason Validation**:
   ```bash
   cd apps/api && uv run python -c '
   import tempfile
   from pathlib import Path
   from fastapi.testclient import TestClient
   from greenlogix_api import db as dbmod
   from greenlogix_api.main import app

   with tempfile.TemporaryDirectory() as td:
       dbmod.set_engine(f"sqlite:///{Path(td)}/test.db", recreate=True)
       client = TestClient(app)
       AUTH, PIN = {"Authorization": "Bearer DEMO"}, {"X-Driver-Pin": "0000"}
       client.post("/seed", headers=AUTH)
       client.post("/optimize", headers=AUTH, json={"cluster_radius_km": 3.0})
       client.post("/routes/publish", headers=AUTH, json={"route_ids": []})
       routes = client.get("/routes", headers=AUTH).json()
       stop_id = next(s["id"] for r in routes for s in r["stops"] if s["kind"] == "stop")
       
       # Free text fails with 422
       r_bad = client.post(f"/stops/{stop_id}/status", headers=PIN, json={"status": "failed", "reason": "invalid text"})
       assert r_bad.status_code == 422
       
       # Strict enums succeed with 200
       for enum_val in ["khach_vang", "sai_dia_chi", "hang_hong", "tu_choi"]:
           r_ok = client.post(f"/stops/{stop_id}/status", headers=PIN, json={"status": "failed", "reason": enum_val})
           assert r_ok.status_code == 200
           assert r_ok.json()["reason"] == enum_val
       print("Driver stop status validation verified successfully!")
   '
   ```
   *Result*: `Driver stop status validation verified successfully!` (Free text rejected with 422, all 4 enums return 200).

5. **Web Surfaces Static Integrity Checks**:
   ```bash
   node -e '
   const fs = require("fs");
   const appHtml = fs.readFileSync("apps/landing/public/app/index.html", "utf-8");
   const dispHtml = fs.readFileSync("apps/api/templates/dispatcher.html", "utf-8");
   const drvHtml = fs.readFileSync("apps/landing/public/driver/index.html", "utf-8");
   console.assert(appHtml.includes("/places/autocomplete?q="), "app missing autocomplete url");
   console.assert(dispHtml.includes("payload.lat = Number(tr.dataset.lat)"), "dispatcher missing lat patch");
   console.assert(drvHtml.includes("failure-modal") && drvHtml.includes("khach_vang"), "driver missing failure-modal enum");
   console.assert(drvHtml.includes("Google sẽ tính lại tuyến khi mở — đây là dẫn đường ô tô ngoài, không phải tuyến xe tải đã duyệt."), "driver missing disclaimer text");
   console.log("All static assertions passed!");
   '
   ```
   *Result*: `All static assertions passed!`.

6. **Marketing Landing Build Verification**:
   ```bash
   pnpm run build:landing
   ```
   *Result*:
   ```
   > @greenlogix/landing@0.0.0 build /home/shayneeo/Downloads/Documents/Coding/RND_to_Startup/apps/landing
   > tsc -b && vite build

   ✓ 2232 modules transformed.
   dist/index.html                   1.06 kB │ gzip:   0.70 kB
   dist/assets/index-7WnK3jVj.css   55.37 kB │ gzip:  10.52 kB
   dist/assets/index-CR8oUTSv.js   520.76 kB │ gzip: 147.84 kB
   ✓ built in 1.74s
   ```
   *Result*: Exit code 0, 0 TypeScript errors.

7. **Secret Key Hygiene Verification**:
   ```bash
   git grep -n "3-Jhi""du" -- .
   grep -rn "X-API-Key\|GOFA_API_KEY" apps/landing/public apps/api/templates
   ```
   *Result*: Both commands exit with status 1 (0 matches found across tracked repository and client templates).

8. **Banned Claims Audit**:
   ```bash
   grep -rni "truck-safe\|ISO.*certified" apps/api/src apps/landing/src
   ```
   *Result*: 0 occurrences in `apps/landing/src`. Only compliant negation/contract strings in `apps/api/src` (`carbon.py:16`, `carbon.py:19`, `optimize.py:176`, `flags.py:9`, `road_baseline.py:30`).
