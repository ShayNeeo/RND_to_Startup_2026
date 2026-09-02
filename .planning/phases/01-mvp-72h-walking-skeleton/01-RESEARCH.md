# Phase 1: 72h Walking Skeleton - Research

**Researched:** 2026-09-02
**Domain:** FastAPI + SQLite heuristic VRP + Flutter driver + Leaflet OSM dispatcher (zero paid map APIs)
**Confidence:** HIGH (locked stack + official docs + primary GLEC/IPCC/DESNZ files); MEDIUM on Flutter device demo path (no emulator running now)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

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

### the agent's Discretion
- Exact Flutter folder layout under `apps/mobile-driver`.
- Exact 2-opt iteration cap.
- Whether Nominatim is wired at all if seed xlsx already has lat/lng.
- Hosting: documented `uv run` + `flutter run` is enough; Cloudflare Tunnel optional.

### Deferred Ideas (OUT OF SCOPE)
- Next.js dispatcher (`apps/web-portal`)
- Flutter store
- Live GPS / traffic
- OR-Tools as default
- Goong Vietnam geocoder
- Backhaul suggestions (MVP.xlsx nên có)
- Multi-depot (MVP.xlsx nên có)
- ISO 14083 PDF
- Real SME onboarding
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ORD-01 | Upload `.xlsx` template; validated list or row-level errors | FastAPI `UploadFile` + `python-multipart` + openpyxl; Pydantic row schema |
| ORD-02 | One-command seed 80 HCMC stops + 10 trucks | `uv run python -m greenlogix_api.seed`; SQLite `apps/api/data/greenlogix.db` |
| ORD-03 | Edit/delete order before optimize | PATCH/DELETE `/orders/{id}` + thin HTML form |
| VEH-01 | Plate, type, capacity_kg, fuel, L/100km, ready/maintenance | SQLModel `Vehicle`; seed 10 trucks 500 kg–2 t |
| VEH-02 | Optimize refuses vehicles not `ready` | Solver filters `status==ready` before cluster |
| VRP-01 | Cluster-first then NN + 2-opt; no paid routing | Greedy radius clustering (default); no sklearn/OR-Tools |
| VRP-02 | Capacity respected; overload flagged never silent | Reject/flag at assignment; never plan over capacity_kg |
| VRP-03 | Distance = haversine × `HCMC_CIRCUITY=1.35` | Named constant + README; no distance-matrix API |
| VRP-04 | Depot → stops → depot; time-window secondary sort | NN primary; window_start as tie-break |
| DSP-01 | One HTML: upload, vehicles, Optimize, Leaflet, publish | Jinja2Templates served by FastAPI |
| DSP-02 | OSM tiles; no Mapbox token | Leaflet 1.9.4 CDN + `tile.openstreetmap.org` |
| DRV-01 | Flutter ordered stop list | GET `/driver/route` + PIN `0000` |
| DRV-02 | Chỉ đường opens Google/Apple Maps / `geo:` | `url_launcher` + Maps URLs (no API key) |
| DRV-03 | arrived / delivered / failed writeback | POST `/stops/{id}/status`; dispatcher refresh |
| DRV-04 | Optional photo; status still works if camera blocked | `image_picker` best-effort; skip on permission fail |
| RPT-01 | km, litres, kg CO₂ from L/100km × in-repo factors | `emission_factors.json` (GLEC/IPCC/DESNZ cited) |
| RPT-02 | Before/after vs naive spreadsheet-order greedy fill | D-17 baseline; compute deltas, never hardcode −8–15% |
| COST-01 | Cold start zero third-party keys; Nominatim optional | Seed lat/lng preferred; skip Nominatim wiring |
| COST-02 | README 72h demo script | Commands, seed path, jury click path |
</phase_requirements>

## Project Constraints (from AGENTS.md)

Actionable directives from `/home/shayneeo/.agents/AGENTS.md` (and matching workspace rules). Planner MUST NOT emit plans that violate these.

- **Python:** `uv` only (`uv venv`, `uv add`, `uv run`, `uv sync`). `pip` and `python -m venv` are prohibited.
- **JS:** `pnpm` for workspace deps; `bun`/`bunx` for standalone. `npm install` and `yarn` are prohibited. Do **not** add Leaflet via pnpm — dispatcher uses CDN.
- **RTK:** prefix noisy shell with `rtk` when available (`rtk git status`, `rtk pytest`).
- **YAGNI / Ponytail:** minimum working code; reuse stdlib (`math` for haversine, no geopy/numpy/pandas).
- **Multi-contributor:** Thanh + Chiến ⇒ Change Request **before** code. File `CR-YYYYMMDD-XXX.md`. Isolated worktrees (`../repo-cr001-api`, `../repo-cr001-flutter`) and branches `cr/001-api`, `cr/001-flutter`. Commits: `CR: CR-YYYYMMDD-XXX`, `Task: T-XX`, `Worktree: WT-XX`.
- **Graphify:** query AST graph before editing shared types/OpenAPI. Repo graph lives at `graphify-out/graph.json` (GSD `.planning/graphs` is absent; `graphify.enabled` is false — treat semantic edges as approximate).
- **Closed loop:** tests/gates before claiming done. Do not commit until verifier pass if executing.
- **No Next.js portal, K8s, PostGIS, paid APIs** this phase (also CONTEXT deferred).

**Stale README trap:** `apps/mobile-driver/README.md` still describes a React PWA. **D-12 overrides it.** Overwrite with Flutter; do not implement the README stack. `apps/web-portal/README.md` is future — do not build.

## Summary

GreenLogix Phase 1 is a two-person, 72-hour walking skeleton: Chiến ships FastAPI + SQLite + heuristic VRP + CO₂ + one Jinja/Leaflet dispatcher page; Thanh ships a Flutter driver that lists published stops, deep-links to OS maps, and writes status back. The contest demo is the documented 80-order / 10-truck inner-HCMC food-distributor case. Zero billed map, routing, traffic, or carbon APIs.

Existing repo code is landing-only. `apps/api` does not exist. `packages/shared-types` is a README. Graph communities (VRPTW, GLEC, map-vendor OPEX, driver-web GPS) are **planning docs**, not implementations. Hour 0–4 must freeze OpenAPI so the two worktrees do not thrash a third contract.

