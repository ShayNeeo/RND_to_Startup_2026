# GREENLOGIX — Finish, Integrate, QA, and Deploy Plan

**Date:** 2026-09-07 (Asia/Ho_Chi_Minh)  
**Deadline:** end of day 2026-09-07  
**Primary executor today:** Phạm Quốc Thanh (`ShayNeeo`)  
**Chiến:** no additional implementation required today; preserve and integrate his completed PR contribution  
**Repository:** `ShayNeeo/RND_to_Startup_2026`  
**Production rule:** `feature/*` / `cr/*` → `dev` → QA → `stable` → deploy  
**Plan status:** execution-ready

---

## 0. Executive decision

The old 72-hour plan is no longer the right execution plan for today.

The project is already past the original scaffold stage:

- `dev` and `stable` are still on the old baseline `05ae53e...`.
- Chiến has an open PR, **PR #4 `[api] Freeze Wave 0 OpenAPI and demo authentication`**, head `cr/001-api` at `8f0980d...`.
- The functional branch `gsd/01-mvp-walking-skeleton` is already **27 commits ahead of `dev`** and contains the working Phase-1/Phase-2 implementation: API, seed data, optimizer, dispatcher web UI, report, late-risk, report XLSX, and Flutter driver flow.
- The functional branch and Chiến's PR have **diverged** from the same `dev` base. Therefore, blindly merging both branches is likely to create duplicate/conflicting API files.
- The attached GREENLOGIX documents describe the **full product vision**: GPS, live traffic, real-time tracking, backhaul matching, app/web, ESG reporting, etc. Those are not all present in the contest MVP and must **not** be pulled into today's scope.

### Today's goal

Ship one coherent, reproducible, judge-safe MVP that demonstrates this loop:

```text
Excel / seed orders
  → validate orders + vehicles
  → optimize route assignment/order
  → show routes on web dispatcher
  → show before/after km + fuel + CO₂ estimate
  → publish routes
  → driver reads route / updates delivery status
  → dispatcher sees status
  → export report.xlsx
  → deployed over HTTPS
```

### What changes in ownership today

- **Chiến:** contribution is frozen at the open PR. No new implementation dependency is placed on him.
- **Thanh:** takes ownership of **all remaining integration, conflict resolution, QA, deployment hardening, deployment, and release work today**, including tasks that were previously separated into Chiến/API and Thanh/client work.

This is intentional: reducing hand-offs is more important than preserving the old person/file split when the target is a same-day release.

---

# 1. Current-state audit

## 1.1 Repository state

| Item | Current state | Meaning for today |
|---|---|---|
| `dev` | `05ae53e763d7847392e503f7271e7a5f2cac5145` | Integration branch is stale |
| `stable` | same old baseline | Production does not contain the functional MVP |
| `cr/001-api` | `8f0980d97a0953f74c8e306f3249c71f496fb5a6` | Chiến's open PR #4 |
| `cr/001-flutter` | `66b7e260...` | Original Flutter Wave-0 branch |
| `gsd/01-mvp-walking-skeleton` | `c66af036...` | Functional MVP source branch; 27 commits ahead of `dev` |
| PR #4 | open, mergeable | Contains Wave-0 API contract/hardening only, not full Wave-1/2 business logic |

## 1.2 What the old plan says

The old Phase-1 plan split ownership as:

- Chiến: `apps/api/**`, OpenAPI, seed, solver, dispatcher, report.
- Thanh: `apps/mobile-driver/**`.
- `apps/web-portal/**` was deliberately out of scope.

Phase 2 later added:

- Chiến: order search/filter, late-risk, `report.xlsx`, dispatcher controls.
- Thanh: `late_risk` badges in Flutter.

Those Phase-2 features are already visible in `gsd/01-mvp-walking-skeleton`, so **do not schedule them again as greenfield implementation**.

## 1.3 What the attached documents require versus what MVP should claim

The project documents describe a broader roadmap including:

- GPS and real-time vehicle tracking;
- live traffic information;
- dynamic route updates;
- automatic backhaul / return-load matching;
- richer ESG reporting;
- app + web interfaces;
- later AI forecasting.

The current contest implementation instead uses:

- seed/imported coordinates;
- Leaflet + OpenStreetMap;
- haversine × `HCMC_CIRCUITY=1.35` approximation;
- greedy clustering + NN + 2-opt;
- status check-ins rather than live GPS;
- TTW fuel-based CO₂ calculation;
- no paid map/traffic/carbon API.

**Decision:** the larger items remain roadmap features. Today's release must not fake or imply that they already exist.

---

# 2. Grill: what is wrong with the current plan if followed literally

These are release blockers or credibility risks, not optional polish.

## G-01 — The old plan is implementation-complete but integration-incomplete

The code exists on a feature/integration-like branch, but the official `dev`/`stable` history does not contain it. Calling the MVP “done” while production branches are still on the September 2 baseline is misleading.

**Fix today:** integrate the functional branch into a fresh release branch from `dev`, reconcile Chiến's hardening, then promote through `dev` and `stable`.

## G-02 — Do not merge PR #4 blindly, then merge `gsd/...` blindly

`cr/001-api` and `gsd/01-mvp-walking-skeleton` diverged from the same base. They both touch the same API scaffold. A blind merge risks:

