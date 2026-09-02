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

## Tests

```bash
cd apps/api
uv run pytest -x tests/test_health.py tests/test_auth.py
```