**Primary recommendation:** `uv python pin 3.12` in `apps/api`; `uv add fastapi "uvicorn[standard]" sqlmodel openpyxl jinja2 python-multipart httpx`; seed xlsx **with lat/lng** (do not wire Nominatim); greedy-radius cluster + NN + 2-opt; Leaflet 1.9.4 CDN + OSM tiles; Flutter `http` + `url_launcher` + optional `image_picker`; dump `apps/api/openapi.json` at hour 4; Thanh hand-writes Dart models from that file.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Excel ingest + row validation | API / Backend (FastAPI) | SQLite | File parse and Pydantic errors belong on the server |
| Seed 80/10 HCMC | API / Backend (CLI) | SQLite | One command writes `greenlogix.db` |
| Order CRUD before optimize | API / Backend | Browser (Jinja forms) | HTML is a thin client of the same API |
| Vehicle registry + ready filter | API / Backend | SQLite | VEH-02 is server-side, never Flutter |
| Haversine × 1.35 matrix | API / Backend | — | Solver-only; do not recompute in Flutter |
| Cluster + NN + 2-opt + baseline | API / Backend | — | Explainable CPU work; 80 stops is instant |
| CO₂ / litres / before-after | API / Backend | `emission_factors.json` | Single formula; dispatcher only displays |
| Dispatcher map (routes) | Frontend Server (Jinja HTML) | CDN OSM tiles | Same origin as API; Leaflet in the browser |
| Publish to drivers | API / Backend | SQLite | Publication is a server state transition |
| Driver stop list | Flutter client | API GET | Thanh owns UI; Chiến owns JSON |
| Chỉ đường / turn-by-turn | Flutter client → OS Maps | — | Deep-link only; no in-app SDK |
| Status + optional POD photo | Flutter client | API + local disk | Write hits API; photo skippable |
| Demo auth (Bearer DEMO / PIN 0000) | API / Backend | Flutter login field | Flag-gated; not a product IdP |
| Optional Nominatim | API / Backend | Disk cache | Skip if seed has lat/lng |
| Landing / Next.js portal | — | — | Out of scope |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Python | **3.12.13** (pin; 3.12+ lock) | Runtime | D-10. System python is 3.14.7 — do **not** use it. `uv python pin 3.12` [VERIFIED: local uv python list] |
| FastAPI | **0.141.1** | HTTP + OpenAPI | Official `uv add fastapi` [CITED: fastapi.tiangolo.com] [VERIFIED: pypi.org JSON 2026-09-02] |
| uvicorn[standard] | **0.52.4** | ASGI server | Official pair with FastAPI [CITED: sqlmodel.tiangolo.com/tutorial/fastapi/simple-hero-api] |
| python-multipart | **0.0.32** | `multipart/form-data` uploads | Required for `UploadFile` [CITED: fastapi.tiangolo.com/tutorial/request-files] |
| SQLModel | **0.0.42** | SQLite tables + Pydantic | FastAPI author's ORM; `check_same_thread=False` documented [CITED: sqlmodel.tiangolo.com] |
| SQLAlchemy | **2.0.52** (transitive) | Engine | Pulled by SQLModel; do not add separately unless pinning |
| openpyxl | **3.1.5** | Read/write xlsx | Official Excel library; datetime cells → naive Python datetimes [CITED: openpyxl.readthedocs.io] |
| Jinja2 | **3.1.6** | Dispatcher HTML | `fastapi.templating.Jinja2Templates` [CITED: fastapi.tiangolo.com/advanced/templates] |
| Pydantic | **2.13.5** (transitive) | Request/row validation | Comes with FastAPI 0.141 |
| Flutter SDK | **3.47.2** stable / Dart **3.13.2** | Driver app | D-12 [VERIFIED: `flutter --version`] |
| http (Dart) | **1.6.0** | API client | dart-lang official; not dio [VERIFIED: pub.dev API] |
| url_launcher | **6.3.2** | Maps / `geo:` / tel | Flutter first-party [CITED: pub.dev/packages/url_launcher] |
| Leaflet | **1.9.4** (CDN, not npm) | Dispatcher map | Latest stable (2.0 is alpha) [CITED: leafletjs.com/download.html] |
| SQLite | **3.53.4** (system) | `apps/api/data/greenlogix.db` | D-11 [VERIFIED: `sqlite3 --version`] |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| httpx | **0.28.1** | Nominatim client | Only if Nominatim is wired; seed-with-coords ⇒ **do not add** |
| image_picker | **1.2.3** | POD photo | DRV-04 optional; add in hour 24–48 if camera works |
| pytest | **9.1.1** | Solver + ingest unit tests | Dev dep via `uv add --dev pytest` |
| ruff | **0.16.5** | Lint | Dev dep |
| maps_launcher | 3.0.0+1 (pub 2024-12-27) | Thin wrapper over url_launcher | **Do not add.** Use `url_launcher` directly. Third-party, last publish 2024-12, SDK `<4.0.0` [VERIFIED: pub.dev API] |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| SQLModel | SQLAlchemy 2 + separate Pydantic | More boilerplate; worse for 72h |
| Greedy radius cluster | sklearn KMeans / OR-Tools | Extra deps; D-16 default must run without OR-Tools. `ortools` 9.15.6755 exists on PyPI but is **not** the default path |
| Dart `http` | dio 5.11.0 | dio is fine but extra API surface; YAGNI |
| url_launcher | maps_launcher | Wrapper is stale vs Flutter 3.47 |
| OSM tiles | Mapbox / MapLibre token | Forbidden (D-04/D-05) |
| Nominatim | Goong / Google Geocoding | Forbidden |
| Leaflet CDN | pnpm `leaflet` | Would couple API HTML to JS workspace; CDN is correct |

**Installation (Chiến — API):**

```bash
mkdir -p apps/api
cd apps/api
uv python pin 3.12
uv init --name greenlogix-api --package
uv add fastapi "uvicorn[standard]" sqlmodel openpyxl jinja2 python-multipart
uv add --dev pytest ruff
# httpx only if Nominatim is actually wired
```

**Installation (Thanh — Flutter):**

```bash
cd apps/mobile-driver
flutter create --org vn.greenlogix --project-name mobile_driver --platforms=android,ios .
flutter pub add http url_launcher
# later, if camera demo works:
flutter pub add image_picker
```

Do **not** `npm install` Leaflet. Do **not** `pip install`.

**Version verification (this session):** pypi.org JSON + pub.dev API + `uv python list` + `flutter --version` on 2026-09-02.

## Package Legitimacy Audit

Seam `gsd-tools query package-legitimacy check --ecosystem pypi` returned **SUS** for every package with reason `unknown-downloads` (and `too-new` on packages whose *latest* release is 2026). PyPI download counts were `null`. That is a stats-gap, not slopsquat: every core package is named in **official FastAPI/SQLModel/Leaflet/Flutter docs** and has a real upstream repo.