- replacing real handlers with Wave-0 stubs;
- losing `late_risk` fields;
- losing newer report/export logic;
- losing Chiến's stronger enum/numeric validation;
- manually corrupting `openapi.json`.

**Fix today:** use the functional branch as the baseline implementation, then port/cherry-pick Chiến's **hardening commit** with an explicit conflict policy.

## G-03 — Public deployment with `Bearer DEMO` / PIN `0000` alone is not acceptable

The current auth is intentionally demo-only. The README itself says not to expose it directly to the public internet.

**Fix today:** bind Uvicorn to loopback and put the demo behind HTTPS + reverse-proxy access control. Treat `Bearer DEMO` and PIN `0000` as application demo controls, not internet security.

## G-04 — Marketing claims are currently stronger than the implemented carbon method

Repository text references “ISO 14083 / GLEC Carbon Accounting,” while the MVP README correctly says the implemented result is a **TTW estimate, not an ISO 14083 pack**.

**Fix today:** public MVP copy must say something equivalent to:

> “Tank-to-wheel CO₂ estimate using fuel-consumption factors; methodology is informed by IPCC/GLEC references and is not yet an ISO 14083-compliant audit report.”

Do not deploy a page that implies formal ISO compliance when the implementation does not provide the complete standard boundary/methodology.

## G-05 — Demo-time manipulation must be explicit

The functional branch defaults demo time to 08:00 under `GREENLOGIX_DEMO=1` so an evening demo does not show 80/80 orders as late.

This is useful for deterministic demonstrations, but it must be considered **simulation state**, not real-time prediction.

**Fix today:** label late-risk as “demo ETA risk” / “simulated demo clock” when demo time is frozen, or explicitly configure `GREENLOGIX_DEMO_NOW` during the demo and document it.

## G-06 — Cloudflare Pages deployment is not the backend deployment

The repository's existing deployment workflow is for the landing/static site. The stateful FastAPI + SQLite dispatcher cannot be treated as if it were the same Cloudflare Pages artifact.

**Fix today:** deploy FastAPI on a persistent Linux host/VPS or another runtime with persistent storage. Do not rely on an ephemeral filesystem for the SQLite demo DB/uploads.

## G-07 — “Full MVP” must mean a tested user loop, not the number of features implemented

For the contest, a stable 3-minute end-to-end flow is more valuable than adding live traffic, backhaul, AI forecasting, or a new web portal today.

**Scope rule:** no new major product feature enters today's release unless it fixes a broken P0 demo path.

---

# 3. Definition of Done for 2026-09-07

The release is **DONE** only when every P0 gate below is green.

## P0-A — Git / integration

- [ ] A fresh release branch exists from `origin/dev`.
- [ ] Functional MVP code from `gsd/01-mvp-walking-skeleton` is present.
- [ ] Chiến's Wave-0 hardening from commit `8f0980d...` has been integrated without regressing real handlers.
- [ ] `openapi.json` is regenerated from the resolved application, not hand-merged.
- [ ] Full API tests pass.
- [ ] Ruff passes.
- [ ] Landing build still passes.
- [ ] Flutter tests/analyze pass if Flutter code is changed during integration.
- [ ] Integration PR to `dev` is reviewable and records the source branches/SHAs.

## P0-B — Dispatcher web loop

From a clean/reset demo state:

- [ ] `/health` returns `{"status":"ok"}`.
- [ ] Seed/import can create a usable order/vehicle dataset.
- [ ] Dispatcher loads with no browser console exceptions.
- [ ] Map renders OSM tiles.
- [ ] Optimize returns routes and non-zero totals.
- [ ] Route lines and stop markers render.
- [ ] Search `q` works.
- [ ] Late-only filter works.
- [ ] Publish makes routes visible to driver endpoint/client.
- [ ] Delivery status updates persist.
- [ ] Dispatcher reflects status after refresh.
- [ ] JSON report returns baseline/optimized/delta.
- [ ] `report.xlsx` downloads and opens.

## P0-C — Numerical credibility

- [ ] Baseline and optimized use the same distance approximation.
- [ ] CO₂ is derived from km, vehicle fuel consumption, and repository emission factor — not a hard-coded marketing percentage.
- [ ] Percentage deltas reconcile mathematically with the displayed absolute values.
- [ ] Zero-denominator cases do not crash percentage calculations.
- [ ] Re-running optimize does not produce obviously duplicated/corrupted routes.
- [ ] Any unassigned/overload case is visible instead of silently dropped.

## P0-D — Deployment safety

- [ ] API process binds to `127.0.0.1`, not directly to public `0.0.0.0`, on the production VPS.
- [ ] Reverse proxy terminates HTTPS.
- [ ] Demo site has an outer access-control layer (Basic Auth / access gateway / restricted audience).
- [ ] SQLite DB and upload directory are writable and persistent.
- [ ] Service restarts automatically.
- [ ] Logs are inspectable.
- [ ] Firewall exposes only required public ports.
- [ ] A rollback SHA and DB backup exist before release.

## P0-E — Production smoke

After deployment:

- [ ] Public HTTPS health check works through the proxy.
- [ ] Protected dispatcher loads.
- [ ] Seed → optimize → publish works on the deployed instance.
- [ ] Status writeback works.
- [ ] Report XLSX downloads.
- [ ] Service restart preserves demo data.
- [ ] No secrets, local paths, DB files, uploads, or `.env` were committed.

