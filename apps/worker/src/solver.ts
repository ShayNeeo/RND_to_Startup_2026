/**
 * GreenLogix Native VRPTW Optimizer for Cloudflare Workers
 * Clustered Nearest-Neighbor + 2-Opt with Haversine * 1.35 Circuity.
 */

export interface OrderRow {
  id: number;
  address: string;
  lat: number;
  lng: number;
  receiver: string;
  phone: string;
  kg: number;
  window_start: string;
  window_end: string;
  cargo_type: string;
  notes: string;
  excel_row?: number | null;
  status: string;
  late_risk?: number | boolean;
}

export interface VehicleRow {
  id: number;
  plate: string;
  type: string;
  capacity_kg: number;
  fuel: "petrol" | "diesel";
  l_per_100km: number;
  status: "ready" | "maintenance";
}

export interface StopPlanned {
  seq: number;
  kind: "depot" | "stop";
  order_id: number | null;
  lat: number;
  lng: number;
  address: string;
  phone: string;
  window_start: string;
  window_end: string;
  notes: string;
  kg: number;
  status: string;
  fail_reason: string | null;
  late_risk: boolean;
}

export interface RoutePlanned {
  vehicle: VehicleRow;
  color: string;
  published: boolean;
  km: number;
  litres: number;
  kg_co2: number;
  overload: boolean;
  stops: StopPlanned[];
}

export interface MetricTotals {
  km: number;
  litres: number;
  kg_co2: number;
}

export interface MetricDelta {
  km: number;
  litres: number;
  kg_co2: number;
  km_pct: number;
  litres_pct: number;
  kg_co2_pct: number;
}

export interface VrpResult {
  routes: RoutePlanned[];
  unassigned_ids: number[];
  totals: MetricTotals;
  baseline: MetricTotals;
  delta: MetricDelta;
}

export const HCMC_CIRCUITY = 1.35;
export const PETROL_FACTOR = 2.31;
export const DIESEL_FACTOR = 2.68;
export const ROUTE_COLORS = ["#36d9a5", "#ffd400", "#38bdf8", "#f472b6", "#a78bfa", "#fb923c"];

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371.0;
  const dLat = ((lat2 - lat1) * Math.PI) / 180.0;
  const dLng = ((lng2 - lng1) * Math.PI) / 180.0;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180.0) *
      Math.cos((lat2 * Math.PI) / 180.0) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1.0, Math.sqrt(a)));
}

export function roadKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  return haversineKm(lat1, lng1, lat2, lng2) * HCMC_CIRCUITY;
}

export function tourKm(orders: OrderRow[], depot: [number, number]): number {
  if (orders.length === 0) return 0.0;
  let [lat, lng] = depot;
  let total = 0.0;
  for (const order of orders) {
    total += roadKm(lat, lng, order.lat, order.lng);
    lat = order.lat;
    lng = order.lng;
  }
  total += roadKm(lat, lng, depot[0], depot[1]);
  return total;
}

export function nearestNeighbor(orders: OrderRow[], depot: [number, number]): OrderRow[] {
  const remaining = [...orders];
  const route: OrderRow[] = [];
  let [lat, lng] = depot;

  while (remaining.length > 0) {
    let bestIdx = 0;
    let bestDist = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const order = remaining[i];
      const dist = roadKm(lat, lng, order.lat, order.lng);
      if (
        dist < bestDist - 1e-12 ||
        (Math.abs(dist - bestDist) <= 1e-12 && order.window_start < remaining[bestIdx].window_start)
      ) {
        bestIdx = i;
        bestDist = dist;
      }
    }

    const best = remaining.splice(bestIdx, 1)[0];
    route.push(best);
    lat = best.lat;
    lng = best.lng;
  }

  return route;
}

export function twoOpt(orders: OrderRow[], depot: [number, number]): OrderRow[] {
  let route = [...orders];
  const n = route.length;
  if (n < 4) return route;

  let iters = 0;
  let swaps = 0;
  while (iters < 500 && swaps < 2000) {
    iters++;
    let improved = false;
    let current = tourKm(route, depot);

    for (let i = 0; i < n - 1; i++) {
      for (let k = i + 2; k < n; k++) {
        if (swaps >= 2000) return route;
        const candidate = [
          ...route.slice(0, i + 1),
          ...route.slice(i + 1, k + 1).reverse(),
          ...route.slice(k + 1),
        ];
        const newKm = tourKm(candidate, depot);
        if (newKm < current - 1e-12) {
          route = candidate;
          current = newKm;
          swaps++;
          improved = true;
          break;
        }
      }
      if (improved) break;
    }
    if (!improved) break;
  }
  return route;
}

