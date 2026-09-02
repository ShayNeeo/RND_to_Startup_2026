# Roadmap: GreenLogix

## Overview

Ship a 72-hour contest-proof loop (Excel → heuristic VRP → Flutter driver → km/CO₂ delta) with zero paid map APIs. Later phases restore the rest of `MVP.xlsx` bắt buộc items, then GĐ 2 pilot SMEs, then paid maps if revenue exists.

## Phases

- [ ] **Phase 1: 72h Walking Skeleton** - Contest-ready dispatcher→driver→CO₂ on HCMC sample
- [ ] **Phase 2: MVP.xlsx bắt buộc remainder** - Order CRUD polish, late warnings, Excel/PDF export
- [ ] **Phase 3: Pilot ops** - Real SME, Nominatim hardening, PIN auth, hosting
- [ ] **Phase 4: Paid maps only if revenue** - Optional Goong/OSRM self-host after money exists

## Phase Details

### Phase 1: 72h Walking Skeleton
**Goal**: As a HCMC dispatcher, I want to import today's Excel orders, get clustered routes that beat the old sequence on km and CO₂, and have tài xế execute the list in Flutter with a Maps deep-link, so that a contest jury sees dual value in one sitting.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: ORD-01, ORD-02, ORD-03, VEH-01, VEH-02, VRP-01, VRP-02, VRP-03, VRP-04, DSP-01, DSP-02, DRV-01, DRV-02, DRV-03, DRV-04, RPT-01, RPT-02, COST-01, COST-02
**Success Criteria** (what must be TRUE):
  1. One command loads the 80-order / 10-truck HCMC seed.
  2. Dispatcher HTML: upload (or use seed) → Optimize → Leaflet OSM map of routes → Publish.
  3. Flutter app shows that route; Chỉ đường opens Google or Apple Maps; marking delivered updates the API.
  4. Report shows before/after km, litres, CO₂ using in-repo factors. No map/routing API keys in `.env`.
  5. Work is split: Thanh = Flutter; Chiến = API+solver+dispatcher HTML+seed.
**Plans:** 4 plans

Plans:
- [ ] 01-00-PLAN.md — OpenAPI freeze, CR/worktrees, FastAPI+Flutter scaffold (hours 0–4)
- [ ] 01-01-PLAN.md — Tracer: Excel/seed → optimize → Leaflet OSM → Flutter list
- [ ] 01-02-PLAN.md — Driver Chỉ đường deep-link + status writeback
- [ ] 01-03-PLAN.md — Before/after report, demo script, cost freeze, optional POD

### Phase 2: MVP.xlsx bắt buộc remainder
**Goal**: Remaining bắt buộc rows from `MVP.xlsx` (filters, late warning, Excel/PDF export, check-in map history) still with $0 paid APIs.
**Depends on**: Phase 1
**Requirements**: (to be detailed)
**Success Criteria**:
  1. Dispatcher can filter orders and see late-risk flags without traffic APIs (haversine ETA).
  2. Daily report exports xlsx.
**Plans**: TBD

### Phase 3: Pilot ops
**Goal**: One real SME can run a day without engineers at the keyboard.
**Depends on**: Phase 2
**Success Criteria**:
  1. Auth PIN per driver.
  2. Deployed API (cheap VPS or Cloudflare Tunnel) documented.
**Plans**: TBD

### Phase 4: Paid maps only if revenue
**Goal**: Swap haversine for a real matrix only after subscription money exists.
**Depends on**: Phase 3
**Success Criteria**:
  1. Provider behind an interface; default remains haversine.
**Plans**: TBD
