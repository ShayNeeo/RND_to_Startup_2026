/**
 * Road-network distance providers (OSM now, Google Directions later).
 * Google-class baseline is Valhalla auto/truck or OSRM driving until a Google
 * Maps key is configured. Circuity fallback keeps the edge demo online without
 * a local OSM extract. Do not scrape Google.
 */

import { DIESEL_FACTOR, HCMC_CIRCUITY, PETROL_FACTOR, haversineKm, roadKm } from "./solver.ts";

export type LatLng = [number, number];
export type PairKm = (lat1: number, lng1: number, lat2: number, lng2: number) => number;
export type Transport = (url: string, method: string, body?: string) => Promise<unknown>;

export const DEFAULT_OSRM_URL = "https://router.project-osrm.org";
export const DEFAULT_VALHALLA_URL = "https://valhalla1.openstreetmap.de";
export const DEFAULT_TIMEOUT_MS = 2500;

export class RoadBaselineError extends Error {}
export class RoadBaselineNotConfigured extends RoadBaselineError {}

export interface RoadBaseline {
  providerId: string;
  pairKm(lat1: number, lng1: number, lat2: number, lng2: number): number | Promise<number>;
  matrixKm(points: LatLng[]): Promise<number[][]>;
}

function key(lat: number, lng: number): string {
  return `${lat.toFixed(5)},${lng.toFixed(5)}`;
}

async function defaultTransport(url: string, method: string, body?: string, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<unknown> {
  const ctrl = new AbortController();
  const tid = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method,
      body,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      signal: ctrl.signal,
    });
    if (!res.ok) throw new RoadBaselineError(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(tid);
  }
}

export class CircuityRoadBaseline implements RoadBaseline {
  providerId = "circuity";

  pairKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
    return haversineKm(lat1, lng1, lat2, lng2) * HCMC_CIRCUITY;
  }

  async matrixKm(points: LatLng[]): Promise<number[][]> {
    return points.map((a) => points.map((b) => this.pairKm(a[0], a[1], b[0], b[1])));
  }
}

export class CachedMatrixBaseline implements RoadBaseline {
  providerId: string;
  private index = new Map<string, number>();
  private matrix: number[][];
  private fallback: RoadBaseline;

  constructor(
    points: LatLng[],
    matrix: number[][],
    providerId: string,
    fallback: RoadBaseline = new CircuityRoadBaseline()
  ) {
    this.providerId = providerId;
    this.matrix = matrix;
    this.fallback = fallback;
    points.forEach((pt, i) => this.index.set(key(pt[0], pt[1]), i));
  }

  pairKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const i = this.index.get(key(lat1, lng1));
    const j = this.index.get(key(lat2, lng2));
    if (i !== undefined && j !== undefined) return this.matrix[i][j];
    const fb = this.fallback.pairKm(lat1, lng1, lat2, lng2);
    return typeof fb === "number" ? fb : roadKm(lat1, lng1, lat2, lng2);
  }

  async matrixKm(points: LatLng[]): Promise<number[][]> {
    return points.map((a) => points.map((b) => this.pairKm(a[0], a[1], b[0], b[1])));
  }
}

export class FallbackRoadBaseline implements RoadBaseline {
  providerId = "fallback";
  lastProviderId = "circuity";
  private primary: RoadBaseline;
  private fallback: RoadBaseline;

  constructor(primary: RoadBaseline, fallback: RoadBaseline = new CircuityRoadBaseline()) {
    this.primary = primary;
    this.fallback = fallback;
  }

  pairKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
    try {
      const km = this.primary.pairKm(lat1, lng1, lat2, lng2);
      if (typeof km !== "number") throw new Error("async pair");
      this.lastProviderId = this.primary.providerId;
      return km;
    } catch {
      this.lastProviderId = "circuity";
      return roadKm(lat1, lng1, lat2, lng2);
    }
  }

  async matrixKm(points: LatLng[]): Promise<number[][]> {
    try {
      const matrix = await this.primary.matrixKm(points);
      this.lastProviderId = this.primary.providerId;
      return matrix;
    } catch {
      this.lastProviderId = this.fallback.providerId;
      return this.fallback.matrixKm(points);
    }
  }
}

export function parseOsrmTable(payload: { code?: string; distances?: number[][] }): number[][] {
  if (payload.code !== "Ok" || !payload.distances?.length) {
    throw new RoadBaselineError(`OSRM table error: ${payload.code ?? "missing"}`);
  }
  return payload.distances.map((row) => row.map((cell) => cell / 1000));
}

export function osrmTableUrl(baseUrl: string, points: LatLng[], profile = "driving"): string {
  const coords = points.map(([lat, lng]) => `${lng},${lat}`).join(";");
  return `${baseUrl.replace(/\/$/, "")}/table/v1/${profile}/${coords}?annotations=distance`;
}

export class OsrmRoadBaseline implements RoadBaseline {
  providerId = "osrm";
  private opts: { baseUrl?: string; transport?: Transport; profile?: string };

  constructor(opts: { baseUrl?: string; transport?: Transport; profile?: string } = {}) {
    this.opts = opts;
  }

  async matrixKm(points: LatLng[]): Promise<number[][]> {
    if (points.length < 2) return points.map(() => points.map(() => 0));
    const transport = this.opts.transport ?? defaultTransport;
    const payload = (await transport(
      osrmTableUrl(this.opts.baseUrl ?? DEFAULT_OSRM_URL, points, this.opts.profile ?? "driving"),
      "GET"
    )) as { code?: string; distances?: number[][] };
    return parseOsrmTable(payload);
  }