---

# 4. Ownership plan for today

## 4.1 Chiến — completed contribution, no new blocking task

### C-DONE-01 — Wave-0 API contract and validation

**Status:** DONE by Chiến / open PR #4  
**PR:** `#4 [api] Freeze Wave 0 OpenAPI and demo authentication`  
**Head:** `cr/001-api`  
**Head SHA:** `8f0980d97a0953f74c8e306f3249c71f496fb5a6`

Verified contribution to preserve:

- FastAPI Python 3.12 + `uv` + SQLite scaffold.
- Frozen API contract/OpenAPI surface.
- Demo auth gated by `GREENLOGIX_DEMO=1`.
- Dispatcher header `Authorization: Bearer DEMO`.
- Driver header `X-Driver-Pin: 0000`.
- Enum and input validation hardening.
- NaN/infinity rejection to `422` where numeric input should be finite.
- Multipart photo field fixed as `photo`; order import remains `file`.
- SQLite test isolation.
- Contract/auth/startup tests.
- Exact PR-head local verification documented as **191 passed** + Ruff clean + OpenAPI snapshot match.

### C-HANDOFF-01 — No further coding dependency today

Chiến's remaining obligation for today's plan is **zero** unless he voluntarily answers a merge-conflict question. Thanh must be able to finish without waiting for Chiến.

**Rule:** do not assign Chiến a new P0 task today.

---

## 4.2 Thanh — sole release executor for remaining work

Thanh owns every task below through deployment.

---

# 5. Execution sequence

# TH-00 — Freeze scope and create today's CR

**Priority:** P0  
**Owner:** Thanh  
**Output:** `changes/CR-20260907-001.md` + release branch  
**Do not start feature coding before this is done.**

## Actions

1. State today's objective in the CR:
   - integrate current functional MVP;
   - preserve Chiến's contract hardening;
   - full QA;
   - safe demo deployment;
   - no new product feature.

2. MUST KEEP:
   - current working optimizer and persistence logic;
   - `late_risk` support;
   - report JSON + XLSX;
   - driver publish/status flow;
   - free-map/no-paid-API MVP path;
   - existing landing page;
   - Chiến's validation improvements;
   - exact OpenAPI field names used by clients.

3. MUST CHANGE:
   - integrate stale branches;
   - restore all tests to one coherent branch;
   - production-safe deployment wrapper;
   - claim wording where it overstates ISO/GPS/live-traffic capability;
   - CI coverage for API if absent.

4. MUST NOT TOUCH:
   - financial projections;
   - competition source numbers unless factually wrong and explicitly reviewed;
   - new paid API integration;
   - new Next.js portal;
   - new AI feature;
   - algorithm rewrite to OR-Tools;
   - database migration to Postgres unless SQLite actually blocks deployment.

## Branch/worktree

Follow repository rules; branch from `dev`.

```bash
git fetch origin --prune

git worktree add \
  .worktrees/mvp-deploy-20260907 \
  -b feature/mvp-deploy-20260907 \
  origin/dev

cd .worktrees/mvp-deploy-20260907
```

## Acceptance

- [ ] Worktree is clean.
- [ ] Branch base is `origin/dev`.
- [ ] CR exists before integration edits.
- [ ] Current source SHAs are recorded in the CR.

---

# TH-01 — Bring the functional MVP into the release branch

**Priority:** P0  
**Owner:** Thanh

The `gsd/01-mvp-walking-skeleton` branch is already 27 commits ahead of `dev`, so it is the best functional baseline.

## Actions

```bash
git merge --ff-only origin/gsd/01-mvp-walking-skeleton
```

If `--ff-only` fails unexpectedly:

1. stop;
2. run `git log --graph --oneline --decorate --all -40`;
3. confirm the release branch still originated from `origin/dev`;
4. use a normal merge only after confirming no unexpected local commit was created.

## Immediately verify the functional baseline

```bash
cd apps/api
uv sync --locked
uv run --locked pytest -q
uv run --locked ruff check src tests
cd ../..

pnpm install --frozen-lockfile
pnpm run build:landing
```

If Flutter SDK is installed on the release machine:

```bash
cd apps/mobile-driver
flutter pub get
flutter test
flutter analyze
cd ../..
```

## Acceptance

- [ ] Functional branch contents are reproduced exactly before Chiến hardening is added.
- [ ] Baseline test result is recorded in CR notes.
- [ ] Any pre-existing failure is separated from integration-induced failure.

---

# TH-02 — Integrate Chiến's hardening commit without regressing Wave-1/2 logic

**Priority:** P0 / highest-risk code task  
**Owner:** Thanh  
**Source commit:** `8f0980d97a0953f74c8e306f3249c71f496fb5a6`

## Preferred method

Attempt to preserve Chiến's authorship:

```bash
git cherry-pick 8f0980d97a0953f74c8e306f3249c71f496fb5a6
```

Conflicts are expected because both branches independently evolved API files.

### Absolute rule

**Never resolve this cherry-pick with a blanket `--ours` or `--theirs`.**

The functional branch contains real handlers. Chiến's commit contains stronger contract validation. We need the union.

## File-by-file conflict policy

### `apps/api/src/greenlogix_api/schemas.py`

Keep from functional branch:

