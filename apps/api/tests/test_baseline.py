from sqlmodel import Session, select

from greenlogix_api import db as dbmod
from greenlogix_api.models import Order, Vehicle
from greenlogix_api.seed import DEPOT_LAT, DEPOT_LNG, DEPOT_NAME, seed_database
from greenlogix_api.solver import run_vrp
from greenlogix_api.solver.baseline import baseline_fill


def test_baseline_uses_excel_row_and_optimized_differs(demo_client) -> None:
    with Session(dbmod.engine) as session:
        seed_database(session)
        orders = list(session.exec(select(Order)).all())
        vehicles = list(session.exec(select(Vehicle)).all())
    assigned = baseline_fill(orders, vehicles)
    flat: list[int] = []
    for _vehicle, load in assigned:
        flat.extend(o.excel_row or 0 for o in load)
    assert flat == sorted(flat)
    assert flat == list(range(2, 2 + len(flat)))

    result = run_vrp(
        orders,
        vehicles,
        depot=(DEPOT_LAT, DEPOT_LNG),
        depot_name=DEPOT_NAME,
        radius_km=3.0,
    )
    assert result.totals.km != result.baseline.km
    assert result.baseline.km > 0
    assert result.totals.km > 0