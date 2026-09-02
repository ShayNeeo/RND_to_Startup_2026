"""POST /stops/{id}/status writeback (DRV-03) and dispatcher GET /routes (DSP-01)."""

from __future__ import annotations

AUTH = {"Authorization": "Bearer DEMO"}
PIN = {"X-Driver-Pin": "0000"}


def _first_kind(routes: list[dict], kind: str) -> dict:
    for route in routes:
        for stop in route.get("stops") or []:
            if stop.get("kind") == kind:
                return stop
    raise AssertionError(f"no {kind} stop")


def _seed_optimize(demo_client) -> None:
    seeded = demo_client.post("/seed", headers=AUTH)
    assert seeded.status_code == 200
    optimized = demo_client.post(
        "/optimize",
        headers=AUTH,
        json={"cluster_radius_km": 3.0},
    )
    assert optimized.status_code == 200


def _publish(demo_client) -> None:
    published = demo_client.post("/routes/publish", headers=AUTH, json={"route_ids": []})
    assert published.status_code == 200
    assert published.json()


def test_post_arrived_on_published_stop_then_routes_show_status(demo_client) -> None:
    _seed_optimize(demo_client)
    _publish(demo_client)
    routes = demo_client.get("/routes", headers=AUTH).json()
    stop = _first_kind(routes, "stop")
    res = demo_client.post(
        f"/stops/{stop['id']}/status",
        headers=PIN,
        json={"status": "arrived"},
    )
    assert res.status_code == 200
    body = res.json()
    assert body["id"] == stop["id"]
    assert body["status"] == "arrived"
    after = demo_client.get("/routes", headers=AUTH).json()
    updated = _first_kind(
        [r for r in after if any(s["id"] == stop["id"] for s in r["stops"])],
        "stop",
    )
    matching = next(s for r in after for s in r["stops"] if s["id"] == stop["id"])
    assert matching["status"] == "arrived"
    assert updated["status"] == "arrived"


def test_failed_without_reason_returns_422(demo_client) -> None:
    _seed_optimize(demo_client)
    _publish(demo_client)
    stop = _first_kind(demo_client.get("/routes", headers=AUTH).json(), "stop")
    res = demo_client.post(
        f"/stops/{stop['id']}/status",
        headers=PIN,
        json={"status": "failed"},
    )
    assert res.status_code == 422


def test_failed_with_reason_stores_fail_reason(demo_client) -> None:
    _seed_optimize(demo_client)
    _publish(demo_client)
    stop = _first_kind(demo_client.get("/routes", headers=AUTH).json(), "stop")
    res = demo_client.post(
        f"/stops/{stop['id']}/status",
        headers=PIN,
        json={"status": "failed", "reason": "khach_vang"},
    )
    assert res.status_code == 200
    assert res.json()["status"] == "failed"
    assert res.json()["reason"] == "khach_vang"
    matching = next(
        s
        for r in demo_client.get("/routes", headers=AUTH).json()
        for s in r["stops"]
        if s["id"] == stop["id"]
    )
    assert matching["status"] == "failed"
    assert matching["fail_reason"] == "khach_vang"


def test_unpublished_stop_status_returns_404(demo_client) -> None:
    _seed_optimize(demo_client)
    stop = _first_kind(demo_client.get("/routes", headers=AUTH).json(), "stop")
    res = demo_client.post(
        f"/stops/{stop['id']}/status",
        headers=PIN,
        json={"status": "arrived"},
    )
    assert res.status_code == 404


def test_dispatcher_html_has_refresh_and_stop_status(demo_client) -> None:
    page = demo_client.get("/dispatcher", headers=AUTH)
    assert page.status_code == 200
    html = page.text
    assert "Refresh" in html
    assert "status" in html
    assert "GET /routes" in html or "/routes" in html