| Package | Registry | Age / latest | Downloads | Source Repo | Verdict (seam) | Disposition |
|---------|----------|--------------|-----------|-------------|----------------|-------------|
| fastapi | PyPI | latest 0.141.1 (2026-07-29) | unknown | github.com/fastapi/fastapi | SUS (unknown-downloads) | **Approved** — official docs |
| uvicorn | PyPI | 0.52.4 (2026-08-19) | unknown | github.com/Kludex/uvicorn | SUS | **Approved** |
| python-multipart | PyPI | 0.0.32 (2026-06-04) | unknown | github.com/Kludex/python-multipart | SUS | **Approved** |
| sqlmodel | PyPI | 0.0.42 (2026-08-28) | unknown | github.com/fastapi/sqlmodel | SUS | **Approved** |
| sqlalchemy | PyPI | 2.0.52 (transitive) | unknown | github.com/sqlalchemy/sqlalchemy | SUS | **Approved** (transitive) |
| openpyxl | PyPI | 3.1.5 (2024-06-28) | unknown | foss.heptapod.net/openpyxl/openpyxl | SUS | **Approved** |
| jinja2 | PyPI | 3.1.6 (2025-03-05) | unknown | github.com/pallets/jinja | SUS | **Approved** |
| httpx | PyPI | 0.28.1 | unknown | github.com/encode/httpx | SUS | Approved **only if Nominatim wired** |
| pydantic | PyPI | 2.13.5 (transitive) | unknown | github.com/pydantic/pydantic | SUS | **Approved** (transitive) |
| pytest | PyPI | 9.1.1 | unknown | github.com/pytest-dev/pytest | SUS | **Approved** (dev) |
| ruff | PyPI | 0.16.5 | unknown | github.com/astral-sh/ruff | SUS | **Approved** (dev) |
| url_launcher | pub.dev | 6.3.2 | n/a (Dart) | github.com/flutter/packages | n/a (not pypi) | **Approved** |
| http | pub.dev | 1.6.0 | n/a | github.com/dart-lang/http | n/a | **Approved** |
| image_picker | pub.dev | 1.2.3 | n/a | github.com/flutter/packages | n/a | **Approved** (optional) |
| maps_launcher | pub.dev | 3.0.0+1 | n/a | github.com/pikaju/flutter-maps-launcher | n/a | **REMOVED** — use url_launcher |
| ortools | PyPI | 9.15.6755 | unknown | developers.google.com/optimization | not in default install | **Do not add** (D-16 default path) |

**Packages removed due to [SLOP] verdict:** none (seam did not return SLOP).
**Packages flagged as suspicious [SUS]:** all PyPI rows above — **planner: do not insert `checkpoint:human-verify` for FastAPI/SQLModel/openpyxl/Jinja2/uvicorn.** Those names came from official docs, not web search. Optional `httpx` is the only add that should be skipped unless Nominatim is in scope.

*Dart packages are not covered by the pypi legitimacy seam. url_launcher / http / image_picker are first-party Flutter/dart-lang.*

## Architecture Patterns

### System Architecture Diagram

```
Excel/seed xlsx (lat,lng,kg,window,phone)
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│  FastAPI  (Chiến)  uv run uvicorn --host 0.0.0.0:8000   │
│  GREENLOGIX_DEMO=1                                      │
│                                                         │
│  POST /orders/import ──► openpyxl ──► Pydantic rows     │
│                         missing lat? ──► 400 row error  │
│                         (Nominatim OFF by default)      │
│  SQLite  apps/api/data/greenlogix.db                    │
│                                                         │
│  POST /optimize                                         │
│    ready vehicles only                                  │
│    cluster (greedy radius on lat/lng)                   │
│    NN sequence + 2-opt (cap 500)                        │
│    baseline: spreadsheet order, greedy fill (D-17)      │
│    dist = haversine * HCMC_CIRCUITY(1.35)               │
│    CO2 = km * (L/100km)/100 * kg_co2_per_litre          │
│                                                         │
│  GET /dispatcher ── Jinja HTML ── Leaflet 1.9.4 CDN     │
│                         │                               │
│                         ▼                               │
│              OSM tiles (HTTPS, attribution)             │
│              polylines from /routes JSON                │
│              [Publish] ──► POST /routes/publish         │
└─────────────┬──────────────────────────▲────────────────┘
              │ OpenAPI / JSON           │ status + photo
              ▼                          │
┌─────────────────────────────────────────────────────────┐
│  Flutter  (Thanh)  flutter run                          │
│  PIN 0000 → GET /driver/route                           │
│  List stops → [Chỉ đường]                               │
│       url_launcher:                                     │
│         https://www.google.com/maps/dir/?api=1&destination=lat,lng
│         http://maps.apple.com/?daddr=lat,lng            │
│         geo:lat,lng?q=lat,lng(label)                    │
│  [Đã đến / Đã giao / Thất bại] → POST /stops/{id}/status│
│  camera? image_picker else skip                         │
└─────────────────────────────────────────────────────────┘
```

**Hour 0–4 contract freeze (file ownership seam):**

1. Chiến scaffolds FastAPI with the path operations below (empty bodies OK) and writes `apps/api/openapi.json` via `app.openapi()`.
2. Commit that file. Thanh copies shapes into `lib/models/` by hand (do **not** spend hours on `openapi-generator`).
3. After hour 4, breaking field renames require a ping in the CR. Additive fields are OK.
4. Do **not** also invent a parallel TS package unless leftover time. D-15: OpenAPI **or** `packages/shared-types`, not a third contract. **Use checked-in `apps/api/openapi.json` as the contract.** Optional: copy JSON Schema names into `packages/shared-types` later.

**Frozen HTTP surface (hour 4):**

| Method | Path | Auth | Owner |
|--------|------|------|-------|
| GET | `/health` | none | Chiến |
| GET | `/openapi.json` | none | Chiến |
| GET | `/dispatcher` | Bearer `DEMO` | Chiến HTML |
| POST | `/seed` | Bearer `DEMO` | Chiến |
| POST | `/orders/import` | Bearer `DEMO` | Chiến |
| GET | `/orders` | Bearer `DEMO` | both |
| PATCH | `/orders/{id}` | Bearer `DEMO` | Chiến |
| DELETE | `/orders/{id}` | Bearer `DEMO` | Chiến |
| GET | `/vehicles` | Bearer `DEMO` | both |
| PATCH | `/vehicles/{id}` | Bearer `DEMO` | Chiến |
| POST | `/optimize` | Bearer `DEMO` | Chiến |
| GET | `/routes` | Bearer `DEMO` | both |
| POST | `/routes/publish` | Bearer `DEMO` | Chiến |
| GET | `/report` | Bearer `DEMO` | Chiến |
| GET | `/driver/route` | header `X-Driver-Pin: 0000` | Thanh |
| POST | `/stops/{id}/status` | PIN | Thanh |
| POST | `/stops/{id}/photo` | PIN | Thanh (optional) |

Reject all of the above with 401 unless `GREENLOGIX_DEMO=1`.

**CORS:** Native Flutter does **not** use CORS. Jinja dispatcher is **same-origin**. CORS only matters for `flutter run -d chrome`. Demo config:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,  # MUST be False with "*"
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Do **not** combine `allow_origins=["*"]` with `allow_credentials=True` — FastAPI/Starlette forbids it and it drops `Authorization`. [CITED: fastapi.tiangolo.com/tutorial/cors]

