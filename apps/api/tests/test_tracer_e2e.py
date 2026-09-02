AUTH = {"Authorization": "Bearer DEMO"}
PIN = {"X-Driver-Pin": "0000"}


def test_seed_optimize_publish_driver_and_osm_dispatcher(demo_client) -> None:
    seeded = demo_client.post("/seed", headers=AUTH)
    assert seeded.status_code == 200
    body = seeded.json()
    assert body["orders"] == 80
    assert body["vehicles"] == 10
    assert body["depot"]["name"] == "Tan Binh DC"

    optimized = demo_client.post(
        "/optimize",
        headers=AUTH,
        json={"cluster_radius_km": 3.0},
    )
    assert optimized.status_code == 200
    plan = optimized.json()
    assert plan["routes"]
    assert plan["totals"]["km"] > 0
    assert plan["totals"]["litres"] > 0
    assert plan["totals"]["kg_co2"] > 0
    for route in plan["routes"]:
        stops = route["stops"]
        assert stops[0]["kind"] == "depot"
        assert stops[-1]["kind"] == "depot"

    unpublished = demo_client.get("/driver/route", headers=PIN)
    assert unpublished.status_code == 200
    assert unpublished.json()["routes"] == []

    published = demo_client.post("/routes/publish", headers=AUTH, json={"route_ids": []})
    assert published.status_code == 200
    assert published.json()

    driver = demo_client.get("/driver/route", headers=PIN)
    assert driver.status_code == 200
    routes = driver.json()["routes"]
    assert routes
    assert any(r["stops"] for r in routes)

    page = demo_client.get("/dispatcher", headers=AUTH)
    assert page.status_code == 200
    html = page.text
    assert "tile.openstreetmap.org" in html
    assert "OpenStreetMap" in html
    assert "mapbox" not in html.lower()
