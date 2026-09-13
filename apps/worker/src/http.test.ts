import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { apiPath, isDemoDispatcher, judgeOptimizeFields } from "./http.ts";

describe("worker HTTP footguns", () => {
  it("strips trailing slashes and /api prefix", () => {
    assert.equal(apiPath("/optimize/"), "/optimize");
    assert.equal(apiPath("/api/optimize/"), "/optimize");
    assert.equal(apiPath("/report/"), "/report");
    assert.equal(apiPath("/api/driver/route/"), "/driver/route");
    assert.equal(apiPath("/app/"), "/app");
  });

  it("accepts Bearer DEMO case-insensitively and ?token=DEMO", () => {
    assert.equal(isDemoDispatcher(new Request("https://x/optimize", { headers: { Authorization: "Bearer DEMO" } })), true);
    assert.equal(isDemoDispatcher(new Request("https://x/optimize", { headers: { Authorization: "bearer demo" } })), true);
    assert.equal(isDemoDispatcher(new Request("https://x/optimize?token=DEMO")), true);
    assert.equal(isDemoDispatcher(new Request("https://x/optimize")), false);
    assert.equal(isDemoDispatcher(new Request("https://x/optimize", { headers: { Authorization: "Bearer WRONG" } })), false);
  });

  it("exposes baseline vs optimized plus fallback/eco labels for judges", () => {
    const fields = judgeOptimizeFields(
      {
        totals: { km: 80, litres: 9.6, kg_co2: 25.728 },
        baseline: { km: 100, litres: 12, kg_co2: 32.16 },
      },
      "circuity",
      1
    );
    assert.equal(fields.distance_provider, "circuity");
    assert.notEqual(fields.distance_provider, "fallback");
    assert.equal(fields.eco_weight, 1);
    assert.notEqual(fields.baseline.km, fields.totals.km);
    assert.notEqual(fields.baseline.kg_co2, fields.totals.kg_co2);
  });
});