**SQLite location:** `apps/api/data/greenlogix.db` (D-11). Create `data/` on startup. `connect_args={"check_same_thread": False}`. [CITED: sqlmodel.tiangolo.com/tutorial/fastapi/simple-hero-api]

**Seed command:**

```bash
GREENLOGIX_DEMO=1 uv run python -m greenlogix_api.seed
# or: curl -H "Authorization: Bearer DEMO" -X POST http://127.0.0.1:8000/seed
```

Seed xlsx lives at `apps/api/data/seed/hcmc_80_orders.xlsx` + `hcmc_10_trucks.xlsx`. Coordinates: real-ish inner HCMC (Q1, Q3, Bình Thạnh, Phú Nhuận, Q7, Thủ Đức). Depot: pick one inner-city warehouse and freeze it in seed + README (recommendation: 10.801, 106.661 — Tân Bình / Hoàng Văn Thụ food-DC-ish). Spread stops across the five clusters so Leaflet is not a blob.

**Uvicorn bind:** `--host 0.0.0.0 --port 8000` so a phone on LAN and the Android emulator can reach it. `--host 127.0.0.1` breaks emulator/`10.0.2.2`.

### Recommended Project Structure

```
apps/api/
├── pyproject.toml
├── .python-version          # 3.12
├── README.md                # 72h demo script (COST-02)
├── openapi.json             # frozen contract (hour 4)
├── templates/
│   └── dispatcher.html      # one page, Leaflet CDN
├── data/
│   ├── greenlogix.db        # gitignore
│   ├── emission_factors.json
│   ├── nominatim_cache.json # empty {} if unused
│   ├── uploads/             # POD photos, gitignore
│   └── seed/
│       ├── hcmc_80_orders.xlsx
│       └── hcmc_10_trucks.xlsx
├── src/greenlogix_api/
│   ├── main.py              # app, CORS, lifespan, auth deps
│   ├── db.py                # engine, Session, create_all
│   ├── models.py            # SQLModel tables
│   ├── schemas.py           # request/response (non-table)
│   ├── auth.py              # DEMO bearer + PIN, env gate
│   ├── ingest_xlsx.py
│   ├── carbon.py
│   ├── seed.py
│   ├── solver/
│   │   ├── distance.py      # haversine, HCMC_CIRCUITY
│   │   ├── cluster.py       # greedy radius
│   │   ├── nn_two_opt.py
│   │   └── baseline.py      # D-17
│   └── routers/
│       ├── orders.py
│       ├── vehicles.py
│       ├── optimize.py
│       ├── driver.py
│       └── report.py
└── tests/
    ├── test_distance.py
    ├── test_solver.py
    └── test_ingest.py

apps/mobile-driver/
├── pubspec.yaml
├── README.md                # replace PWA text
├── lib/
│   ├── main.dart
│   ├── api/client.dart      # base URL via --dart-define
│   ├── models/              # hand-written from openapi.json
│   └── screens/
│       ├── pin_screen.dart
│       ├── route_list.dart
│       └── stop_detail.dart
├── android/app/src/debug/AndroidManifest.xml
└── android/app/src/debug/res/xml/network_security_config.xml
```

Flat layout on purpose. Do **not** copy the 8-layer FastAPI skill template (repositories/services/api/v1) — 72h cannot afford it.

### Pattern 1: OpenAPI is the only shared contract
**What:** Chiến publishes `GET /openapi.json` and a checked-in dump. Thanh consumes JSON. No GraphQL, no shared Dart package, no extra TS SDK.
**When to use:** Hour 0–4 and any later field add.

### Pattern 2: SQLModel table + FastAPI session
**What:** `SQLModel, table=True` + `Session(engine)` per request. SQLite `check_same_thread=False`.
**When to use:** All persistence.

### Pattern 3: Dispatcher is server HTML, not a SPA
**What:** `Jinja2Templates` + one `dispatcher.html`. Leaflet JS inline. Fetch `/optimize` JSON and draw polylines. No React, no HTMX required (plain `fetch` is enough).
**When to use:** DSP-01/02.

### Pattern 4: Maps deep-link, not an SDK
**What:** `launchUrl` with `LaunchMode.externalApplication`. Google Maps URLs do **not** need an API key. [CITED: developers.google.com/maps/documentation/urls/get-started]

### Anti-Patterns to Avoid
- **Building `apps/web-portal` Next.js** — D-13 / deferred.
- **Following `apps/mobile-driver/README.md` React PWA** — stale vs D-12.
- **`allow_origins=["*"]` + `allow_credentials=True`** — illegal combo; breaks Bearer.
- **Calling Nominatim for 80 seed rows** — bulk geocode is discouraged; 80 s minimum; risk of ban. [CITED: operations.osmfoundation.org/policies/nominatim]
- **Using `http://tile.openstreetmap.org`** — OSMF requires HTTPS URL. [CITED: operations.osmfoundation.org/policies/tiles]
- **Hardcoding −8–15% on the report** — RPT-02 must compute.
- **Flutter `http://127.0.0.1` on Android emulator** — that is the emulator itself. Use `10.0.2.2`. [CITED: developer.android.com/studio/run/emulator-networking-address]
- **Cleartext HTTP without debug network config** — Flutter disables HTTP on iOS/Android. [CITED: docs.flutter.dev/release/breaking-changes/network-policy-ios-android]
- **Mixing `File()` upload with JSON `Body` on one path** — HTTP multipart vs JSON. [CITED: fastapi.tiangolo.com/tutorial/request-files]
- **Adding pandas/sklearn/geopy/ortools “just in case”**.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| `.xlsx` parse | JSON/CSV regex, zip+XML | **openpyxl** | Datetimes, merged cells, types |
| Map renderer | Canvas/SVG map | **Leaflet 1.9.4** | Tiles, polylines, attribution |
| Turn-by-turn | In-app nav SDK | **OS Maps via url_launcher** | MVP.xlsx already specifies this |
| Simplex / MIP VRP | Custom LP solver | **NN + 2-opt** (not OR-Tools default) | 8 stops/route is tiny; explainable |
| Distance matrix | Paid APIs | **haversine × 1.35** | D-07 |
| CO₂ factors | Invented constants | **`emission_factors.json`** with citations | D-09; graph node “unstandardized CO₂ methodology” is a known contest risk |
| Multipart upload | Manual boundary parser | **python-multipart + UploadFile** | FastAPI requirement |
| HTML templates | `str.format` HTML | **Jinja2Templates** | XSS-ish concat; url_for |
| HTTP client (Dart) | raw `dart:io` | **package:http** | Timeouts, encoding |

