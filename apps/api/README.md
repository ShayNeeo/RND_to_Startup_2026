# GreenLogix API

Python **3.12** FastAPI skeleton for the 72h walking skeleton. No commercial map, routing, traffic, or carbon API keys.

## Run

```bash
cd apps/api
GREENLOGIX_DEMO=1 uv run uvicorn greenlogix_api.main:app --host 0.0.0.0 --port 8000
```

Bind `0.0.0.0` so the Android emulator (`10.0.2.2:8000`) and phones on LAN can reach the process. `127.0.0.1` only serves the host.

Public:

```bash
curl http://127.0.0.1:8000/health
# {"status":"ok"}
```

## Demo auth (localhost only)

Env `GREENLOGIX_DEMO=1` is required. Without it, every listed data route returns 401.

| Role | Header |
|------|--------|
| Dispatcher | `Authorization: Bearer DEMO` |
| Driver | `X-Driver-Pin: 0000` |

This is a contest demo flag, not a product identity provider.

## Contract

Checked-in [`openapi.json`](./openapi.json) is the frozen D-15 contract. `GET /openapi.json` is public.

### Wave 0 review changes

- Paths, HTTP methods and response keys are unchanged. Enumerated values now appear in OpenAPI and are validated (cargo type, fuel, vehicle/order/stop status and stop kind).
- Order patches validate finite latitude `[-90, 90]`, longitude `[-180, 180]`, nonnegative kg and local `HH:MM` times (`00:00`–`23:59`). Omitted patch fields remain optional; no time-window scheduling is implemented.
- Vehicle patches require finite positive capacity and L/100km; optimize requires a finite positive radius (default `3.0` km).
- Stop status accepts `arrived`, `delivered` or `failed`. `failed` requires a non-null reason: `khach_vang`, `sai_dia_chi`, `hang_hong` or `tu_choi`. Invalid payloads return `422`.
- **Flutter handoff change:** `POST /stops/{id}/photo` now requires multipart field **`photo`**, not `file`. Excel import still uses `file`. Confirm this change with Thanh before consuming the new snapshot; Flutter has not been modified or verified here.

Regenerate the snapshot after an agreed contract change, from `apps/api`:

```bash
uv run --locked python -c 'from greenlogix_api.main import dump_openapi; dump_openapi()'
```

### Skeleton, not business functionality

Wave 0 only starts the app, creates SQLite tables, checks authentication and validates the contract. `/dispatcher` is placeholder HTML and needs the dispatcher header; typing its URL in a browser does not supply that header. `/docs` can be used to try requests with the documented headers.

Seed/import, optimize, routes/publish and reports still return empty data or zero totals. PATCH/DELETE orders, PATCH vehicles and POST stop status/photo return `503` with `detail: not_implemented` for valid authenticated input. Files are not parsed or saved. Real seed/import/solver/publish/status/photo behavior belongs to later waves.

### Smoke check

With the server running, use a second terminal:

```bash
curl -fsS http://127.0.0.1:8000/health
curl -fsS http://127.0.0.1:8000/openapi.json
curl -fsS -H 'Authorization: Bearer DEMO' http://127.0.0.1:8000/orders
curl -fsS -H 'X-Driver-Pin: 0000' http://127.0.0.1:8000/driver/route
curl -i http://127.0.0.1:8000/orders
```

Expected: health `{"status":"ok"}`, public OpenAPI, orders `[]`, driver `{"routes":[]}`, then `401` without credentials. Restart without `GREENLOGIX_DEMO=1`: data routes must return `401` even with correct headers. Demo authentication is not suitable for public hosting.

## Tests

```bash
cd apps/api
uv run --locked pytest -q
uv run --locked ruff check src tests
```

Tests use a separate temporary SQLite database for each case, never the demo database. They check all 15 business paths and methods, public/auth behavior, input constraints, multipart names, startup tables and snapshot equality. The public `/openapi.json` URL is deliberately not included in its own `paths` object.

API checks do not prove Flutter integration. Thanh still needs to confirm connectivity and response parsing before the whole Wave 0 is marked complete.