  async pairKm(lat1: number, lng1: number, lat2: number, lng2: number): Promise<number> {
    return (await this.matrixKm([[lat1, lng1], [lat2, lng2]]))[0][1];
  }
}

export function parseValhallaMatrix(payload: { sources_to_targets?: { distance: number }[][] }): number[][] {
  const rows = payload.sources_to_targets;
  if (!rows?.length) throw new RoadBaselineError("Valhalla matrix missing sources_to_targets");
  return rows.map((row) => row.map((cell) => Number(cell.distance)));
}

export function valhallaMatrixBody(points: LatLng[], costing = "auto"): Record<string, unknown> {
  const locs = points.map(([lat, lng]) => ({ lat, lon: lng }));
  const body: Record<string, unknown> = { sources: locs, targets: locs, costing };
  if (costing === "truck") {
    body.costing_options = { truck: { height: 2.4, width: 2.0, length: 5.2, weight: 3.5 } };
  }
  return body;
}

export class ValhallaRoadBaseline implements RoadBaseline {
  providerId = "valhalla";
  private opts: { baseUrl?: string; costing?: string; transport?: Transport };

  constructor(opts: { baseUrl?: string; costing?: string; transport?: Transport } = {}) {
    this.opts = opts;
  }

  async matrixKm(points: LatLng[]): Promise<number[][]> {
    if (points.length < 2) return points.map(() => points.map(() => 0));
    const transport = this.opts.transport ?? defaultTransport;
    const payload = (await transport(
      `${(this.opts.baseUrl ?? DEFAULT_VALHALLA_URL).replace(/\/$/, "")}/sources_to_targets`,
      "POST",
      JSON.stringify(valhallaMatrixBody(points, this.opts.costing ?? "auto"))
    )) as { sources_to_targets?: { distance: number }[][] };
    return parseValhallaMatrix(payload);
  }

  async pairKm(lat1: number, lng1: number, lat2: number, lng2: number): Promise<number> {
    return (await this.matrixKm([[lat1, lng1], [lat2, lng2]]))[0][1];
  }
}

export class GoogleDirectionsBaseline implements RoadBaseline {
  providerId = "google_directions";

  constructor(apiKey?: string) {
    if (!apiKey) {
      throw new RoadBaselineNotConfigured(
        "GOOGLE_MAPS_API_KEY not set; Google-class baseline is OSM (Valhalla/OSRM)"
      );
    }
    throw new RoadBaselineNotConfigured(
      "Google Directions client is not wired yet; keep using OSM RoadBaseline"
    );
  }

  pairKm(): number {
    throw new RoadBaselineNotConfigured("Google Directions client is not wired yet");
  }

  async matrixKm(): Promise<number[][]> {
    throw new RoadBaselineNotConfigured("Google Directions client is not wired yet");
  }
}

export async function materializeMatrix(provider: RoadBaseline, points: LatLng[]): Promise<CachedMatrixBaseline | CircuityRoadBaseline> {
  try {
    const matrix = await provider.matrixKm(points);
    const name = (provider as FallbackRoadBaseline).lastProviderId || provider.providerId;
    return new CachedMatrixBaseline(points, matrix, name);
  } catch {
    return new CircuityRoadBaseline();
  }
}

export function resolveRoadBaseline(env: {
  ROAD_BASELINE?: string;
  ROAD_BASELINE_URL?: string;
  ROAD_BASELINE_COSTING?: string;
  OSRM_URL?: string;
  VALHALLA_URL?: string;
  GOOGLE_MAPS_API_KEY?: string;
} = {}): RoadBaseline {
  const choice = (env.ROAD_BASELINE || "auto").trim().toLowerCase();
  const costing = (env.ROAD_BASELINE_COSTING || "auto").trim().toLowerCase();
  const shared = (env.ROAD_BASELINE_URL || "").trim();
  const osrmUrl = env.OSRM_URL || (choice === "osrm" ? shared : "") || DEFAULT_OSRM_URL;
  const valhallaUrl = env.VALHALLA_URL || (choice === "valhalla" ? shared : "") || DEFAULT_VALHALLA_URL;
  if (choice === "circuity" || choice === "haversine") return new CircuityRoadBaseline();
  if (choice === "osrm") return new FallbackRoadBaseline(new OsrmRoadBaseline({ baseUrl: osrmUrl }));
  if (choice === "valhalla") {
    return new FallbackRoadBaseline(new ValhallaRoadBaseline({ baseUrl: valhallaUrl, costing }));
  }
  return new FallbackRoadBaseline(
    new ValhallaRoadBaseline({ baseUrl: valhallaUrl, costing }),
    new FallbackRoadBaseline(new OsrmRoadBaseline({ baseUrl: osrmUrl }))
  );
}

export function ecoLegCost(km: number, lPer100km: number, fuel: string, ecoWeight: number): number {
  const w = Math.max(0, Math.min(1, Number(ecoWeight) || 0));
  if (w <= 0) return km;
  const factor = fuel === "diesel" ? DIESEL_FACTOR : PETROL_FACTOR;
  const kg = km * (lPer100km / 100) * factor;
  return (1 - w) * km + w * kg;
}

export function ecoWeightFromEnv(raw?: string): number {
  const fromProcess = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process
    ?.env?.GREENLOGIX_ECO_WEIGHT;
  const text = (raw ?? fromProcess ?? "").trim();
  if (!text) return 0;
  const n = Number(text);
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

export function makeEcoPairKm(pairKm: PairKm, lPer100km: number, fuel: string, ecoWeight: number): PairKm {
  return (lat1, lng1, lat2, lng2) => ecoLegCost(pairKm(lat1, lng1, lat2, lng2), lPer100km, fuel, ecoWeight);
}
