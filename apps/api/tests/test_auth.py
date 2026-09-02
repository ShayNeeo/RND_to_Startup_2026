"""GREENLOGIX_DEMO gate for dispatcher Bearer and driver PIN (D-19)."""

from fastapi.testclient import TestClient

from greenlogix_api.main import app


def test_orders_401_when_demo_unset(monkeypatch) -> None:
    monkeypatch.delenv("GREENLOGIX_DEMO", raising=False)
    with TestClient(app) as client:
        res = client.get("/orders")
    assert res.status_code == 401


def test_orders_401_when_demo_zero(monkeypatch) -> None:
    monkeypatch.setenv("GREENLOGIX_DEMO", "0")
    with TestClient(app) as client:
        res = client.get(
            "/orders",
            headers={"Authorization": "Bearer DEMO"},
        )
    assert res.status_code == 401


def test_orders_not_401_when_demo_and_bearer(monkeypatch) -> None:
    monkeypatch.setenv("GREENLOGIX_DEMO", "1")
    with TestClient(app) as client:
        res = client.get(
            "/orders",
            headers={"Authorization": "Bearer DEMO"},
        )
    assert res.status_code in (200, 503)
    assert res.status_code != 401


def test_driver_route_401_without_pin(monkeypatch) -> None:
    monkeypatch.setenv("GREENLOGIX_DEMO", "1")
    with TestClient(app) as client:
        res = client.get("/driver/route")
    assert res.status_code == 401


def test_driver_route_ok_with_pin(monkeypatch) -> None:
    monkeypatch.setenv("GREENLOGIX_DEMO", "1")
    with TestClient(app) as client:
        res = client.get(
            "/driver/route",
            headers={"X-Driver-Pin": "0000"},
        )
    assert res.status_code in (200, 503)
    assert res.status_code != 401