**Key insight:** The 72h risk is **integration and demo path**, not algorithm quality. Hand-rolling Excel/maps/nav is how the calendar dies.

## Common Pitfalls

### Pitfall 1: Nominatim 1 req/s + User-Agent
**What goes wrong:** 403/429; OSMF ban; 80-row import takes >80 s and still fails.
**Why:** Public Nominatim AUP: max **1 req/s**, identifying **User-Agent** (stock httpx/urllib UA is invalid), cache required, bulk geocode discouraged. [CITED: operations.osmfoundation.org/policies/nominatim]
**How to avoid:** Seed xlsx **already has lat/lng**. Leave Nominatim unwired (discretion). If wired: `User-Agent: GreenLogix/0.1 (contest demo; contact@local)`, `time.sleep(1)`, disk cache, single thread.
**Warning signs:** Import hangs; logs show `urllib/httpx` UA.

### Pitfall 2: Haversine vs road km (circuity 1.35)
**What goes wrong:** Jury asks “is this real km?” or deltas look magic.
**Why:** Straight-line underestimates urban path length. D-07 locks `HCMC_CIRCUITY=1.35`.
**How to avoid:** Named constant in `distance.py` **and** README. Same factor for baseline and optimized so **deltas are fair**. Do not mix circuity on one side only.
**Warning signs:** Optimized km < crow-flies sum.

### Pitfall 3: Android emulator localhost
**What goes wrong:** Flutter “connection refused” to `127.0.0.1:8000`.
**Why:** On the emulator, `127.0.0.1` is the emulator. Host loopback is **`10.0.2.2`**. [CITED: developer.android.com/studio/run/emulator-networking-address]
**How to avoid:** `--dart-define=API_BASE=http://10.0.2.2:8000` for emulator; LAN IP for physical phone; `127.0.0.1` only for `flutter run -d linux`. Uvicorn `--host 0.0.0.0`.
**Warning signs:** API works in curl on host, fails in app.

### Pitfall 4: Cleartext HTTP blocked
**What goes wrong:** `Insecure HTTP is not allowed by platform`.
**Why:** Flutter disables HTTP on iOS/Android. [CITED: docs.flutter.dev/release/breaking-changes/network-policy-ios-android]
**How to avoid:** Debug-only `network_security_config` with `cleartextTrafficPermitted=true`; iOS debug `NSAllowsArbitraryLoads`. **Never** in release.
**Warning signs:** Exception naming the host.

### Pitfall 5: CORS vs Bearer
**What goes wrong:** Browser preflight fails; Flutter web cannot send `Authorization`.
**Why:** Wildcard origins + credentials. Native Flutter is unaffected.
**How to avoid:** Same-origin dispatcher; CORS `*` with `allow_credentials=False`; allow all headers.
**Warning signs:** OPTIONS 400; missing `Access-Control-Allow-Headers`.

### Pitfall 6: Excel datetime / time-window cells
**What goes wrong:** `08:00` becomes `0.333…` float or a 1899 datetime; windows fail sort.
**Why:** Excel stores times as fractions; openpyxl returns naive `datetime`/`time`; **no timezones** in xlsx. [CITED: openpyxl.readthedocs.io/en/stable/datetime.html]
**How to avoid:** Normalize to `HH:MM` strings in `Asia/Ho_Chi_Minh` (naive). Accept `datetime`, `time`, `str`. Never `str(cell.value)` blindly.
**Warning signs:** `window_start` is `1899-12-30` or `0.375`.

### Pitfall 7: Time-window timezone
**What goes wrong:** UTC conversion shifts morning windows into previous day.
**Why:** Naive Excel times + `datetime.utcnow`.
**How to avoid:** Store naive local; document `TZ=Asia/Ho_Chi_Minh`. No pytz.
**Warning signs:** “early” stops sequenced last.

### Pitfall 8: OSM tile policy / blank map
**What goes wrong:** Grey map; tiles blocked.
**Why:** HTTP tile URL, missing attribution, scraping, no Referer from `file://`.
**How to avoid:** Serve dispatcher from FastAPI (`http://127.0.0.1:8000/dispatcher`); HTTPS tile URL; visible `© OpenStreetMap contributors`. [CITED: leafletjs.com/examples/quick-start + OSMF tile policy]
**Warning signs:** 418/403 on `tile.openstreetmap.org`.

### Pitfall 9: url_launcher package visibility
**What goes wrong:** `canLaunchUrl` is false on Android 11+ / iOS.
**Why:** Missing `<queries>` / `LSApplicationQueriesSchemes`. [CITED: pub.dev/packages/url_launcher]
**How to avoid:** Declare `geo`, `https`, `http`, `google.navigation`; iOS `comgooglemaps`, `maps`. Call `launchUrl` directly and fallback URL-to-URL (Google → Apple → geo).

### Pitfall 10: Capacity silently exceeded
**What goes wrong:** Pretty routes that overload 500 kg vans.
**Why:** Cluster-first without a capacity check.
**How to avoid:** After cluster, if sum(kg) > capacity, split cluster / leave unassigned with `overload: true`. Never drop the flag (VRP-02).

### Pitfall 11: Photo blocks demo (D-20)
**What goes wrong:** Camera permission stalls the jury.
**How to avoid:** Status works with photo = null. Catch permission errors.

### Pitfall 12: Two builders, one README
**What goes wrong:** Merge conflicts on OpenAPI and README.
**How to avoid:** CR + two worktrees. Chiến owns `apps/api/**` + `openapi.json`. Thanh owns `apps/mobile-driver/**`. README demo script is Chiến’s last hour, Thanh adds Flutter commands in a dedicated section.

## Code Examples

Verified patterns from official sources (trimmed).

### Haversine × HCMC circuity

```python
# apps/api/src/greenlogix_api/solver/distance.py
import math

HCMC_CIRCUITY = 1.35  # D-07; document in README

def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlmb = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dlmb / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))

def road_km(lat1, lon1, lat2, lon2) -> float:
    return haversine_km(lat1, lon1, lat2, lon2) * HCMC_CIRCUITY
```

### FastAPI xlsx upload → openpyxl

```python
# Source: https://fastapi.tiangolo.com/tutorial/request-files/
from typing import Annotated
from fastapi import FastAPI, File, UploadFile, HTTPException
from openpyxl import load_workbook

@app.post("/orders/import")
def import_orders(file: Annotated[UploadFile, File()]):
    name = (file.filename or "").lower()
    if not name.endswith(".xlsx"):
        raise HTTPException(400, "xlsx only")
    # UploadFile.file is a SpooledTemporaryFile — pass to openpyxl
    wb = load_workbook(file.file, data_only=True, read_only=True)
    ws = wb.active
    rows = []
    for i, row in enumerate(ws.iter_rows(min_row=2, values_only=True), start=2):
        rows.append({"excel_row": i, "values": row})
    return {"n": len(rows)}
```

