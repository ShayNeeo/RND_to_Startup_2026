"""GET /report before/after totals computed from stored baseline (RPT-02)."""

from __future__ import annotations

import pytest
from sqlmodel import Session

from greenlogix_api import db as dbmod
from greenlogix_api.models import Order, Vehicle

AUTH = {"Authorization": "Bearer DEMO"}
MARKETING_PCTS = {8, 15, 5, 10, 12}


def _tiny_zigzag() -> None:
    with Session(dbmod.engine) as session:
        session.add(
            Vehicle(
                plate="51C-ZIG.01",
                type="van",
                capacity_kg=2000,
                fuel="petrol",
                l_per_100km=10.0,
                status="ready",
            )
        )
        session.add(
            Order(
                address="North close A",
                lat=10.81,
                lng=106.661,
                kg=10,
                excel_row=2,
                window_start="08:00",
                window_end="12:00",
            )
        )
        session.add(
            Order(
                address="Far south-east B",
                lat=10.70,
                lng=106.80,
                kg=10,
                excel_row=3,
                window_start="08:00",
                window_end="12:00",
            )
        )
        session.add(
            Order(
                address="North close C",
                lat=10.82,
                lng=106.661,
                kg=10,
                excel_row=4,
                window_start="08:00",
                window_end="12:00",
            )
        )
        session.commit()


def test_report_delta_is_optimized_minus_baseline_and_negative(demo_client) -> None:
    _tiny_zigzag()
    optimized = demo_client.post(
        "/optimize",
        headers=AUTH,
        json={"cluster_radius_km": 3.0},
    )
    assert optimized.status_code == 200
    res = demo_client.get("/report", headers=AUTH)
    assert res.status_code == 200
    body = res.json()
    assert "baseline" in body
    assert "optimized" in body
    assert "delta" in body
    assert "km_pct" in body["delta"]
    base = body["baseline"]
    opt = body["optimized"]
    delta = body["delta"]
    assert base["km"] > 0
    assert opt["km"] > 0
    assert delta["km"] == opt["km"] - base["km"]
    assert delta["litres"] == opt["litres"] - base["litres"]
    assert delta["kg_co2"] == opt["kg_co2"] - base["kg_co2"]
    assert delta["km"] < 0
    assert delta["km_pct"] == delta["km"] / base["km"] * 100
    assert delta["litres_pct"] == delta["litres"] / base["litres"] * 100
    assert delta["kg_co2_pct"] == delta["kg_co2"] / base["kg_co2"] * 100
    for key in ("km_pct", "litres_pct", "kg_co2_pct"):
        assert delta[key] not in MARKETING_PCTS
        assert round(delta[key]) not in MARKETING_PCTS or abs(delta[key]) > 20
    assert body["delta"] != {"km": 8, "litres": 5, "kg_co2": 10, "km_pct": 15, "litres_pct": 10, "kg_co2_pct": 12}
    assert opt["litres"] == pytest.approx(opt["km"] * 10.0 / 100.0)
    assert opt["kg_co2"] == pytest.approx(opt["litres"] * 2.31)
    assert base["litres"] == pytest.approx(base["km"] * 10.0 / 100.0)
    assert base["kg_co2"] == pytest.approx(base["litres"] * 2.31)


def test_dispatcher_has_ttw_strip_and_order_edit_delete(demo_client) -> None:
    page = demo_client.get("/dispatcher", headers=AUTH)
    assert page.status_code == 200
    html = page.text
    assert "ước tính TTW CO₂ (IPCC/GLEC factors)" in html
    assert "/report" in html
    assert "PATCH" in html
    assert "DELETE" in html
