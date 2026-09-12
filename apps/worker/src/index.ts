/**
 * GreenLogix 24/7 Serverless Edge API & Optimizer
 * Runs natively on Cloudflare Workers + Cloudflare D1.
 * 100% serverless, zero dependency on local machines.
 */

import { D1Database } from "@cloudflare/workers-types";
import { DISPATCHER_HTML } from "./dispatcherHtml";
import { DRIVER_HTML } from "./driverHtml";
import { generateSeedOrders, generateSeedVehicles, DEPOT_LAT, DEPOT_LNG, DEPOT_NAME } from "./seedData";
import { OrderRow, VehicleRow, runVrp } from "./solver";

export interface Env {
  DB: D1Database;
  ENVIRONMENT?: string;
}

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Driver-Pin, Accept, Origin",
  "Access-Control-Max-Age": "86400",
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...CORS_HEADERS,
    },
  });
}

function checkAuth(request: Request): boolean {
  const url = new URL(request.url);
  if (url.searchParams.get("token") === "DEMO") return true;
  const auth = request.headers.get("Authorization");
  return auth === "Bearer DEMO";
}

function checkDriverPin(request: Request): boolean {
  const pin = request.headers.get("X-Driver-Pin");
  return pin === "0000";
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const rawPath = url.pathname;
    const method = request.method.toUpperCase();

    // 1. CORS Preflight
    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // 2. Dispatcher Web Console UI (Served 24/7 at /app, /dashboard, and /dispatcher)
    if (rawPath === "/app" || rawPath === "/dashboard" || rawPath === "/dispatcher") {
      return new Response(DISPATCHER_HTML, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          ...CORS_HEADERS,
        },
      });
    }

    // 2b. Driver Mobile PWA UI (Served 24/7 at /driver)
    if (rawPath === "/driver") {
      return new Response(DRIVER_HTML, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          ...CORS_HEADERS,
        },
      });
    }

    // Normalize path: allow both /api/xxx and /xxx
    const isApiPrefix = rawPath.startsWith("/api");
    const path = isApiPrefix ? (rawPath.slice(4) || "/") : rawPath;

    // 3. Health & Info
    if (path === "/health") {
      return jsonResponse({ status: "ok" });
    }

    if (path === "/edge-health") {
      return jsonResponse({
        status: "ok",
        runtime: "cloudflare-workers-d1",
        db: "greenlogix-db",
        time: new Date().toISOString(),
      });
    }

    // 4. OpenAPI Specification
    if (path === "/openapi.json") {
      return jsonResponse({
        openapi: "3.1.0",
        info: { title: "EcoMiles API", version: "0.1.0" },
        paths: {
          "/health": { get: {} },
          "/dispatcher": { get: {} },
          "/seed": { post: {} },
          "/orders": { get: {} },
          "/orders/{id}": { get: {}, patch: {}, delete: {} },
          "/vehicles": { get: {} },
          "/vehicles/{id}": { patch: {} },
          "/optimize": { post: {} },
          "/routes": { get: {} },
          "/routes/publish": { post: {} },
          "/report": { get: {} },
          "/report.csv": { get: {} },
          "/driver/route": { get: {} },
          "/stops/{id}/status": { post: {} },
        },
      });
    }

    // 5. Seed Database (/seed)
    if (path === "/seed" && method === "POST") {
      if (!checkAuth(request)) return jsonResponse({ detail: "unauthorized" }, 401);

      await env.DB.batch([
        env.DB.prepare("DELETE FROM stops"),
        env.DB.prepare("DELETE FROM routes"),
        env.DB.prepare("DELETE FROM orders"),
        env.DB.prepare("DELETE FROM vehicles"),
        env.DB.prepare("DELETE FROM reports"),
      ]);

      const seedOrders = generateSeedOrders();
      const orderStmts = seedOrders.map((o) =>
        env.DB.prepare(
          `INSERT INTO orders (address, lat, lng, receiver, phone, kg, window_start, window_end, cargo_type, notes, excel_row, status, late_risk)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          o.address,
          o.lat,
          o.lng,
          o.receiver,
          o.phone,
          o.kg,
          o.window_start,
          o.window_end,
          o.cargo_type,
          o.notes,
          o.excel_row,
          o.status,
          o.late_risk ? 1 : 0
        )
      );

      const seedVehicles = generateSeedVehicles();
      const vehicleStmts = seedVehicles.map((v) =>
        env.DB.prepare(
          `INSERT INTO vehicles (plate, type, capacity_kg, fuel, l_per_100km, status)
           VALUES (?, ?, ?, ?, ?, ?)`
        ).bind(v.plate, v.type, v.capacity_kg, v.fuel, v.l_per_100km, v.status)
      );

      // Execute in chunks to adhere to D1 batch boundaries
      for (let i = 0; i < orderStmts.length; i += 25) {
        await env.DB.batch(orderStmts.slice(i, i + 25));
      }
      await env.DB.batch(vehicleStmts);

      return jsonResponse({
        orders: seedOrders.length,
        vehicles: seedVehicles.length,
        depot: { lat: DEPOT_LAT, lng: DEPOT_LNG, name: DEPOT_NAME },
      });
    }

    // 6. Orders (/orders and /orders/:id)
    if (path === "/orders" && method === "GET") {
      if (!checkAuth(request)) return jsonResponse({ detail: "unauthorized" }, 401);
      const q = (url.searchParams.get("q") || "").trim().toLowerCase();
      const late = url.searchParams.get("late") === "1";

      let query = "SELECT * FROM orders";
      const conditions: string[] = [];
      const binds: unknown[] = [];

      if (q) {
        conditions.push("(LOWER(address) LIKE ? OR phone LIKE ? OR LOWER(receiver) LIKE ?)");
        const likeQ = `%${q}%`;
        binds.push(likeQ, likeQ, likeQ);
      }
      if (late) {
        conditions.push("late_risk = 1");
      }

      if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
      }
      query += " ORDER BY id ASC";

      const stmt = env.DB.prepare(query);
      const results = binds.length > 0 ? await stmt.bind(...binds).all() : await stmt.all();
      return jsonResponse(results.results);
    }

    const orderIdMatch = path.match(/^\/orders\/(\d+)$/);
    if (orderIdMatch) {
      if (!checkAuth(request)) return jsonResponse({ detail: "unauthorized" }, 401);
      const id = parseInt(orderIdMatch[1], 10);

      if (method === "GET") {
        const row = await env.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(id).first();
        if (!row) return jsonResponse({ detail: "not_found" }, 404);
        return jsonResponse(row);
      }

      if (method === "PATCH") {
        const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
        const allowed = ["address", "lat", "lng", "receiver", "phone", "kg", "window_start", "window_end", "cargo_type", "notes"];
        const updates: string[] = [];
        const binds: unknown[] = [];

        for (const key of allowed) {
          if (body[key] !== undefined) {
            updates.push(`${key} = ?`);
            binds.push(body[key]);
          }
        }

        if (updates.length > 0) {
          binds.push(id);
          const res = await env.DB.prepare(`UPDATE orders SET ${updates.join(", ")} WHERE id = ?`).bind(...binds).run();
          if (!res.meta.changes) return jsonResponse({ detail: "not_found" }, 404);
        }

        const updated = await env.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(id).first();
        return jsonResponse(updated);
      }

      if (method === "DELETE") {
        const res = await env.DB.prepare("DELETE FROM orders WHERE id = ?").bind(id).run();
        if (!res.meta.changes) return jsonResponse({ detail: "not_found" }, 404);
        return jsonResponse({ id });
      }
    }

    // 7. Vehicles (/vehicles and /vehicles/:id)
    if (path === "/vehicles" && method === "GET") {
      if (!checkAuth(request)) return jsonResponse({ detail: "unauthorized" }, 401);
      const rows = await env.DB.prepare("SELECT * FROM vehicles ORDER BY id ASC").all();
      return jsonResponse(rows.results);
    }

    const vehicleIdMatch = path.match(/^\/vehicles\/(\d+)$/);
    if (vehicleIdMatch && method === "PATCH") {
      if (!checkAuth(request)) return jsonResponse({ detail: "unauthorized" }, 401);
      const id = parseInt(vehicleIdMatch[1], 10);
      const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
      const allowed = ["status", "capacity_kg", "l_per_100km", "fuel", "type"];
      const updates: string[] = [];
      const binds: unknown[] = [];

      for (const key of allowed) {
        if (body[key] !== undefined) {
          updates.push(`${key} = ?`);
          binds.push(body[key]);
        }
      }

      if (updates.length > 0) {
        binds.push(id);
        const res = await env.DB.prepare(`UPDATE vehicles SET ${updates.join(", ")} WHERE id = ?`).bind(...binds).run();
        if (!res.meta.changes) return jsonResponse({ detail: "not_found" }, 404);
      }

      const updated = await env.DB.prepare("SELECT * FROM vehicles WHERE id = ?").bind(id).first();
      return jsonResponse(updated);
    }

    // 8. Optimize Routes (/optimize)
    if (path === "/optimize" && method === "POST") {
      if (!checkAuth(request)) return jsonResponse({ detail: "unauthorized" }, 401);
      const body = (await request.json().catch(() => ({}))) as { cluster_radius_km?: number };
      const radius = body.cluster_radius_km && body.cluster_radius_km > 0 ? body.cluster_radius_km : 3.0;

      const orderRows = (await env.DB.prepare("SELECT * FROM orders").all()).results as unknown as OrderRow[];
      const vehicleRows = (await env.DB.prepare("SELECT * FROM vehicles").all()).results as unknown as VehicleRow[];

      const vrp = runVrp(orderRows, vehicleRows, [DEPOT_LAT, DEPOT_LNG], DEPOT_NAME, radius);

      // Persist generated routes and stops to D1
      await env.DB.batch([
        env.DB.prepare("DELETE FROM stops"),
        env.DB.prepare("DELETE FROM routes"),
      ]);

      const createdRoutes: any[] = [];

      for (const r of vrp.routes) {
        const routeInsert = await env.DB.prepare(
          `INSERT INTO routes (vehicle_id, plate, color, published, km, litres, kg_co2, overload)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
        )
          .bind(r.vehicle.id, r.vehicle.plate, r.color, 0, r.km, r.litres, r.kg_co2, r.overload ? 1 : 0)
          .run();

        const routeId = Number(routeInsert.meta.last_row_id);

        const stopStmts = r.stops.map((s) =>
          env.DB.prepare(
            `INSERT INTO stops (route_id, seq, kind, order_id, lat, lng, address, phone, window_start, window_end, notes, kg, status, fail_reason, late_risk)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
          ).bind(
            routeId,
            s.seq,
            s.kind,
            s.order_id,
            s.lat,
            s.lng,
            s.address,
            s.phone,
            s.window_start,
            s.window_end,
            s.notes,
            s.kg,
            s.status,
            s.fail_reason,
            s.late_risk ? 1 : 0
          )
        );

        if (stopStmts.length > 0) {
          await env.DB.batch(stopStmts);
        }

        createdRoutes.push({
          id: routeId,
          vehicle_id: r.vehicle.id,
          plate: r.vehicle.plate,
          color: r.color,
          published: false,
          km: r.km,
          litres: r.litres,
          kg_co2: r.kg_co2,
          overload: r.overload,
          stops: r.stops.map((s, idx) => ({ id: idx + 1, ...s })),
        });
      }

      // Save report
      await env.DB.prepare("INSERT OR REPLACE INTO reports (id, data) VALUES ('latest', ?)")
        .bind(JSON.stringify({ baseline: vrp.baseline, optimized: vrp.totals, delta: vrp.delta }))
        .run();

      return jsonResponse({
        routes: createdRoutes,
        unassigned_order_ids: vrp.unassigned_ids,
        totals: vrp.totals,
      });
    }

    // 9. Routes (/routes & /routes/publish)
    if (path === "/routes" && method === "GET") {
      if (!checkAuth(request)) return jsonResponse({ detail: "unauthorized" }, 401);
      const routes = (await env.DB.prepare("SELECT * FROM routes ORDER BY id ASC").all()).results as any[];
      const stops = (await env.DB.prepare("SELECT * FROM stops ORDER BY seq ASC").all()).results as any[];

      for (const r of routes) {
        r.published = Boolean(r.published);
        r.overload = Boolean(r.overload);
        r.stops = stops.filter((s) => s.route_id === r.id);
      }

      return jsonResponse(routes);
    }

    if (path === "/routes/publish" && method === "POST") {
      if (!checkAuth(request)) return jsonResponse({ detail: "unauthorized" }, 401);
      await env.DB.prepare("UPDATE routes SET published = 1").run();
      const routes = (await env.DB.prepare("SELECT * FROM routes ORDER BY id ASC").all()).results as any[];
      const stops = (await env.DB.prepare("SELECT * FROM stops ORDER BY seq ASC").all()).results as any[];

      for (const r of routes) {
        r.published = true;
        r.overload = Boolean(r.overload);
        r.stops = stops.filter((s) => s.route_id === r.id);
      }

      return jsonResponse(routes);
    }

    // 10. Driver routes (/driver/route)
    if (path === "/driver/route" && method === "GET") {
      if (!checkDriverPin(request) && !checkAuth(request)) {
        return jsonResponse({ detail: "unauthorized" }, 401);
      }

      const publishedRoutes = (
        await env.DB.prepare("SELECT * FROM routes WHERE published = 1 ORDER BY id ASC").all()
      ).results as any[];
      const allStops = (await env.DB.prepare("SELECT * FROM stops ORDER BY seq ASC").all()).results as any[];

      const driverRoutes = publishedRoutes.map((r) => ({
        plate: r.plate,
        stops: allStops.filter((s) => s.route_id === r.id),
      }));

      return jsonResponse({ routes: driverRoutes });
    }

    // 11. Stop status writeback (/stops/:id/status)
    const stopStatusMatch = path.match(/^\/stops\/(\d+)\/status$/);
    if (stopStatusMatch && (method === "POST" || method === "PATCH")) {
      if (!checkDriverPin(request) && !checkAuth(request)) {
        return jsonResponse({ detail: "unauthorized" }, 401);
      }
      const id = parseInt(stopStatusMatch[1], 10);
      const body = (await request.json().catch(() => ({}))) as { status?: string; reason?: string | null };

      if (!body.status || !["arrived", "delivered", "failed"].includes(body.status)) {
        return jsonResponse({ detail: "invalid status" }, 422);
      }

      const stop = await env.DB.prepare("SELECT * FROM stops WHERE id = ?").bind(id).first<any>();
      if (!stop) return jsonResponse({ detail: "not_found" }, 404);

      await env.DB.prepare("UPDATE stops SET status = ?, fail_reason = ? WHERE id = ?")
        .bind(body.status, body.reason || null, id)
        .run();

      if (stop.order_id && ["delivered", "failed"].includes(body.status)) {
        await env.DB.prepare("UPDATE orders SET status = ? WHERE id = ?").bind(body.status, stop.order_id).run();
      }

      return jsonResponse({
        id,
        status: body.status,
        reason: body.reason || null,
      });
    }

    // 12. Reports (/report & /report.csv)
    if (path === "/report" && method === "GET") {
      if (!checkAuth(request)) return jsonResponse({ detail: "unauthorized" }, 401);
      const rep = await env.DB.prepare("SELECT data FROM reports WHERE id = 'latest'").first<{ data: string }>();
      if (rep && rep.data) {
        return jsonResponse(JSON.parse(rep.data));
      }
      return jsonResponse({
        baseline: { km: 0, litres: 0, kg_co2: 0 },
        optimized: { km: 0, litres: 0, kg_co2: 0 },
        delta: { km: 0, litres: 0, kg_co2: 0, km_pct: 0, litres_pct: 0, kg_co2_pct: 0 },
      });
    }

    if (path === "/report.csv" && method === "GET") {
      if (!checkAuth(request)) return jsonResponse({ detail: "unauthorized" }, 401);
      const rep = await env.DB.prepare("SELECT data FROM reports WHERE id = 'latest'").first<{ data: string }>();
      const data = rep?.data
        ? JSON.parse(rep.data)
        : {
            baseline: { km: 0, litres: 0, kg_co2: 0 },
            optimized: { km: 0, litres: 0, kg_co2: 0 },
            delta: { km: 0, litres: 0, kg_co2: 0, km_pct: 0, litres_pct: 0, kg_co2_pct: 0 },
          };

      const csv = [
        "metric,baseline,optimized,delta,delta_pct",
        `km,${data.baseline.km},${data.optimized.km},${data.delta.km},${data.delta.km_pct}`,
        `litres,${data.baseline.litres},${data.optimized.litres},${data.delta.litres},${data.delta.litres_pct}`,
        `kg_co2,${data.baseline.kg_co2},${data.optimized.kg_co2},${data.delta.kg_co2},${data.delta.kg_co2_pct}`,
      ].join("\n");

      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": "attachment; filename=report.csv",
          ...CORS_HEADERS,
        },
      });
    }

    // 13. Fallback: Proxy to Cloudflare Pages landing site (cargox-group-3qm.pages.dev)
    if (!isApiPrefix) {
      try {
        const pagesUrl = new URL(rawPath + url.search, "https://cargox-group-3qm.pages.dev");
        const forwardReq = new Request(pagesUrl.toString(), {
          method: request.method,
          headers: request.headers,
          body: request.method !== "GET" && request.method !== "HEAD" ? request.body : undefined,
          redirect: "follow",
        });
        const resp = await fetch(forwardReq);
        if (resp.status < 400 || rawPath === "/" || rawPath.startsWith("/assets/")) {
          return resp;
        }
      } catch (e) {
        // Fallthrough to 404
      }
    }

    return jsonResponse({ detail: "not_found" }, 404);
  },
};