export function greedyClusters(orders: OrderRow[], radiusKm = 3.0): OrderRow[][] {
  const remaining = [...orders];
  const clusters: OrderRow[][] = [];

  while (remaining.length > 0) {
    const seed = remaining.shift()!;
    const cluster = [seed];
    const kept: OrderRow[] = [];

    for (const order of remaining) {
      if (haversineKm(seed.lat, seed.lng, order.lat, order.lng) <= radiusKm) {
        cluster.push(order);
      } else {
        kept.push(order);
      }
    }
    remaining.length = 0;
    remaining.push(...kept);
    clusters.push(cluster);
  }

  return clusters;
}

export function runVrp(
  orders: OrderRow[],
  vehicles: VehicleRow[],
  depot: [number, number],
  depotName: string,
  radiusKm = 3.0
): VrpResult {
  const readyVehicles = vehicles.filter((v) => v.status === "ready");
  const clusters = greedyClusters(orders, radiusKm);
  const plannedRoutes: RoutePlanned[] = [];
  const unassigned: number[] = [];

  for (let cIdx = 0; cIdx < clusters.length; cIdx++) {
    const cluster = clusters[cIdx];
    if (cIdx < readyVehicles.length) {
      const v = readyVehicles[cIdx];
      const sequenced = twoOpt(nearestNeighbor(cluster, depot), depot);
      const km = tourKm(sequenced, depot);
      const litres = (km * v.l_per_100km) / 100.0;
      const factor = v.fuel === "diesel" ? DIESEL_FACTOR : PETROL_FACTOR;
      const kgCo2 = litres * factor;
      const totalKg = cluster.reduce((sum, o) => sum + o.kg, 0);
      const overload = totalKg > v.capacity_kg;

      const stops: StopPlanned[] = [
        {
          seq: 0,
          kind: "depot",
          order_id: null,
          lat: depot[0],
          lng: depot[1],
          address: depotName,
          phone: "",
          window_start: "",
          window_end: "",
          notes: "",
          kg: 0.0,
          status: "pending",
          fail_reason: null,
          late_risk: false,
        },
      ];

      for (let sIdx = 0; sIdx < sequenced.length; sIdx++) {
        const o = sequenced[sIdx];
        stops.push({
          seq: sIdx + 1,
          kind: "stop",
          order_id: o.id,
          lat: o.lat,
          lng: o.lng,
          address: o.address,
          phone: o.phone,
          window_start: o.window_start,
          window_end: o.window_end,
          notes: o.notes,
          kg: o.kg,
          status: o.status || "pending",
          fail_reason: null,
          late_risk: Boolean(o.late_risk),
        });
      }

      plannedRoutes.push({
        vehicle: v,
        color: ROUTE_COLORS[cIdx % ROUTE_COLORS.length],
        published: false,
        km,
        litres,
        kg_co2: kgCo2,
        overload,
        stops,
      });
    } else {
      for (const o of cluster) {
        unassigned.push(o.id);
      }
    }
  }

  // Calculate totals
  const optTotals: MetricTotals = {
    km: plannedRoutes.reduce((sum, r) => sum + r.km, 0),
    litres: plannedRoutes.reduce((sum, r) => sum + r.litres, 0),
    kg_co2: plannedRoutes.reduce((sum, r) => sum + r.kg_co2, 0),
  };

  // Compute unoptimized spreadsheet baseline
  const baseKm = tourKm(orders, depot);
  const avgLpk = readyVehicles.length > 0 ? readyVehicles.reduce((s, v) => s + v.l_per_100km, 0) / readyVehicles.length : 10.0;
  const baseLitres = (baseKm * avgLpk) / 100.0;
  const baseCo2 = baseLitres * PETROL_FACTOR;

  const baseTotals: MetricTotals = {
    km: baseKm,
    litres: baseLitres,
    kg_co2: baseCo2,
  };

  const deltaKm = optTotals.km - baseTotals.km;
  const deltaLitres = optTotals.litres - baseTotals.litres;
  const deltaCo2 = optTotals.kg_co2 - baseTotals.kg_co2;

  const delta: MetricDelta = {
    km: deltaKm,
    litres: deltaLitres,
    kg_co2: deltaCo2,
    km_pct: baseTotals.km > 0 ? (deltaKm / baseTotals.km) * 100.0 : 0.0,
    litres_pct: baseTotals.litres > 0 ? (deltaLitres / baseTotals.litres) * 100.0 : 0.0,
    kg_co2_pct: baseTotals.kg_co2 > 0 ? (deltaCo2 / baseTotals.kg_co2) * 100.0 : 0.0,
  };

  return {
    routes: plannedRoutes,
    unassigned_ids: unassigned,
    totals: optTotals,
    baseline: baseTotals,
    delta,
  };
}
