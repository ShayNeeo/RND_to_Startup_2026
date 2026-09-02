# GreenLogix MVP PLAN — Phase 1 (72h walking skeleton)

**Status:** verified (`## VERIFICATION PASSED` 2026-09-02)  
**Mode:** mvp / tracer-first  
**People:** Phạm Quốc Thanh (Flutter) · Nguyễn Quang Chiến (API)

This is the index. Rock-level tasks live in the numbered plans:

| Plan | Wave | Hours | File |
|------|------|-------|------|
| OpenAPI freeze + worktrees | 0 | 0–4 | [01-00-PLAN.md](./01-00-PLAN.md) |
| Tracer Excel → OSM map → Flutter list | 1 | 4–24 | [01-01-PLAN.md](./01-01-PLAN.md) |
| Chỉ đường + status writeback | 2 | 24–48 | [01-02-PLAN.md](./01-02-PLAN.md) |
| Before/after CO₂ + jury README | 3 | 48–72 | [01-03-PLAN.md](./01-03-PLAN.md) |

Architecture contract: [01-SKELETON.md](./01-SKELETON.md)  
Locked decisions: [01-CONTEXT.md](./01-CONTEXT.md)  
Stack research: [01-RESEARCH.md](./01-RESEARCH.md)

## Cost sweet spot (locked)

Master_sheet OPEX priced **5M VND/mo maps + 2.5M VND/mo traffic**. Rejected.

| Need | Paid API (rejected) | MVP choice | Cost |
|------|---------------------|------------|------|
| Map picture | Mapbox/Google | Leaflet + OSM tiles | 0 |
| Geocode | Google/Goong | lat/lng already in seed xlsx | 0 |
| Distance/ETA | Distance Matrix / traffic | haversine × `HCMC_CIRCUITY=1.35` | 0 |
| Turn-by-turn | Directions SDK | Google/Apple Maps deep-link | 0 |
| Live GPS | fleet SDK | status check-in only | 0 |
| CO₂ | carbon SaaS | petrol 2.31 / diesel 2.68 kg/L in-repo | 0 |
| VRP | commercial solver | greedy cluster + NN + 2-opt | 0 |
| Host | AWS 2-cluster | `uv run` + `flutter run` localhost | 0 |

Business yield this phase: a jury can watch **Excel → cheaper km + CO₂ number → driver executes**. SaaS MAD subscription remains the post-pilot money (GĐ 2). Do not buy APIs until that money exists (Phase 4).

## Two-person split

| | Chiến (WT-01 `cr/001-api`) | Thanh (WT-02 `cr/001-flutter`) |
|--|--|--|
| Owns | `apps/api/**`, `openapi.json`, seed, solver, Jinja dispatcher, root README demo | `apps/mobile-driver/**` only |
| Wave 0 | FastAPI 3.12, dump OpenAPI, Bearer DEMO | `flutter create`, Dart models, PIN hits `/health` |
| Wave 1 | Seed 80/10, optimize, Leaflet publish | PIN `0000` shows published stops |
| Wave 2 | Persist stop status | Chỉ đường + arrived/delivered/failed |
| Wave 3 | Report deltas + jury README | Optional photo; null still delivers |

Hour boxes (parallel): Chiến ≤58h · Thanh ≤63h · wall 72h.

## User story

**As a** HCMC dispatcher, **I want to** import today's Excel, get clustered routes that beat the old sequence on km and CO₂, and have tài xế run the list in Flutter with a Maps deep-link, **so that** a contest jury sees dual value in one sitting.

## Execute

```text
/gsd-execute-phase 1
```

Wave 0 first: `CR-20260902-001` + OpenAPI freeze. Need an Android emulator or phone for Chỉ đường (`user_setup` in 01-02).