Install: `uv add python-multipart` first. [CITED: fastapi.tiangolo.com/tutorial/request-files]

### SQLModel SQLite engine

```python
# Source: https://sqlmodel.tiangolo.com/tutorial/fastapi/simple-hero-api/
from sqlmodel import SQLModel, Session, create_engine

sqlite_url = "sqlite:///./data/greenlogix.db"
engine = create_engine(
    sqlite_url,
    connect_args={"check_same_thread": False},
)
```

### url_launcher Maps deep-link

```dart
// Source: https://pub.dev/packages/url_launcher
// Google Maps URLs need no API key:
// https://developers.google.com/maps/documentation/urls/get-started
import 'package:url_launcher/url_launcher.dart';

Future<void> openChiDuong(double lat, double lng, String label) async {
  final google = Uri.parse(
    'https://www.google.com/maps/dir/?api=1&destination=$lat,$lng',
  );
  final apple = Uri.parse('http://maps.apple.com/?daddr=$lat,$lng');
  final geo = Uri.parse('geo:$lat,$lng?q=$lat,$lng(${Uri.encodeComponent(label)})');
  for (final uri in [google, apple, geo]) {
    if (await launchUrl(uri, mode: LaunchMode.externalApplication)) return;
  }
}
```

### Leaflet OSM + polyline from API JSON

```javascript
// Source: https://leafletjs.com/examples/quick-start/
const map = L.map('map').setView([10.776, 106.700], 12);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// routes = GET /routes  [{color, stops:[{lat,lng}, ...]}]
for (const route of routes) {
  const latlngs = route.stops.map(s => [s.lat, s.lng]);
  L.polyline(latlngs, { color: route.color || 'blue' }).addTo(map);
}
```

CDN (put CSS **before** JS): [CITED: leafletjs.com/download.html]

```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
  integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
<div id="map" style="height: 480px;"></div>
```

### Dump OpenAPI at hour 4

```python
# uv run python -c "from greenlogix_api.main import app; import json; json.dump(app.openapi(), open('openapi.json','w'), indent=2)"
```

[CITED: fastapi.tiangolo.com/how-to/extending-openapi]

## Emission factors

Put this file at `apps/api/data/emission_factors.json`. Formula (D-09):

`kg_co2 = road_km * (l_per_100km / 100.0) * kg_co2_per_litre`

If the vehicle stores `km_per_litre` instead: `l_per_100km = 100 / km_per_litre`.

**Use tank-to-wheel CO₂ (combustion), not WTW CO₂e.** Full GLEC/ISO 14083 WTW packs are deferred. Label the dispatcher “ước tính TTW CO₂ (IPCC/GLEC factors)” so the jury is not told it is an auditor pack.

| Fuel | `kg_co2_per_litre` | How derived | Sources |
|------|--------------------|-------------|---------|
| petrol / xăng / gasoline | **2.31** | IPCC 2006 Vol.2 Table 1.4 Motor Gasoline **69 300 kg CO₂/TJ** × Table 1.2 NCV **44.3 TJ/Gg** × density **0.74 kg/L** ≈ 2.27–2.36; round **2.31** | [VERIFIED: IPCC 2006 Vol.2 Ch.1 Table 1.4 PDF] [VERIFIED: GLEC Framework v3.2 p.77 gasoline density 0.74 kg/L, TTW 3.19 kgCO₂e/kg → 2.36 kgCO₂e/L] |
| diesel / dầu | **2.68** | IPCC 2006 Vol.2 Table 1.4 Gas/Diesel Oil **74 100 kg CO₂/TJ** × Table 1.2 NCV **43.0 TJ/Gg** × density **0.83–0.84 kg/L** ≈ 2.64–2.68 | [VERIFIED: same IPCC tables] [VERIFIED: GLEC v3.2 p.77 diesel density 0.83 kg/L, TTW 3.22 kgCO₂e/kg → 2.67 kgCO₂e/L] |

**Cross-check (do not replace the in-repo defaults without a comment):** UK DESNZ GHG Conversion Factors 2025 condensed set, sheet `Fuels`, 100% mineral, **kg CO₂ per litre** (column “kg CO2e of CO2 per unit”): petrol **2.32567**, diesel **2.62818**. [VERIFIED: downloaded `ghg-conversion-factors-2025-condensed-set.xlsx` 2026-09-02]

GLEC v3.2 worked example uses **3.36 kgCO₂e/L WTW** diesel with 5% biodiesel — that is **WTW CO₂e**, not our TTW CO₂ default. Do not drop 3.36 into the JSON without renaming the field. [VERIFIED: GLEC v3.2 p.116]

```json
{
  "boundary": "tank_to_wheel",
  "gas": "CO2",
  "note": "Contest estimate, not ISO 14083 pack. Same factors applied to baseline and optimized.",
  "HCMC_CIRCUITY": 1.35,
  "fuels": {
    "petrol": {
      "kg_co2_per_litre": 2.31,
      "aliases": ["xăng", "gasoline", "petrol"],
      "source": "IPCC 2006 Vol.2 Table 1.4 Motor Gasoline 69300 kgCO2/TJ × Table 1.2 NCV 44.3 TJ/Gg × 0.74 kg/L; GLEC v3.2 Europe TTW cross-check 2.36 kgCO2e/L"
    },
    "diesel": {
      "kg_co2_per_litre": 2.68,
      "aliases": ["dầu", "DO", "diesel"],
      "source": "IPCC 2006 Vol.2 Table 1.4 Gas/Diesel Oil 74100 kgCO2/TJ × Table 1.2 NCV 43.0 TJ/Gg × 0.83 kg/L; GLEC v3.2 Europe TTW cross-check 2.67 kgCO2e/L"
    }
  }
}
```

## 72h task split recommendation

Wall clock **72 hours**. Cut scope, do not extend (D-03). Two worktrees after CR.

**Discretion recommendations (lock these in the plan unless user objects):**
- Flutter layout: `lib/{api,models,screens}` as above.
- 2-opt cap: **500 iterations or first local minimum**, hard stop 2000 swaps. 8 stops/route is tiny.
- Nominatim: **do not wire**. Seed has lat/lng. Paste-Maps-URL parser in dispatcher HTML is enough for a live edit.
- Hosting: `uv run` + `flutter run` only. Cloudflare Tunnel = leftover only.

### Wave 0 — Hours 0–4 (both, blocking)

| Who | Hours | Work |
|-----|-------|------|
| Both | 0–1 | `CR-20260902-001.md`; worktrees `WT-01` API / `WT-02` Flutter |
| Chiến | 1–4 | `uv python pin 3.12`; FastAPI skeleton; empty routes in the freeze table; dump `openapi.json`; CORS; `GREENLOGIX_DEMO` auth stubs; `/health` |
| Thanh | 1–4 | `flutter create`; `http` + `url_launcher`; Dart models from `openapi.json`; PIN screen; `--dart-define=API_BASE` |

