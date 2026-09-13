"""Heuristic VRP: cluster → capacity split → NN+2-opt; plus D-17 baseline."""

from __future__ import annotations

from collections.abc import Callable
from dataclasses import dataclass, field

from greenlogix_api.carbon import kg_co2, litres_used
from greenlogix_api.models import Order, Vehicle
from greenlogix_api.schemas import TotalsOut
from greenlogix_api.solver.baseline import baseline_fill
from greenlogix_api.solver.cluster import CLUSTER_RADIUS_KM, greedy_clusters
from greenlogix_api.solver.distance import road_km
from greenlogix_api.solver.eco import eco_weight_from_env, make_eco_pair_km
from greenlogix_api.solver.nn_two_opt import sequence_orders, tour_km
from greenlogix_api.solver.road_baseline import (
    RoadBaseline,
    materialize_matrix,
    resolve_road_baseline,
)

PairKm = Callable[[float, float, float, float], float]

ROUTE_COLORS = [
    "#e41a1c",
    "#377eb8",
    "#4daf4a",
    "#984ea3",
    "#ff7f00",
    "#a65628",
    "#f781bf",
    "#999999",
    "#66c2a5",
    "#fc8d62",
]


@dataclass
class PlannedStop:
    seq: int
    kind: str
    order: Order | None
    lat: float
    lng: float
    address: str
    phone: str
    window_start: str
    window_end: str
    notes: str
    kg: float


@dataclass
class PlannedRoute:
    vehicle: Vehicle
    orders: list[Order]
    overload: bool
    km: float
    litres: float
    kg_co2: float
    color: str
    stops: list[PlannedStop] = field(default_factory=list)


@dataclass
class VrpResult:
    routes: list[PlannedRoute]
    unassigned_ids: list[int]
    totals: TotalsOut
    baseline: TotalsOut


def _depot_stop(seq: int, depot: tuple[float, float], name: str) -> PlannedStop:
    return PlannedStop(
        seq=seq,
        kind="depot",
        order=None,
        lat=depot[0],
        lng=depot[1],
        address=name,
        phone="",
        window_start="",
        window_end="",
        notes="",
        kg=0.0,
    )


def _stop_from_order(seq: int, order: Order) -> PlannedStop:
    return PlannedStop(
        seq=seq,
        kind="stop",
        order=order,
        lat=order.lat,
        lng=order.lng,
        address=order.address,
        phone=order.phone,
        window_start=order.window_start,
        window_end=order.window_end,
        notes=order.notes,
        kg=order.kg,
    )


def _metrics(km: float, vehicle: Vehicle) -> tuple[float, float]:
    liq = litres_used(km, vehicle.l_per_100km)
    co2 = kg_co2(km, vehicle.l_per_100km, vehicle.fuel)
    return liq, co2


def _sum_totals(routes: list[PlannedRoute]) -> TotalsOut:
    return TotalsOut(
        km=sum(r.km for r in routes),
        litres=sum(r.litres for r in routes),
        kg_co2=sum(r.kg_co2 for r in routes),
    )


def _split_cluster(
    cluster: list[Order],
    vehicle: Vehicle,
) -> tuple[list[Order], list[Order], bool]:
    load: list[Order] = []
    leftover: list[Order] = []
    kg = 0.0
    overflow = False
    for order in cluster:
        if kg + order.kg <= vehicle.capacity_kg:
            load.append(order)
            kg += order.kg
        else:
            leftover.append(order)
            overflow = True
    overload = overflow or kg > vehicle.capacity_kg
    return load, leftover, overload


def assign_clusters(
    clusters: list[list[Order]],
    vehicles: list[Vehicle],
) -> tuple[list[tuple[Vehicle, list[Order], bool]], list[int]]:
    ready = [v for v in vehicles if v.status == "ready"]
    ready.sort(key=lambda v: (-v.capacity_kg, v.plate))
    ranked = sorted(clusters, key=lambda c: -sum(o.kg for o in c))
    assigned: list[tuple[Vehicle, list[Order], bool]] = []
    unassigned: list[int] = []
    vi = 0
    for cluster in ranked:
        leftover = list(cluster)
        cluster_kg = sum(o.kg for o in cluster)
        while leftover and vi < len(ready):
            vehicle = ready[vi]
            vi += 1
            load, leftover, split_over = _split_cluster(leftover, vehicle)
            overload = split_over or cluster_kg > vehicle.capacity_kg
            if load:
                assigned.append((vehicle, load, overload))
            else:
                for order in leftover:
                    if order.id is not None:
                        unassigned.append(order.id)
                leftover = []
                break
        for order in leftover:
            if order.id is not None:
                unassigned.append(order.id)
    return assigned, unassigned


def _build_route(
    vehicle: Vehicle,
    orders: list[Order],
    overload: bool,
    depot: tuple[float, float],
    depot_name: str,
    color: str,
    *,
    sequence: bool,
    pair_km: PairKm = road_km,
    eco_weight: float = 0.0,
) -> PlannedRoute:
    cost_fn = (
        make_eco_pair_km(pair_km, vehicle.l_per_100km, vehicle.fuel, eco_weight)
        if eco_weight
        else pair_km
    )
    sequenced = sequence_orders(orders, depot, pair_km=pair_km, cost_fn=cost_fn) if sequence else list(orders)
    km = tour_km(sequenced, depot, pair_km=pair_km)
    liq, co2 = _metrics(km, vehicle)
    stops = [_depot_stop(0, depot, depot_name)]
    for i, order in enumerate(sequenced, start=1):
        stops.append(_stop_from_order(i, order))
    stops.append(_depot_stop(len(stops), depot, depot_name))
    return PlannedRoute(
        vehicle=vehicle,
        orders=sequenced,
        overload=overload,
        km=km,
        litres=liq,
        kg_co2=co2,
        color=color,
        stops=stops,
    )


def run_vrp(
    orders: list[Order],
    vehicles: list[Vehicle],
    depot: tuple[float, float],
    depot_name: str,
    radius_km: float = CLUSTER_RADIUS_KM,
    pair_km: PairKm | None = None,
    eco_weight: float | None = None,
    road_baseline: RoadBaseline | None = None,
) -> VrpResult:
    if pair_km is None:
        provider = road_baseline or resolve_road_baseline()
        points = [depot, *[(order.lat, order.lng) for order in orders]]
        cached, _name = materialize_matrix(provider, points)
        pair_km = cached.pair_km
    weight = eco_weight if eco_weight is not None else eco_weight_from_env()
    clusters = greedy_clusters(orders, radius_km=radius_km)
    assigned, unassigned_ids = assign_clusters(clusters, vehicles)
    routes: list[PlannedRoute] = []
    for i, (vehicle, load, overload) in enumerate(assigned):
        color = ROUTE_COLORS[i % len(ROUTE_COLORS)]
        routes.append(
            _build_route(
                vehicle,
                load,
                overload,
                depot,
                depot_name,
                color,
                sequence=True,
                pair_km=pair_km,
                eco_weight=weight,
            )
        )

    base_assign = baseline_fill(orders, vehicles)
    baseline_routes: list[PlannedRoute] = []
    for i, (vehicle, load) in enumerate(base_assign):
        baseline_routes.append(
            _build_route(
                vehicle,
                load,
                False,
                depot,
                depot_name,
                ROUTE_COLORS[i % len(ROUTE_COLORS)],
                sequence=False,
                pair_km=pair_km,
                eco_weight=weight,
            )
        )
    return VrpResult(
        routes=routes,
        unassigned_ids=unassigned_ids,
        totals=_sum_totals(routes),
        baseline=_sum_totals(baseline_routes),
    )
