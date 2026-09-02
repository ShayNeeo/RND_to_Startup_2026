"""GET /orders?q= and ?late=1 — haversine 30 km/h ETA vs window_end, no traffic API."""

from __future__ import annotations

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

import pytest
from sqlmodel import Session

from greenlogix_api import db as dbmod
from greenlogix_api.late import SPEED_KMH, eta_minutes, late_risk, matches_q
from greenlogix_api.models import Order
from greenlogix_api.seed import DEPOT_LAT, DEPOT_LNG
from greenlogix_api.solver.distance import HCMC_CIRCUITY, haversine_km, road_km

AUTH = {"Authorization": "Bearer DEMO"}
HCMC = ZoneInfo("Asia/Ho_Chi_Minh")
NOON = datetime(2026, 9, 2, 12, 0, tzinfo=HCMC)
NEAR = (10.802, 106.662)
FAR = (10.70, 106.80)


@pytest.fixture
def frozen_noon(monkeypatch):
    monkeypatch.setattr("greenlogix_api.late.now_hcmc", lambda: NOON)


def test_speed_is_30_and_eta_uses_road_km_not_haversine() -> None:
    assert SPEED_KMH == 30.0
    assert HCMC_CIRCUITY == 1.35
    straight = haversine_km(DEPOT_LAT, DEPOT_LNG, FAR[0], FAR[1])
    road = road_km(DEPOT_LAT, DEPOT_LNG, FAR[0], FAR[1])
    minutes = eta_minutes(FAR[0], FAR[1])
    assert road == pytest.approx(straight * HCMC_CIRCUITY)
    assert minutes == pytest.approx(road / 30.0 * 60.0)
    assert minutes != pytest.approx(straight / 30.0 * 60.0)


def test_late_risk_vs_window_end_with_frozen_clock() -> None:
    near_ok = late_risk(NEAR[0], NEAR[1], "18:00", now=NOON)
    near_missed = late_risk(NEAR[0], NEAR[1], "08:00", now=NOON)
    assert near_ok is False
    assert near_missed is True
    minutes = eta_minutes(FAR[0], FAR[1])
    tight_end = (NOON + timedelta(minutes=minutes / 2)).strftime("%H:%M")
    wide_end = (NOON + timedelta(minutes=minutes + 30)).strftime("%H:%M")
    assert late_risk(FAR[0], FAR[1], tight_end, now=NOON) is True
    assert late_risk(FAR[0], FAR[1], wide_end, now=NOON) is False


def test_matches_q_address_phone_receiver_case_insensitive() -> None:
    assert matches_q("Q1 stop 01", "0900000001", "KH 01", "q1")
    assert matches_q("Thu Duc stop", "0900000001", "KH 01", "0900000001")
    assert matches_q("Thu Duc stop", "0900000001", "KH 01", "kh 01")
    assert not matches_q("Thu Duc stop", "0900000001", "KH 01", "Q1")
    assert matches_q("Q1 stop 01", "0900000001", "KH 01", "")
    assert matches_q("Q1 stop 01", "0900000001", "KH 01", None)


def _two_orders() -> None:
    with Session(dbmod.engine) as session:
        session.add(
            Order(
                address="Q1 near depot",
                lat=NEAR[0],
                lng=NEAR[1],
                receiver="KH Near",
                phone="0900111111",
                kg=5,
                window_start="08:00",
                window_end="18:00",
            )
        )
        session.add(
            Order(
                address="Thu Duc far",
                lat=FAR[0],
                lng=FAR[1],
                receiver="KH Far",
                phone="0900222222",
                kg=5,
                window_start="08:00",
                window_end="08:30",
            )
        )
        session.commit()


def test_orders_q_subset_and_empty_q_all(demo_client, frozen_noon) -> None:
    _two_orders()
    all_rows = demo_client.get("/orders", headers=AUTH)
    assert all_rows.status_code == 200
    assert len(all_rows.json()) == 2
    empty_q = demo_client.get("/orders?q=", headers=AUTH)
    assert empty_q.status_code == 200
    assert len(empty_q.json()) == 2
    q1 = demo_client.get("/orders?q=Q1", headers=AUTH)
    assert q1.status_code == 200
    body = q1.json()
    assert len(body) == 1
    assert body[0]["address"] == "Q1 near depot"
    assert isinstance(body[0]["late_risk"], bool)
    phone = demo_client.get("/orders?q=0900222222", headers=AUTH)
    assert len(phone.json()) == 1
    assert phone.json()[0]["receiver"] == "KH Far"


def test_orders_late_1_only_late_risk_true(demo_client, frozen_noon) -> None:
    _two_orders()
    listed = demo_client.get("/orders", headers=AUTH).json()
    assert {row["address"]: row["late_risk"] for row in listed} == {
        "Q1 near depot": False,
        "Thu Duc far": True,
    }
    late_only = demo_client.get("/orders?late=1", headers=AUTH)
    assert late_only.status_code == 200
    body = late_only.json()
    assert len(body) == 1
    assert body[0]["late_risk"] is True
    assert body[0]["address"] == "Thu Duc far"
    assert all(row["late_risk"] is True for row in body)


def test_orders_q_and_late_and_seed_q1_subset(demo_client, frozen_noon) -> None:
    seeded = demo_client.post("/seed", headers=AUTH)
    assert seeded.status_code == 200
    all_rows = demo_client.get("/orders", headers=AUTH).json()
    assert len(all_rows) == 80
    q1 = demo_client.get("/orders?q=Q1", headers=AUTH).json()
    assert 0 < len(q1) < 80
    assert all("q1" in (o["address"] + o["phone"] + o["receiver"]).casefold() for o in q1)
    late_only = demo_client.get("/orders?late=1", headers=AUTH).json()
    assert all(o["late_risk"] is True for o in late_only)
    assert len(late_only) <= 80


def test_orders_filter_still_requires_bearer(demo_client) -> None:
    assert demo_client.get("/orders?q=Q1").status_code == 401
    assert demo_client.get("/orders?late=1").status_code == 401