**Exit:** Thanh can `GET /health`. OpenAPI file committed.

### Wave 1 — Hours 4–24 = ROADMAP 01-01 tracer

| Who | Work | Reqs |
|-----|------|------|
| Chiến | SQLModel tables; seed 80/10 xlsx with inner-HCMC coords; import + row errors; vehicles; greedy cluster + NN + 2-opt + D-17 baseline; `emission_factors.json`; Jinja dispatcher: upload, Optimize, Leaflet polylines | ORD-01/02, VEH-01/02, VRP-01..04, DSP-01/02, RPT-01 (numbers on page even if Flutter missing) |
| Thanh | PIN `0000` → mock then live `GET /driver/route`; ordered list UI (address, phone, window, notes) | DRV-01 |

**Exit:** Seed → Optimize → map shows 10 colored routes. Flutter shows **some** list (even if publish is stubbed via seed `published=true`).

### Wave 2 — Hours 24–48 = ROADMAP 01-02

| Who | Work | Reqs |
|-----|------|------|
| Chiến | `POST /routes/publish`; `POST /stops/{id}/status` visible on dispatcher refresh; report JSON + HTML before/after %; optional photo endpoint; bind `0.0.0.0` | DRV-03, RPT-02, DSP publish |
| Thanh | Chỉ đường deep-link (Google → Apple → geo); status buttons; Android `<queries>` + debug cleartext; `10.0.2.2` documented | DRV-02, DRV-03 |

**Exit:** Mark delivered on phone → dispatcher list updates. Maps app opens.

### Wave 3 — Hours 48–72 = ROADMAP 01-03

| Who | Work | Reqs |
|-----|------|------|
| Chiến | README jury script; COST freeze (no keys in `.env`); polish seed spread; unassigned/overload flags; `uv run` one-liners | COST-01/02, ORD-03 if not done |
| Thanh | Optional `image_picker`; failure-reason enum; Linux-desktop fallback if no phone | DRV-04 |
| Both | Full loop on 80/10; screenshot for contest; cut remaining polish | all must_haves |

**Cut order if behind (do not slip calendar):**
1. Nominatim (already off)
2. DRV-04 photo
3. ORD-03 HTML (keep API PATCH/DELETE)
4. Cloudflare Tunnel
5. `packages/shared-types` TS
6. Dispatcher drag-and-drop (MVP.xlsx bắt buộc “kéo–thả” — **cut** if needed; confirm+publish without edit still demos)

### Parallel file ownership

| Path | Owner |
|------|-------|
| `apps/api/**` | Chiến WT-01 |
| `apps/api/openapi.json` | Chiến (Thanh read-only after h4) |
| `apps/mobile-driver/**` | Thanh WT-02 |
| `apps/landing/**` | nobody this phase |
| `apps/web-portal/**` | nobody |
| root `README.md` demo section | Chiến, Thanh supplies Flutter commands |

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Paid Google/Mapbox matrix | Haversine × circuity | this phase lock | $0 OPEX |
| OR-Tools as default VRP | NN + 2-opt after geographic cluster | D-16 | Offline, explainable |
| Next.js dispatcher | Jinja HTML on FastAPI | D-13 | One process to demo |
| Driver PWA (README) | Flutter sideload | D-12 | User lock |
| GLEC WTW CO₂e pack | TTW kgCO₂/L × litres | D-09 / deferred ISO | Honest contest number |
| Leaflet 2.0 alpha | Leaflet **1.9.4** stable | 2.0 still alpha as of leafletjs.com/download | Use 1.9.4 CDN |
| FastAPI `on_event("startup")` | `lifespan=` also OK | SQLModel tutorial still shows `on_event` | Either works; lifespan is current FastAPI style [ASSUMED: deprecation warning on 0.141] |

**Deprecated/outdated:**
- Mapbox token in dispatcher — forbidden.
- `maps_launcher` as required dep — skip.
- Nominatim bulk import — against AUP.
- System Python 3.14 for the API — pin 3.12.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | FastAPI 0.141 still accepts SQLModel tutorial `on_event("startup")` | Standard Stack | Use `lifespan` if startup hook warns |
| A2 | `flutter create` in existing `apps/mobile-driver` (README only) will not clobber needed files | Architecture | Backup README first |
| A3 | Jury phone has Google Maps or Apple Maps installed | Pitfalls / 72h | Keep `geo:` fallback; test on emulator |
| A4 | Inner-HCMC seed with 1.35 circuity will show a **non-zero** km delta vs spreadsheet order | RPT-02 | If delta ≈ 0, scramble seed order (naive path zig-zags districts) — do not fake % |
| A5 | Linux `flutter run -d linux` is acceptable as API-integration fallback; Maps deep-link still needs Android/iOS | Environment | Contest demo should use a phone |

**If this table is empty:** n/a — five assumptions need user/plan awareness, not a discuss-phase re-litigation of D-01..D-20.

## Open Questions (RESOLVED)

1. **Demo device?** — **RESOLVED.** 01-02 `user_setup` `android-avd-or-phone`: Thanh starts an AVD or plugs a phone by hour 24. Linux desktop is HTTP integration only; Chỉ đường is proven by URL unit tests plus a device when present.

2. **Exact depot lat/lng?** — **RESOLVED.** Freeze depot `10.801, 106.661` (Tân Bình) in seed.py (`DEPOT_LAT` / `DEPOT_LNG`) and README.

3. **xlsx column headers (Vietnamese vs English)?** — **RESOLVED.** Ingest accepts bilingual headers: `địa chỉ`/`address`, `vĩ độ`/`lat`, `kinh độ`/`lng`, `người nhận`/`receiver`, `SĐT`/`phone`, `khối lượng`/`kg`, `giờ bắt đầu`/`window_start`, `giờ kết thúc`/`window_end`, `loại hàng`/`cargo_type`, `ghi chú`/`notes`.

4. **One PIN for all 10 trucks or PIN=vehicle index?** — **RESOLVED.** PIN `0000` returns all published routes grouped by plate; optional query `?plate=51C-000.03`. No per-truck PIN.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| uv | API install | ✓ | 0.12.7 | — |
| Python 3.12 | D-10 pin | ✓ | 3.12.13 via uv | Do not use system 3.14.7 |
| Python 3.14 (system) | — | ✓ | 3.14.7 | **Do not pin the API to this** |
| Flutter | Driver | ✓ | 3.47.2 stable | — |
| Dart | Driver | ✓ | 3.13.2 | — |
| pnpm | Landing only | ✓ | 10.5.2 | Do not use for API |
| bun | optional JS | ✓ | 1.3.14 | unused this phase |
| sqlite3 | inspect db | ✓ | 3.53.4 | — |
| Docker | — | ✓ | 29.7.2 | **Do not introduce** |
| adb | Android | ✓ | /opt/android-sdk | — |
| Android emulator / phone | DRV-02 Maps | ✗ (none connected) | — | Start AVD; or physical phone; Linux desktop cannot deep-link Maps |
| Nominatim public API | optional geocode | network, policy-limited | — | **Don't call**; seed lat/lng |
| Mapbox/Google keys | — | must remain absent | — | — |