- `late_risk` in `OrderOut` and `StopOut`;
- all fields required by current serializer/driver/report logic.

Port from Chiến:

- `Literal` enums for cargo/fuel/vehicle/delivery/failure status where compatible;
- local `HH:MM` validation;
- finite lat/lng validation;
- non-negative/positive kg/capacity/fuel-use validation as appropriate;
- positive `cluster_radius_km`;
- failure reason required when status is `failed`.

Then run tests before touching OpenAPI.

### `apps/api/src/greenlogix_api/routers/*.py`

Keep the **real functional handlers** from `gsd/...`.

Port only Chiến's contract/error-handling improvements:

- expected auth dependencies;
- expected multipart field names;
- correct request/response models;
- numeric/error validation behavior;
- test-isolation-safe dependency behavior.

Do **not** replace implemented optimize/import/publish/report/status logic with Wave-0 `503` or zero stubs.

### `apps/api/src/greenlogix_api/db.py`

Keep the functional database/persistence behavior.

Port testability improvements only if they do not change the runtime DB location unexpectedly.

### `apps/api/tests/conftest.py`

Prefer isolated temporary SQLite for tests.

No test may mutate `apps/api/data/greenlogix.db`.

### `apps/api/tests/test_contract.py`

Bring this test into the final branch. Adapt expectations for additive fields such as `late_risk`; do not delete contract assertions simply because the implementation evolved.

### `apps/api/openapi.json`

**Do not merge by hand.**

Resolve Python code first, then regenerate from the runtime app.

### `apps/api/uv.lock` / `pyproject.toml`

Keep the dependency superset required by the functional branch and Chiến's validation/tests.

After resolution:

```bash
cd apps/api
uv lock
uv sync --locked
```

### CR / summary files

Keep both historical records where useful. Today's CR should clearly state:

- PR #4 is Chiến's contribution;
- functional branch independently continued the MVP;
- today's branch reconciles them for release.

## Cherry-pick completion gate

```bash
git status
# resolve every file deliberately
git add <resolved-files>
git cherry-pick --continue
```

If the patch is too conflict-heavy to preserve safely:

```bash
git cherry-pick --abort
```

Then manually port the hardening items above in a dedicated commit referencing:

```text
Source: PR #4 / 8f0980d
Author contribution: Nguyễn Quang Chiến (@qchien643)
```

Do not silently discard his contribution.

---

# TH-03 — Re-freeze the API contract after integration

**Priority:** P0  
**Owner:** Thanh

The client and dispatcher must consume one coherent schema after the merge.

## Regenerate OpenAPI from runtime

Use the repository's runtime export mechanism. At minimum verify:

```bash
cd apps/api
uv run --locked python - <<'PY'
import json
from greenlogix_api.main import app, OPENAPI_PATH
runtime = app.openapi()
OPENAPI_PATH.write_text(json.dumps(runtime, ensure_ascii=False, indent=2) + "\n")
assert json.loads(OPENAPI_PATH.read_text()) == runtime
print("OpenAPI paths:", len(runtime["paths"]))
PY
```

## Contract checks

Explicitly verify:

- `/health` remains public.
- dispatcher routes still require dispatcher auth.
- driver routes still require driver PIN header.
- order import field = `file`.
- POD upload field = `photo`.
- `late_risk` is present where clients expect it.
- no required client key was accidentally renamed.
- failure reason remains required for `failed` status.
- invalid NaN/infinite numeric input is rejected.

## Acceptance

- [ ] Runtime OpenAPI equals checked-in OpenAPI.
- [ ] Contract test passes.
- [ ] Flutter model still parses `late_risk`.

---

# TH-04 — Full backend regression suite

**Priority:** P0  
**Owner:** Thanh

Run the entire suite; do not only run smoke tests.

```bash
cd apps/api
uv sync --locked
uv run --locked pytest -q
uv run --locked ruff check src tests
```

## Mandatory focused test groups

Confirm coverage for:

1. health/startup;
2. auth on/off;
3. OpenAPI contract;
4. Excel import;
5. order CRUD;
6. distance and solver;
7. baseline;
8. carbon calculation;
9. tracer end-to-end;
10. status updates;
11. report JSON;
12. report XLSX;
13. late-risk/filter behavior.

## Add/fix tests if any of these are missing

### Numeric validation

- invalid latitude > 90 → `422`;
- invalid longitude > 180 → `422`;
- NaN / infinity → `422`;
- negative kg → `422`;
- non-positive capacity/fuel consumption → `422`;
- non-positive cluster radius → `422`.

### Failure status

- `failed` without reason → `422`;
- `failed` with supported reason → success.

### Persistence

- published route remains available in a new session;
- delivered state remains after reread.

### Demo reset/repeatability

The full jury loop must be runnable more than once without manual DB surgery.

At minimum test:

```text
seed → optimize → publish → update status
then reset/seed again → optimize → publish
```

Expected behavior must be deterministic enough for repeated demos.

---

# TH-05 — Numerical sanity and judge-proof results

**Priority:** P0  
**Owner:** Thanh

Automated tests are necessary but not enough. Inspect one complete generated result.

## Checks

### Distance

Verify the same `road_km = haversine × 1.35` convention is used in both baseline and optimized computations.

### Fuel

For a route:

```text
litres = km × l_per_100km / 100
```

### CO₂

For a route:

```text
kg_co2 = litres × kg_co2_per_litre
```

Current factors should be loaded from repository data, not repeated as magic values throughout the code.

### Delta

For each metric:

```text
delta = optimized - baseline
saving = baseline - optimized
percentage change = delta / baseline × 100
```

Be consistent about sign in UI labels. If UI says “reduction,” show a positive reduction number or explicitly show a negative delta — do not mix conventions.

### Unassigned / overload

If an order cannot be assigned due to capacity, the UI/API must show it. Never let “better km” be produced by silently dropping orders.

### No hard-coded success percentage

The attached project materials contain target ranges and aspirational improvement claims. The demo must show **computed output from current seed/input**, not force the optimizer to display a predetermined 8–15%, 5–12%, or other target.

## Acceptance

Create a short QA note containing:

- number of input orders;
- number of ready vehicles;
- number of routes;
- unassigned count;
- baseline km/litres/kgCO₂;
- optimized km/litres/kgCO₂;
- deltas;
- whether overload occurred.

This becomes the numerical evidence used for demo rehearsal.

---

# TH-06 — Dispatcher web MVP QA

**Priority:** P0  
**Owner:** Thanh

Use a real browser, not only API calls.

## Clean-run setup

```bash
cd apps/api
GREENLOGIX_DEMO=1 uv run --locked python -m greenlogix_api.seed
GREENLOGIX_DEMO=1 uv run --locked uvicorn greenlogix_api.main:app --host 127.0.0.1 --port 8000
```

Open:

```text
http://127.0.0.1:8000/dispatcher
```

## Browser QA checklist

### Layout

- [ ] Map is visible immediately without scrolling excessively.
- [ ] KPI values do not overflow cards.
- [ ] Route colors are distinguishable.
- [ ] Stop status dots are visible.
- [ ] Responsive layout is usable at 1366×768 and 1920×1080.
- [ ] No horizontal page overflow.

### Core actions

- [ ] Seed/reset action returns visible feedback.
- [ ] Optimize disables or provides feedback while request is running.
- [ ] Route list/map updates after optimize.
- [ ] Publish success is visible.
- [ ] Search filters expected orders.
- [ ] Late-only toggle changes results.
- [ ] XLSX export opens/downloads correctly.

### Error states

- [ ] API error is surfaced to user, not silently swallowed.
- [ ] Empty route list has a readable state.
- [ ] Unassigned orders are not hidden.
- [ ] Loading state cannot be confused with “no data.”

### Console/network

- [ ] No unhandled JS exception.
- [ ] No repeated failing request loop.
- [ ] OSM tiles load without broken mixed-content request.
- [ ] API requests return expected status codes.

---

# TH-07 — Driver flow verification

**Priority:** P0 for API endpoint/status writeback; P1 for packaging a new mobile build  
**Owner:** Thanh

The web dispatcher deployment must not be blocked by optional mobile packaging. However, the route-consumption/status loop must still work.

## API-level smoke

After publish:

```bash
curl \
  -H 'X-Driver-Pin: 0000' \
  'http://127.0.0.1:8000/driver/route'
```

Expected:

- at least one published route;
- ordered stops;
- `late_risk` field present;
- unpublished routes absent.

Then update one stop:

```bash
curl -X POST \
  -H 'Content-Type: application/json' \
  -H 'X-Driver-Pin: 0000' \
  -d '{"status":"delivered","reason":null}' \
  'http://127.0.0.1:8000/stops/<STOP_ID>/status'
```

Refresh dispatcher and verify the state changes.

## Flutter verification, if SDK/device is available

```bash
cd apps/mobile-driver
flutter pub get
flutter test
flutter analyze
```

Then run one client target and check:

- PIN `0000`;
- route list;
- late badge;
- stop detail;
- Maps deep-link;
- delivered/failed status.

**Do not spend today's release window redesigning Flutter UI unless it is broken.**

---

# TH-08 — Add missing CI gate for backend

**Priority:** P0 if current CI does not run API tests  
**Owner:** Thanh

The current repository process requires CI before promotion, but the open PR notes indicate existing CI is focused on landing and does not replace API verification.

Add one backend job to the existing CI workflow under today's CR.

Minimum gate:

```text
checkout
→ install uv
→ use Python 3.12
→ cd apps/api
→ uv sync --locked
→ uv run --locked pytest -q
→ uv run --locked ruff check src tests
```

Keep existing landing checks.

Flutter CI may remain P1 today if toolchain setup is heavy and Flutter is not part of the deployed web artifact. Local Flutter verification is still required if Flutter files changed.

## Acceptance

- [ ] PR cannot be called release-ready while API tests are red.
- [ ] Landing CI is not broken by Python job.

---

# TH-09 — Deployment hardening

**Priority:** P0  
**Owner:** Thanh

## Deployment assumption

Use a Linux VPS/runtime with a persistent filesystem. If the chosen host is ephemeral/serverless, stop and move the DB to persistent storage first; do not pretend SQLite persistence exists when it does not.

## App process

Production demo Uvicorn should listen only on loopback:

```bash
GREENLOGIX_DEMO=1 \
uv run --locked uvicorn greenlogix_api.main:app \
  --host 127.0.0.1 \
  --port 8000
```

Do not expose Uvicorn port 8000 directly to the internet.

## Reverse proxy

