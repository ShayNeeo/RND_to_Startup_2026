"""Spreadsheet-order greedy fill (D-17). Sequence unchanged."""

from __future__ import annotations

from greenlogix_api.models import Order, Vehicle
from greenlogix_api.solver.nn_two_opt import tour_km


def baseline_fill(
    orders: list[Order],
    vehicles: list[Vehicle],
) -> list[tuple[Vehicle, list[Order]]]:
    ready = [v for v in vehicles if v.status == "ready"]
    ordered = sorted(
        orders,
        key=lambda o: (o.excel_row is None, o.excel_row if o.excel_row is not None else 0, o.id or 0),
    )
    assigned: list[tuple[Vehicle, list[Order]]] = []
    idx = 0
    for vehicle in ready:
        load: list[Order] = []
        kg = 0.0
        while idx < len(ordered):
            order = ordered[idx]
            if kg + order.kg <= vehicle.capacity_kg:
                load.append(order)
                kg += order.kg
                idx += 1
            else:
                break
        if load:
            assigned.append((vehicle, load))
    return assigned


def baseline_totals_km(
    assignments: list[tuple[Vehicle, list[Order]]],
    depot: tuple[float, float],
) -> dict[int, float]:
    out: dict[int, float] = {}
    for vehicle, load in assignments:
        vid = vehicle.id if vehicle.id is not None else id(vehicle)
        out[vid] = tour_km(load, depot)
    return out