**Missing dependencies with no fallback:**
- A connected Android/iOS device for a convincing Chỉ đường demo. Planner must include “start emulator or plug phone” as a Wave 2 task, not assume it.

**Missing dependencies with fallback:**
- Nominatim — skip.
- Camera — skip photo (D-20).

## Security Domain

`security_enforcement` is enabled (ASVS L1). This is a **demo** with hardcoded secrets; controls are about not leaking the demo into something that looks production-safe, and not spraying PII to OSM.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | yes (demo) | `GREENLOGIX_DEMO=1` gate; Bearer `DEMO`; PIN `0000`. 401 if flag off. Never ship flag default-on in a public deploy |
| V3 Session Management | no | No cookies/sessions |
| V4 Access Control | yes (thin) | Dispatcher routes require Bearer; driver routes require PIN; do not let PIN list unpublished drafts |
| V5 Input Validation | yes | Pydantic row schema; xlsx extension + size cap (e.g. 5 MB); `content_type` check; no `eval` of Excel formulas (`data_only=True`) |
| V6 Cryptography | no | No passwords to hash; do not invent JWT |
| V12 File upload | yes | POD photos: uuid filename, store under `data/uploads/`, never use client filename path; MIME image/jpeg\|png; skip if missing |
| V1 Architecture | yes | SQLite file mode 0600; no keys in git |

### Known Threat Patterns for FastAPI + Flutter + SQLite + OSM

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Demo token reused on a public VPS | Elevation | Flag-gated; README “localhost only” |
| Excel formula / XXE | Tampering | openpyxl read; no XML parser of your own; cap rows (e.g. 500) |
| Path traversal in photo filename | Tampering | uuid4 + suffix whitelist |
| PII (phone, address) posted to Nominatim | Information disclosure | Don't geocode if lat/lng present; never send recipient name |
| PII in logs / error traces | Information disclosure | Log order id, not phone [privacy-by-design] |
| Cleartext HTTP on real network | Information disclosure | Debug-only cleartext; contest is local LAN |
| OSM tile scraping | Abuse | Leaflet defaults; no prefetch |
| CORS reflection | Spoofing | `allow_credentials=False` |
| SQL injection | Tampering | SQLModel parameterized queries — never f-string SQL |
| Overloaded vehicle planned silently | Tampering / contest integrity | VRP-02 flags |

Nghị định 13/2023/NĐ-CP is cited in root README: do not put real customer phones in the public seed. Use fictional `09000000xx`.

## Sources

### Primary (HIGH confidence)
- FastAPI request files, CORS, templates, OpenAPI — https://fastapi.tiangolo.com/tutorial/request-files/ https://fastapi.tiangolo.com/tutorial/cors/ https://fastapi.tiangolo.com/advanced/templates/ https://fastapi.tiangolo.com/how-to/extending-openapi/
- SQLModel FastAPI SQLite — https://sqlmodel.tiangolo.com/tutorial/fastapi/simple-hero-api/ https://sqlmodel.tiangolo.com/tutorial/create-db-and-table/
- Leaflet 1.9.4 download + quick start — https://leafletjs.com/download.html https://leafletjs.com/examples/quick-start/
- OSMF Nominatim AUP — https://operations.osmfoundation.org/policies/nominatim/
- OSMF Tile Usage Policy — https://operations.osmfoundation.org/policies/tiles/
- Google Maps URLs (no API key) — https://developers.google.com/maps/documentation/urls/get-started
- url_launcher — https://pub.dev/packages/url_launcher
- openpyxl dates — https://openpyxl.readthedocs.io/en/stable/datetime.html
- Android emulator `10.0.2.2` — https://developer.android.com/studio/run/emulator-networking-address
- Flutter cleartext HTTP — https://docs.flutter.dev/release/breaking-changes/network-policy-ios-android
- IPCC 2006 Guidelines Vol.2 Ch.1 Table 1.4 (69 300 / 74 100 kg CO₂/TJ) — https://www.ipcc-nggip.iges.or.jp/public/2006gl/pdf/2_Volume2/V2_1_Ch1_Introduction.pdf (downloaded this session)
- IPCC 2006 Vol.2 Ch.3 Mobile Combustion Table 3.2.1 — https://www.ipcc-nggip.iges.or.jp/public/2006gl/pdf/2_Volume2/V2_3_Ch3_Mobile_Combustion.pdf
- GLEC Framework v3.2 (21 Oct 2025) Module 1 pp.77–81, 116 — https://smart-freight-centre-media.s3.amazonaws.com/documents/GLEC_FRAMEWORK_v3.2_21_10_25_1.pdf (downloaded this session)
- DESNZ GHG Conversion Factors 2025 condensed xlsx, sheet Fuels — https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2025 (downloaded this session)
- pypi.org JSON + pub.dev API versions 2026-09-02
- Repo: `01-CONTEXT.md`, `REQUIREMENTS.md`, `ROADMAP.md`, `PROJECT.md`, `MVP.xlsx` (converted), `apps/mobile-driver/README.md`

### Secondary (MEDIUM confidence)
- Graphify `graphify-out/graph.json` (852 nodes, 2026-09-02) — landing-only code; map-vendor OPEX risk; GLEC methodology risk. GSD graphify disabled.
- maps_launcher pub.dev (skipped)

### Tertiary (LOW confidence)
- classify-confidence seam rates generic `webfetch` as LOW even for official docs; claims above are dual-sourced to PDFs/xlsx/official HTML to compensate.
- Circuity 1.35 is a **locked decision**, not a measured HCMC factor.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions from pypi/pub.dev + official install docs; Python pin verified locally
- Architecture: HIGH — locked D-01..D-20; existing code is placeholders
- Pitfalls: HIGH — Nominatim/OSM/Flutter HTTP/emulator addresses from primary policies
- Emission factors: HIGH — IPCC + GLEC PDF + DESNZ xlsx extracted this session
- Flutter device demo path: MEDIUM — no phone/emulator connected now

**Research date:** 2026-09-02
**Valid until:** 2026-10-02 (stable FastAPI/Leaflet/IPCC; Flutter 3.47 moves faster)

**Graph note:** `graphify-out/graph.json` built 2026-09-02. No `.planning/graphs/graph.json`. Treat as approximate. Confirmed: no `apps/api` nodes; driver README still “web GPS”; do not plan GPS.
