"""SQLModel → OpenAPI response models."""

from __future__ import annotations

from greenlogix_api.models import Route, Stop
from greenlogix_api.schemas import RouteOut, StopOut
from greenlogix_api.solver import PlannedRoute, PlannedStop


def stop_out(stop: Stop) -> StopOut:
    return StopOut(
        id=stop.id or 0,
        seq=stop.seq,
        kind=stop.kind,
        order_id=stop.order_id,
        lat=stop.lat,
        lng=stop.lng,
        address=stop.address,
        phone=stop.phone,
        window_start=stop.window_start,
        window_end=stop.window_end,
        notes=stop.notes,
        kg=stop.kg,
        status=stop.status,
        fail_reason=stop.fail_reason,
    )


def route_out(route: Route, stops: list[Stop]) -> RouteOut:
    ordered = sorted(stops, key=lambda s: s.seq)
    return RouteOut(
        id=route.id or 0,
        vehicle_id=route.vehicle_id,
        plate=route.plate,
        color=route.color,
        published=route.published,
        km=route.km,
        litres=route.litres,
        kg_co2=route.kg_co2,
        overload=route.overload,
        stops=[stop_out(s) for s in ordered],
    )


def planned_to_stop_models(route_id: int, planned: PlannedRoute) -> list[Stop]:
    rows: list[Stop] = []
    for stop in planned.stops:
        rows.append(_planned_stop_row(route_id, stop))
    return rows


def _planned_stop_row(route_id: int, stop: PlannedStop) -> Stop:
    order = stop.order
    return Stop(
        route_id=route_id,
        seq=stop.seq,
        kind=stop.kind,
        order_id=order.id if order is not None else None,
        lat=stop.lat,
        lng=stop.lng,
        address=stop.address,
        phone=stop.phone,
        window_start=stop.window_start,
        window_end=stop.window_end,
        notes=stop.notes,
        kg=stop.kg,
        status="pending",
        fail_reason=None,
    )
