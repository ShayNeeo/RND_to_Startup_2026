from greenlogix_api.models import Order, Vehicle
from greenlogix_api.seed import DEPOT_LAT, DEPOT_LNG, DEPOT_NAME
from greenlogix_api.solver import run_vrp


def _order(oid: int, lat: float, lng: float, kg: float, window: str = "08:00") -> Order:
    return Order(
        id=oid,
        address=f"a{oid}",
        lat=lat,
        lng=lng,
        receiver="KH",
        phone="",
        kg=kg,
        window_start=window,
        window_end="10:00",
        excel_row=oid,
    )


def test_maintenance_unused_overload_and_depot_ends() -> None:
    orders = [
        _order(1, 10.776, 106.700, 400, "09:00"),
        _order(2, 10.777, 106.701, 400, "08:00"),
    ]
    vehicles = [
        Vehicle(
            id=1,
            plate="51C-000.01",
            type="xe_tai_nho",
            capacity_kg=500,
            fuel="diesel",
            l_per_100km=12,
            status="ready",
        ),
        Vehicle(
            id=2,
            plate="51C-000.10",
            type="xe_tai_nho",
            capacity_kg=2000,
            fuel="diesel",
            l_per_100km=12,
            status="maintenance",
        ),
    ]
    result = run_vrp(
        orders,
        vehicles,
        depot=(DEPOT_LAT, DEPOT_LNG),
        depot_name=DEPOT_NAME,
        radius_km=3.0,
    )
    plates = {r.vehicle.plate for r in result.routes}
    assert "51C-000.10" not in plates
    assert "51C-000.01" in plates
    assert any(r.overload for r in result.routes)
    assert set(result.unassigned_ids) & {1, 2}
    for route in result.routes:
        assert route.stops[0].kind == "depot"
        assert route.stops[-1].kind == "depot"


def test_nn_tie_break_window_start() -> None:
    from greenlogix_api.solver.nn_two_opt import nearest_neighbor

    depot = (10.0, 106.0)
    a = _order(1, 10.01, 106.0, 10, "11:00")
    b = _order(2, 10.01, 106.0, 10, "08:00")
    seq = nearest_neighbor([a, b], depot)
    assert seq[0].id == 2
