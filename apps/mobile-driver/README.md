# GreenLogix Driver (Flutter)

Native Flutter app for tài xế. Replaces the stale React PWA README (D-12).

## Run

API must bind `0.0.0.0` (see `apps/api/README.md`):

```bash
GREENLOGIX_DEMO=1 uv run uvicorn greenlogix_api.main:app --host 0.0.0.0 --port 8000
```

Linux desktop:

```bash
cd apps/mobile-driver
flutter run --dart-define=API_BASE=http://127.0.0.1:8000 -d linux
```

Android emulator (host loopback is the emulator itself — use `10.0.2.2`):

```bash
flutter run --dart-define=API_BASE=http://10.0.2.2:8000
```

Physical phone: use the LAN IP of the host running uvicorn, e.g. `http://192.168.1.10:8000`. Bind the API with `uvicorn --host 0.0.0.0 --port 8000`.

Linux desktop can list published stops after PIN `0000` but **cannot prove OS Maps**. Chỉ đường uses `url_launcher` `LaunchMode.externalApplication` (Google Maps dir → Apple Maps `daddr` → `geo:`). No Maps SDK key. Start an Android emulator or plug a phone (`flutter devices` must list android) to tap Chỉ đường.

Demo PIN is `0000` when `GREENLOGIX_DEMO=1`. Login calls `GET /health` then `GET /driver/route` with header `X-Driver-Pin`.
