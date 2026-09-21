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