Use the server's existing Nginx/Caddy setup. Requirements:

- HTTPS certificate;
- proxy to `127.0.0.1:8000`;
- outer access control for contest demo;
- sane upload body size for XLSX/photo;
- forwarded host/proto headers;
- no public directory listing.

### Why outer auth is mandatory

Application credentials are fixed demo values:

- `Bearer DEMO`;
- PIN `0000`.

They are not suitable as the only internet-facing security layer.

## Service management

Create a service unit or equivalent with:

- working directory = deployed `apps/api`;
- restart on failure;
- `GREENLOGIX_DEMO=1` set outside git;
- optional `GREENLOGIX_DEMO_NOW` only when intentionally rehearsing a deterministic time;
- non-root service user;
- log access through journal/system logs.

## Persistent writable paths

Verify these survive restart/deploy:

```text
apps/api/data/greenlogix.db
apps/api/data/last_report.json
apps/api/data/uploads/
```

The seed XLSX and emission factor JSON remain code/repository assets.

## Firewall

Externally expose only:

- 22/tcp or your secured SSH port;
- 80/tcp for certificate redirect/challenge if required;
- 443/tcp for HTTPS.

Port 8000 should not be public.

---

# TH-10 — Correct claims before public demo

**Priority:** P0 credibility  
**Owner:** Thanh

Do a targeted wording pass; do not rewrite the business documents.

## Must not claim as implemented today

Unless the deployed code actually does it, do not present these as current MVP functionality:

- real-time GPS fleet tracking;
- live traffic-based rerouting;
- automatic backhaul marketplace/matching;
- AI traffic prediction;
- formal ISO 14083 compliance/certification;
- guaranteed target savings percentages.

## Safe current wording

### Routing

“Demo route optimization using clustered assignment, nearest-neighbor sequencing and 2-opt improvement over a spreadsheet-order baseline.”

### Maps

“OpenStreetMap visualization; no paid traffic/routing API is required for this contest demo.”

### Late risk

“Estimated late-risk based on approximate road distance and a demo average-speed assumption; not live traffic ETA.”

### CO₂

“Tank-to-wheel CO₂ estimate based on route distance, vehicle fuel consumption and fuel emission factors. Not yet a complete ISO 14083 audit/reporting implementation.”

### Backhaul / GPS

“Roadmap/pilot feature,” not “already operational.”

## Demo-time note

If `GREENLOGIX_DEMO_NOW` or the automatic 08:00 demo clock is active, expose a small label such as:

```text
Demo clock: 08:00 ICT (simulated for repeatable judging)
```

This avoids presenting a deterministic simulation as real-time traffic intelligence.

---

# TH-11 — Pre-release local end-to-end gate

**Priority:** P0  
**Owner:** Thanh

This is the exact “nothing else ships until this passes” sequence.

## Terminal A — API

```bash
cd apps/api
uv sync --locked
uv run --locked pytest -q
uv run --locked ruff check src tests
GREENLOGIX_DEMO=1 uv run --locked python -m greenlogix_api.seed
GREENLOGIX_DEMO=1 uv run --locked uvicorn greenlogix_api.main:app --host 127.0.0.1 --port 8000
```

## Terminal B — API checks

```bash
curl -fsS http://127.0.0.1:8000/health
curl -fsS -H 'Authorization: Bearer DEMO' http://127.0.0.1:8000/orders >/tmp/orders.json
curl -fsS -X POST -H 'Authorization: Bearer DEMO' -H 'Content-Type: application/json' -d '{"cluster_radius_km":3.0}' http://127.0.0.1:8000/optimize >/tmp/optimize.json
curl -fsS -X POST -H 'Authorization: Bearer DEMO' -H 'Content-Type: application/json' -d '{"route_ids":[]}' http://127.0.0.1:8000/routes/publish >/tmp/publish.json
curl -fsS -H 'X-Driver-Pin: 0000' http://127.0.0.1:8000/driver/route >/tmp/driver.json
curl -fsS -H 'Authorization: Bearer DEMO' http://127.0.0.1:8000/report >/tmp/report.json
curl -fsS -H 'Authorization: Bearer DEMO' http://127.0.0.1:8000/report.xlsx -o /tmp/greenlogix-report.xlsx
```

Then inspect the JSON totals and open the XLSX.

## Browser

Run one complete click path:

```text
Dispatcher
→ Seed/reset
→ Optimize
→ inspect routes/KPIs
→ search/filter
→ Publish
→ driver/status update
→ refresh dispatcher
→ download report
```

## Acceptance

- [ ] No manual DB editing.
- [ ] No terminal intervention between steps except the documented commands.
- [ ] Full loop can be repeated.

---

# TH-12 — Merge to `dev`

**Priority:** P0  
**Owner:** Thanh

Push release branch:

```bash
git status
git push -u origin feature/mvp-deploy-20260907
```

Open PR:

```text
feature/mvp-deploy-20260907 → dev
```

## PR body must contain

### Sources reconciled

- functional MVP: `gsd/01-mvp-walking-skeleton` @ `c66af036...`;
- Chiến hardening: PR #4 / `8f0980d...`;
- current base: `dev` @ `05ae53e...`.

### Chiến credit

Explicitly state that PR #4 delivered Wave-0 contract/auth/validation hardening and was carried into the integrated release.

### Verification

