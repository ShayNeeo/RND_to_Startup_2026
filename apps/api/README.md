# GreenLogix API

Python **3.12** FastAPI skeleton for the 72h walking skeleton. No commercial map, routing, traffic, or carbon API keys.

## Run

```bash
cd apps/api
uv python pin 3.12 && uv sync
GREENLOGIX_DEMO=1 uv run python -m greenlogix_api.seed
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

## Distances (D-07)

Road km = haversine × `HCMC_CIRCUITY` **1.35** (`greenlogix_api.solver.distance`). Same factor on the spreadsheet-order baseline and the clustered NN+2-opt plan. Times are naive local `HH:MM` (`TZ=Asia/Ho_Chi_Minh`); no pytz.

CO₂ is tank-to-wheel: `kg_co2 = road_km * (l_per_100km/100) * kg_co2_per_litre` from `data/emission_factors.json` (petrol 2.31, diesel 2.68). Contest estimate, not an ISO 14083 pack.

## Seed

```bash
cd apps/api
GREENLOGIX_DEMO=1 uv run python -m greenlogix_api.seed
```

Writes 80 inner-HCMC orders + 10 trucks (one `maintenance`) into `data/greenlogix.db` and refreshes `apps/api/data/seed/hcmc_80_orders.xlsx` (lat/lng already filled — Nominatim is not required). Depot: Tân Bình DC `10.801, 106.661`.

Env: `GREENLOGIX_DEMO=1` and optional `TZ=Asia/Ho_Chi_Minh` only. No commercial geospatial credentials.

Dispatcher (OSM tiles only): `GET /dispatcher` then Seed → Optimize → Leaflet OSM map → Publish. Driver PIN `0000` reads published routes only. After optimize, `GET /report` (or the dispatcher TTW strip) shows before/after km, litres, kg CO₂ using `HCMC_CIRCUITY=1.35` on both baseline and optimized.

```bash
curl -H 'Authorization: Bearer DEMO' http://127.0.0.1:8000/report
```

## Tests

```bash
cd apps/api
uv run pytest -x tests/test_health.py tests/test_auth.py
GREENLOGIX_DEMO=1 uv run pytest -x tests/test_distance.py tests/test_solver.py tests/test_carbon.py tests/test_baseline.py tests/test_tracer_e2e.py
```
