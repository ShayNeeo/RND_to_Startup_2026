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
   - Live worker defaults to `ROAD_BASELINE=auto` (Valhalla → OSRM → circuity). API/CI default `circuity` unless env is set.

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

No local Valhalla/OSRM Docker image is required. To force OSM on the FastAPI path: `ROAD_BASELINE=auto`. To force truck costing: `ROAD_BASELINE=valhalla ROAD_BASELINE_COSTING=truck`. Self-hosted extract: set `VALHALLA_URL` or `OSRM_URL`.

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