Paste actual results for:

- pytest;
- Ruff;
- OpenAPI snapshot;
- landing build;
- Flutter test/analyze if relevant;
- manual end-to-end demo.

### Known limitations

- no live traffic;
- no live GPS fleet tracking;
- no backhaul engine;
- CO₂ is TTW estimate;
- fixed demo credentials are protected by outer demo access control.

## PR #4 handling

Do **not** merge PR #4 separately after the integrated branch already contains its hardening, because that can reintroduce the same divergence/conflict.

After the integration PR is proven to contain Chiến's work:

- leave a comment on PR #4 linking the integrated PR;
- mark it superseded/close it only after verifying the contribution is preserved;
- do not erase the PR history.

---

# TH-13 — QA `dev` and promote to `stable`

**Priority:** P0  
**Owner:** Thanh

Repository rules say production deploys from `stable`.

## On `dev`

After integration PR merge:

1. confirm CI green;
2. check the exact merge SHA;
3. run/verify the P0 end-to-end sequence once against `dev` artifact/code;
4. complete QA sign-off.

Then open:

```text
dev → stable
```

Do not deploy production from `gsd/...` or the feature branch.

## Before stable merge

Record:

```bash
git rev-parse origin/dev
git rev-parse origin/stable
```

The old `stable` SHA is the rollback code reference.

---

# TH-14 — Deploy `stable` to VPS

**Priority:** P0  
**Owner:** Thanh

## Pre-deploy backup

On server:

```bash
cd /opt/greenlogix
printf '%s\n' "$(git rev-parse HEAD)" > /var/backups/greenlogix/predeploy-sha-20260907.txt
mkdir -p /var/backups/greenlogix
cp -a apps/api/data/greenlogix.db /var/backups/greenlogix/greenlogix.db.20260907.bak 2>/dev/null || true
cp -a apps/api/data/last_report.json /var/backups/greenlogix/last_report.json.20260907.bak 2>/dev/null || true
```

## Deploy code

```bash
git fetch origin --prune
git switch stable
git reset --hard origin/stable

cd apps/api
uv sync --locked
uv run --locked pytest -q
uv run --locked ruff check src tests
```

If you do not want full tests on a small production VPS, the exact same stable SHA must already have passed CI/local full tests; still run at least startup/import smoke before restarting public service.

## Restart

```bash
sudo systemctl restart greenlogix-api
sudo systemctl status greenlogix-api --no-pager
```

## Inspect logs

```bash
sudo journalctl -u greenlogix-api -n 100 --no-pager
```

No traceback / repeated restart loop is allowed.

---

# TH-15 — Production smoke test

**Priority:** P0  
**Owner:** Thanh

Run against the real HTTPS demo URL through the same access-control layer the judges/users will use.

## Smoke sequence

1. HTTPS page opens without certificate warning.
2. Outer demo authentication works.
3. `/health` returns OK.
4. Dispatcher loads.
5. Seed/reset.
6. Optimize.
7. Map renders.
8. KPI numbers appear.
9. Search and late filter.
10. Publish.
11. Driver endpoint/client sees route.
12. Update one stop status.
13. Dispatcher reflects state.
14. Download report XLSX.
15. Restart service.
16. Verify data is still present after restart.

## Network/security check

From another machine/network:

- port 8000 should not be directly reachable;
- HTTPS should be the public path;
- unauthenticated protected page should not reveal dispatcher data.

---

# TH-16 — Rollback procedure

**Priority:** P0 readiness  
**Owner:** Thanh

Rollback is part of deployment, not an afterthought.

## Trigger rollback if

- service enters crash loop;
- optimize returns 500 on normal seed;
- OpenAPI/client contract is broken;
- report math is visibly wrong;
- DB cannot be opened;
- deployment loses persisted data;
- dispatcher is inaccessible during the demo.

## Rollback code

Read previous SHA:

```bash
cat /var/backups/greenlogix/predeploy-sha-20260907.txt
```

Then:

```bash
cd /opt/greenlogix
git checkout <PREVIOUS_STABLE_SHA>
cd apps/api
uv sync --locked
sudo systemctl restart greenlogix-api
```

Restore DB only if the new code changed/invalidated schema/data and rollback code cannot read it:

```bash
sudo systemctl stop greenlogix-api
cp /var/backups/greenlogix/greenlogix.db.20260907.bak apps/api/data/greenlogix.db
sudo systemctl start greenlogix-api
```

Never overwrite the backup during rollback.

---

# 6. Concrete feature disposition for today

| Capability | Today | Why |
|---|---:|---|
| Excel seed/import | SHIP | Core pain point / current MVP |
| Vehicle list/capacity | SHIP | Required for assignment |
| Cluster + NN + 2-opt optimization | SHIP | Core differentiator |
| OSM dispatcher map | SHIP | Core visualization |
| Before/after km/fuel/CO₂ | SHIP | Core business + sustainability evidence |
| Publish route | SHIP | Completes dispatcher-to-driver seam |
| Driver route endpoint | SHIP | Required E2E seam |
| Driver status update | SHIP | Required proof of execution |
| Search/filter | SHIP | Already implemented; useful operationally |
| Late-risk approximation | SHIP WITH LABEL | Already implemented; must be labeled non-live |
| XLSX report export | SHIP | Strong contest/demo artifact |
| Flutter late badge | VERIFY | Already implemented; not web deployment blocker |
| New Flutter redesign | NO | Scope creep |
| Live GPS | ROADMAP | Not required for current proof |
| Live traffic API | ROADMAP | Not required; paid/external dependency |
| Dynamic rerouting | ROADMAP | Depends on real-time data |
| Backhaul matching | ROADMAP | Valuable but not current release |
| Full ISO 14083 report | ROADMAP | Current implementation is only TTW estimate |
| AI forecasting | ROADMAP | No need before operational baseline is stable |
| New Next.js web portal | NO | Current dispatcher is sufficient for today's MVP |
| Postgres migration | NO unless host forces it | SQLite is adequate for controlled demo on persistent VPS |

