"""T-LOOP-GOFA: Order provenance nullable fields + honest 501 stub (BLOCKED)."""

from fastapi import FastAPI
from fastapi.testclient import TestClient

from greenlogix_api.models import Order
from greenlogix_api.places.gofa import GofaPlaceProvider
from greenlogix_api.routers import places as places_router
from greenlogix_api.serialize import order_out


def test_provenance_defaults_none():
    order = Order()
    assert order.place_id is None
    assert order.place_provider is None
    assert order.place_confidence is None
    assert order.geocode_at is None


def test_provenance_propagates_through_order_out():
    order = Order(
        window_start="08:00",
        window_end="17:00",
        place_id="gofa_hcmc_ly_thuong_kiet",
        place_provider="gofa",
        place_confidence=0.98,
        geocode_at="2026-09-22T00:00:00Z",
    )
    out = order_out(order)
    assert out.place_id == "gofa_hcmc_ly_thuong_kiet"
    assert out.place_provider == "gofa"
    assert out.place_confidence == 0.98
    assert out.geocode_at == "2026-09-22T00:00:00Z"


def test_provenance_defaults_propagate_as_none():
    out = order_out(Order(window_start="08:00", window_end="17:00"))
    assert out.place_id is None
    assert out.place_provider is None
    assert out.place_confidence is None
    assert out.geocode_at is None


def _stub_client() -> TestClient:
    app = FastAPI()
    app.include_router(places_router.router)
    return TestClient(app)


def test_autocomplete_stub_returns_501_blocked():
    with _stub_client() as client:
        resp = client.get("/places/autocomplete", params={"q": "Ly Thuong Kiet"})
    assert resp.status_code == 501
    detail = resp.json()["detail"]
    assert "BLOCKED" in detail
    for required in ("base URL", "auth", "schema", "ToS"):
        assert required in detail, f"missing required doc name: {required}"


def test_autocomplete_stub_returns_no_fake_suggestions():
    with _stub_client() as client:
        resp = client.get("/places/autocomplete", params={"q": "Le Duan"})
    assert resp.status_code == 501
    body = resp.json()
    assert "predictions" not in body
    assert "suggestions" not in body
    assert isinstance(body["detail"], str)


def test_gofa_provider_keeps_blocked_note():
    assert "BLOCKED" in (GofaPlaceProvider.__doc__ or "")
