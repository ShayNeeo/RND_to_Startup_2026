"""Optimize / publish. Cluster + NN + 2-opt, OSM consumer of /routes."""

from __future__ import annotations

import logging

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from greenlogix_api.auth import require_dispatcher
from greenlogix_api.carbon import save_report
from greenlogix_api.db import get_session
from greenlogix_api.models import Order, Route, Stop, Vehicle
from greenlogix_api.schemas import OptimizeIn, OptimizeOut, PublishIn, RouteOut
from greenlogix_api.seed import DEPOT_LAT, DEPOT_LNG, DEPOT_NAME
from greenlogix_api.serialize import planned_to_stop_models, route_out
from greenlogix_api.solver import run_vrp
from greenlogix_api.solver.cluster import CLUSTER_RADIUS_KM

log = logging.getLogger("greenlogix")

router = APIRouter(tags=["optimize"])


def _load_stops(session: Session, route_id: int) -> list[Stop]:
    return list(session.exec(select(Stop).where(Stop.route_id == route_id)).all())


def persist_plan(session: Session, result, *, wipe: bool = True) -> list[Route]:
    if wipe:
        for stop in session.exec(select(Stop)).all():
            session.delete(stop)
        for route in session.exec(select(Route)).all():
            session.delete(route)
        session.commit()

    stored: list[Route] = []
    for planned in result.routes:
        vehicle = planned.vehicle
        route = Route(
            vehicle_id=vehicle.id or 0,
            plate=vehicle.plate,
            color=planned.color,
            published=False,
            km=planned.km,
            litres=planned.litres,
            kg_co2=planned.kg_co2,
            overload=planned.overload,
        )
        session.add(route)
        session.commit()
        session.refresh(route)
        rid = route.id or 0
        for stop in planned_to_stop_models(rid, planned):
            session.add(stop)
        session.commit()
        stored.append(route)
        log.info("persist route_id=%s vehicle_id=%s stops=%s", rid, route.vehicle_id, len(planned.stops))
    save_report(result.baseline, result.totals)
    return stored


@router.post("/optimize", response_model=OptimizeOut)
def optimize(
    body: OptimizeIn,
    session: Session = Depends(get_session),
    _: None = Depends(require_dispatcher),
) -> OptimizeOut:
    radius = body.cluster_radius_km if body.cluster_radius_km else CLUSTER_RADIUS_KM
    orders = list(session.exec(select(Order)).all())
    vehicles = list(session.exec(select(Vehicle)).all())
    log.info("path=/optimize orders=%s vehicles=%s radius=%s", [o.id for o in orders], len(vehicles), radius)
    result = run_vrp(
        orders,
        vehicles,
        depot=(DEPOT_LAT, DEPOT_LNG),
        depot_name=DEPOT_NAME,
        radius_km=radius,
    )
    stored = persist_plan(session, result)
    outs: list[RouteOut] = []
    for route in stored:
        outs.append(route_out(route, _load_stops(session, route.id or 0)))
    return OptimizeOut(
        routes=outs,
        unassigned_order_ids=result.unassigned_ids,
        totals=result.totals,
    )


@router.get("/routes", response_model=list[RouteOut])
def list_routes(
    session: Session = Depends(get_session),
    _: None = Depends(require_dispatcher),
) -> list[RouteOut]:
    log.info("path=/routes")
    routes = list(session.exec(select(Route)).all())
    return [route_out(r, _load_stops(session, r.id or 0)) for r in routes]


@router.post("/routes/publish", response_model=list[RouteOut])
def publish_routes(
    body: PublishIn,
    session: Session = Depends(get_session),
    _: None = Depends(require_dispatcher),
) -> list[RouteOut]:
    log.info("path=/routes/publish")
    all_routes = list(session.exec(select(Route)).all())
    if body.route_ids:
        wanted = set(body.route_ids)
        routes = [r for r in all_routes if r.id in wanted]
    else:
        routes = [r for r in all_routes if not r.published]
    for route in routes:
        route.published = True
        session.add(route)
    session.commit()
    published = [r for r in session.exec(select(Route)).all() if r.published]
    return [route_out(r, _load_stops(session, r.id or 0)) for r in published]