---

# 7. Today's priority queue

## P0 — cannot deploy without these

1. TH-00 scope/CR/worktree.
2. TH-01 functional branch integration.
3. TH-02 Chiến hardening reconciliation.
4. TH-03 OpenAPI re-freeze.
5. TH-04 backend regression.
6. TH-05 numerical sanity.
7. TH-06 dispatcher browser QA.
8. TH-07 driver/status E2E smoke.
9. TH-08 backend CI gate.
10. TH-09 deployment hardening.
11. TH-10 claim correction.
12. TH-11 local release gate.
13. TH-12 merge to `dev`.
14. TH-13 promote `dev` → `stable`.
15. TH-14 deploy stable.
16. TH-15 production smoke.
17. TH-16 rollback readiness.

## P1 — do only after all P0 gates are green

- package a fresh Android APK;
- improve responsive styling;
- add richer loading/success toast states;
- add screenshot/demo evidence to README;
- produce a short scripted demo dataset/reset button if reset is still awkward;
- add basic structured request logging if troubleshooting is difficult.

## Explicitly deferred

- live traffic;
- live GPS;
- backhaul;
- AI forecast;
- paid maps;
- full carbon-accounting standards implementation;
- new portal framework;
- algorithm rewrite.

---

# 8. Commit plan

Keep commits small enough to revert independently.

Recommended sequence:

```text
chore(plan): add 2026-09-07 MVP integration and deploy CR
merge/integrate: bring current GSD MVP onto release branch
feat(api): preserve Chien Wave-0 validation on functional handlers
fix(contract): reconcile late-risk and regenerate OpenAPI
fix(api): close integration regression tests
ci(api): run pytest and ruff on integration PRs
fix(demo): label simulated ETA/carbon limitations
chore(deploy): add production service/reverse-proxy documentation
```

Every new commit should carry today's CR/task trailers according to repository rules.

Do not squash away Chiến's authorship if his commit can be preserved safely.

---

# 9. Required evidence before declaring “done”

Save these results in the CR/PR or a release note.

## Automated

```text
API pytest: PASS (<actual count>)
Ruff: PASS
OpenAPI runtime == snapshot: PASS (<actual path count>)
Landing build: PASS
Flutter test: PASS / not changed + previous verified
Flutter analyze: PASS / not changed + previous verified
```

## Functional

```text
Seed orders: <count>
Vehicles: <count>
Routes produced: <count>
Unassigned: <count>
Baseline km: <value>
Optimized km: <value>
Baseline litres: <value>
Optimized litres: <value>
Baseline kg CO2: <value>
Optimized kg CO2: <value>
Status writeback: PASS
XLSX export: PASS
Persistent after restart: PASS
```

## Deployment

```text
Stable SHA: <sha>
Demo URL: <protected https URL>
Deployment host: <host/runtime>
Rollback SHA: <sha>
DB backup: <path/timestamp>
Production smoke: PASS
```

---

# 10. Final release acceptance checklist

Use this as the literal final checklist.

## Code

- [ ] Functional MVP branch integrated.
- [ ] Chiến PR #4 contribution preserved.
- [ ] No Wave-0 stub replaced real Wave-1/2 handler.
- [ ] OpenAPI regenerated.
- [ ] Tests pass.
- [ ] Ruff passes.
- [ ] Landing build passes.
- [ ] Client contract verified.

## Product

- [ ] Excel/seed works.
- [ ] Optimize works.
- [ ] Map works.
- [ ] Publish works.
- [ ] Driver route works.
- [ ] Status writeback works.
- [ ] Before/after metrics work.
- [ ] Search works.
- [ ] Late filter works.
- [ ] XLSX export works.
- [ ] No unsupported product claim appears in deployed demo.

## Security/deploy

- [ ] Stable is release source.
- [ ] HTTPS active.
- [ ] Outer demo access control active.
- [ ] Uvicorn not public.
- [ ] DB persistent.
- [ ] Backup taken.
- [ ] Restart tested.
- [ ] Rollback documented.

## Demo readiness

- [ ] One deterministic reset path.
- [ ] One clean end-to-end rehearsal.
- [ ] One backup local run path if internet/server fails.
- [ ] Current limitations are explainable in one sentence each.

---

# 11. One-sentence release target

> By the end of 2026-09-07, GREENLOGIX must exist on `stable` as a protected HTTPS demo that can repeatedly run **orders → optimize → map → publish → delivery status → before/after CO₂ report**, while preserving Chiến's validated API contract and clearly separating today's working MVP from future GPS, live-traffic, backhaul, and full ISO 14083 capabilities.
