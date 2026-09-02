# Requirements: GreenLogix MVP (GĐ 1 walking skeleton)

**Defined:** 2026-09-02
**Core Value:** Dispatcher imports orders, gets a cheaper/greener route, driver executes it — $0 map APIs.

## v1 Requirements (Phase 1 — 72 hours)

### Orders

- [ ] **ORD-01**: Dispatcher uploads an `.xlsx` matching the GreenLogix template (address, lat/lng optional, receiver, phone, kg, time window, cargo type, notes) and sees a validated order list or row-level errors.
- [ ] **ORD-02**: Seed dataset of 80 HCMC inner-city stops + 10 small trucks (case in `PROJECT_DESCRIPTION.md`) loads with one command.
- [ ] **ORD-03**: Dispatcher can edit/delete an order before optimize.

### Vehicles

- [ ] **VEH-01**: Vehicle records include plate, type, capacity_kg, fuel type, L/100km or km/L, status ready/maintenance.
- [ ] **VEH-02**: Optimize refuses vehicles not `ready`.

### Routing (VRP heuristic)

- [ ] **VRP-01**: Cluster-first (geographic, configurable radius) then nearest-neighbor + 2-opt sequence per vehicle. No paid routing API.
- [ ] **VRP-02**: Assignment respects capacity_kg; overload is rejected or flagged, never silently planned.
- [ ] **VRP-03**: Distance for clustering/sequencing is haversine × HCMC circuity factor (documented constant, default 1.35), not a distance-matrix API.
- [ ] **VRP-04**: Output is depot → stops → depot with time-window sort as a secondary key.

### Dispatcher surface (thin, in API)

- [ ] **DSP-01**: One HTML page: upload xlsx, list vehicles, button Optimize, Leaflet OSM map of proposed routes, confirm & publish to drivers.
- [ ] **DSP-02**: Map tiles are OSM (or equivalent free tiles). No Mapbox token.

### Driver (Flutter — Thanh)

- [ ] **DRV-01**: Driver opens today's published route as an ordered stop list (address, phone, window, notes).
- [ ] **DRV-02**: Each stop has Chỉ đường that opens Google Maps or Apple Maps via deep-link / `geo:` (no in-app turn-by-turn SDK).
- [ ] **DRV-03**: Driver marks arrived / delivered / failed (reason enum). Write hits the API and is visible on dispatcher refresh.
- [ ] **DRV-04**: Optional photo attach on delivered (local file upload). Skip if camera permission blocks demo; status still works.

### Report

- [ ] **RPT-01**: After optimize, show total km, estimated litres, estimated kg CO₂ using vehicle L/100km × published GLEC/IPCC factor table stored in-repo (not a paid carbon API).
- [ ] **RPT-02**: Before/after vs a naive baseline (orders in spreadsheet order, same vehicles, greedy fill). Deltas shown as km, litres, CO₂, % — the contest dual-value slide.

### Cost / ops

- [ ] **COST-01**: Cold start of API + Flutter against local SQLite requires zero third-party API keys. Nominatim, if used, is optional geocode-on-import with 1 req/s cache; paste lat/lng always works.
- [ ] **COST-02**: README documents the 72h demo script (commands, sample file path, what the jury clicks).

## v2 Requirements (not this phase)

- Live GPS / traffic layer
- ISO 14083 PDF pack
- Backhaul matching
- Multi-depot
- Next.js portal (`apps/web-portal`)
- ERP/WMS
- Play Store / App Store
- Goong/Google/Mapbox billed APIs

## Out of Scope

| Feature | Reason |
|---------|--------|
| Paid map/routing/traffic APIs | No budget; 7.5M VND/mo OPEX rejected |
| Flutter store publish | 72h; sideload APK / `flutter run` |
| Native turn-by-turn SDK | MVP.xlsx already specifies deep-link |
| K8s / PostGIS cluster | SQLite is enough for 80 orders |
| Auth SSO | Demo PIN or single shared dispatcher token |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| ORD-01..03 | Phase 1 | Pending |
| VEH-01..02 | Phase 1 | Pending |
| VRP-01..04 | Phase 1 | Pending |
| DSP-01..02 | Phase 1 | Pending |
| DRV-01..04 | Phase 1 | Pending |
| RPT-01..02 | Phase 1 | Pending |
| COST-01..02 | Phase 1 | Pending |

**Coverage:** v1 18 requirements, all Phase 1.

---
*Requirements defined: 2026-09-02*
