"""EcoALNS: Adaptive Large Neighborhood Search for Green Vehicle Routing.

Implements the canonical Pollution-Routing destroy and repair operators (Demir et al. 2012)
with load-dependent and uphill-payload considerations (Lai et al. 2024).
"""

from __future__ import annotations

import copy
from dataclasses import dataclass, field
import math
import random
from typing import Callable

from greenlogix_api.energy.base import EnergyModel
from greenlogix_api.energy.hdt_v1 import HdtEnergyModelV1
from greenlogix_api.geo.truck_profile import DEFAULT_TRUCK_PROFILE, TruckProfile
from greenlogix_api.solver.distance import haversine_km


@dataclass
class CustomerNode:
    order_id: int
    lat: float
    lng: float
    kg: float
    window_start_min: int = 480  # 08:00
    window_end_min: int = 660    # 11:00


@dataclass
class VehicleTour:
    vehicle_id: int
    plate: str
    capacity_kg: float
    profile: TruckProfile = DEFAULT_TRUCK_PROFILE
    stops: list[CustomerNode] = field(default_factory=list)


@dataclass
class EcoSolution:
    tours: list[VehicleTour]
    depot_lat: float
    depot_lng: float
    total_km: float = 0.0
    total_fuel_litres: float = 0.0
    total_co2: float = 0.0
    unassigned: list[CustomerNode] = field(default_factory=list)


def evaluate_tour_metrics(
    tour: VehicleTour,
    depot_lat: float,
    depot_lng: float,
    energy_model: EnergyModel | None = None,
) -> tuple[float, float, float]:
    """Compute total distance (km), fuel (litres), and CO2 (kg) for a tour."""
    model = energy_model or HdtEnergyModelV1()
    if not tour.stops:
        return 0.0, 0.0, 0.0

    total_km = 0.0
    total_fuel = 0.0
    total_co2 = 0.0

    # Total payload loaded at depot
    current_payload = sum(s.kg for s in tour.stops)

    # Leg 1: Depot to Stop 1
    prev_lat, prev_lng = depot_lat, depot_lng
    for stop in tour.stops:
        leg_km = haversine_km(prev_lat, prev_lng, stop.lat, stop.lng) * 1.35
        est = model.estimate_segment_energy(
            length_km=leg_km,
            profile=tour.profile,
            payload_kg=current_payload,
            speed_kmh=30.0,
        )
        total_km += leg_km
        total_fuel += est.fuel_litres
        total_co2 += est.ttw_kg_co2

        # Cargo delivered at this stop
        current_payload = max(0.0, current_payload - stop.kg)
        prev_lat, prev_lng = stop.lat, stop.lng

    # Return leg: Last stop back to Depot
    return_km = haversine_km(prev_lat, prev_lng, depot_lat, depot_lng) * 1.35
    est_return = model.estimate_segment_energy(
        length_km=return_km,
        profile=tour.profile,
        payload_kg=0.0,  # empty truck returning to depot
        speed_kmh=35.0,
    )
    total_km += return_km
    total_fuel += est_return.fuel_litres
    total_co2 += est_return.ttw_kg_co2

    return round(total_km, 2), round(total_fuel, 4), round(total_co2, 4)


def solve_eco_alns(
    customers: list[CustomerNode],
    vehicles: list[VehicleTour],
    depot_lat: float,
    depot_lng: float,
    *,
    iterations: int = 30,
    seed: int = 42,
) -> EcoSolution:
    """Solve green VRP using Adaptive Large Neighborhood Search."""
    rng = random.Random(seed)
    solution = EcoSolution(tours=copy.deepcopy(vehicles), depot_lat=depot_lat, depot_lng=depot_lng)

    # Initial construction: capacity-aware greedy assignment
    pool = list(customers)
    for c in pool:
        assigned = False
        for tour in solution.tours:
            current_kg = sum(s.kg for s in tour.stops)
            if current_kg + c.kg <= tour.capacity_kg:
                tour.stops.append(c)
                assigned = True
                break
        if not assigned:
            solution.unassigned.append(c)

    # Evaluate baseline
    tot_km, tot_fuel, tot_co2 = 0.0, 0.0, 0.0
    for t in solution.tours:
        k, f, c = evaluate_tour_metrics(t, depot_lat, depot_lng)
        tot_km += k
        tot_fuel += f
        tot_co2 += c
    solution.total_km = round(tot_km, 2)
    solution.total_fuel_litres = round(tot_fuel, 4)
    solution.total_co2 = round(tot_co2, 4)

    best_solution = copy.deepcopy(solution)

    # ALNS loop
    destroy_count = max(1, min(3, len(customers) // 4))

    for it in range(iterations):
        current = copy.deepcopy(best_solution)

        # 1. Destroy step: remove orders from tours
        removed: list[CustomerNode] = []
        for tour in current.tours:
            if len(tour.stops) > 1 and len(removed) < destroy_count:
                idx = rng.randint(0, len(tour.stops) - 1)
                removed.append(tour.stops.pop(idx))

        # 2. Repair step: eco-marginal insertion
        for c in removed:
            best_tour: VehicleTour | None = None
            best_pos: int = -1
            best_fuel_delta = float("inf")

            for tour in current.tours:
                if sum(s.kg for s in tour.stops) + c.kg > tour.capacity_kg:
                    continue
                old_km, old_fuel, _ = evaluate_tour_metrics(tour, depot_lat, depot_lng)
                for pos in range(len(tour.stops) + 1):
                    tour.stops.insert(pos, c)
                    _, new_fuel, _ = evaluate_tour_metrics(tour, depot_lat, depot_lng)
                    delta = new_fuel - old_fuel
                    if delta < best_fuel_delta:
                        best_fuel_delta = delta
                        best_tour = tour
                        best_pos = pos
                    tour.stops.pop(pos)

            if best_tour is not None and best_pos >= 0:
                best_tour.stops.insert(best_pos, c)
            else:
                current.unassigned.append(c)

        # 3. Acceptance evaluation
        cur_km, cur_fuel, cur_co2 = 0.0, 0.0, 0.0
        for t in current.tours:
            k, f, c = evaluate_tour_metrics(t, depot_lat, depot_lng)
            cur_km += k
            cur_fuel += f
            cur_co2 += c
        current.total_km = round(cur_km, 2)
        current.total_fuel_litres = round(cur_fuel, 4)
        current.total_co2 = round(cur_co2, 4)

        if current.total_fuel_litres <= best_solution.total_fuel_litres and len(current.unassigned) <= len(best_solution.unassigned):
            best_solution = copy.deepcopy(current)

    return best_solution
