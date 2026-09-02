"""Nearest-neighbor from depot + 2-opt (VRP-04, D-16)."""

from __future__ import annotations

from greenlogix_api.models import Order
from greenlogix_api.solver.distance import road_km

MAX_TWO_OPT_ITERS = 500
MAX_TWO_OPT_SWAPS = 2000


def tour_km(orders: list[Order], depot: tuple[float, float]) -> float:
    if not orders:
        return 0.0
    lat, lng = depot
    total = 0.0
    for order in orders:
        total += road_km(lat, lng, order.lat, order.lng)
        lat, lng = order.lat, order.lng
    total += road_km(lat, lng, depot[0], depot[1])
    return total


def nearest_neighbor(orders: list[Order], depot: tuple[float, float]) -> list[Order]:
    remaining = list(orders)
    route: list[Order] = []
    lat, lng = depot
    while remaining:
        best: Order | None = None
        best_d = 0.0
        for order in remaining:
            dist = road_km(lat, lng, order.lat, order.lng)
            if best is None:
                best, best_d = order, dist
                continue
            if dist < best_d - 1e-12:
                best, best_d = order, dist
            elif abs(dist - best_d) <= 1e-12 and order.window_start < best.window_start:
                best, best_d = order, dist
        assert best is not None
        remaining.remove(best)
        route.append(best)
        lat, lng = best.lat, best.lng
    return route


def two_opt(orders: list[Order], depot: tuple[float, float]) -> list[Order]:
    route = list(orders)
    n = len(route)
    if n < 4:
        return route
    iterations = 0
    swaps = 0
    while iterations < MAX_TWO_OPT_ITERS and swaps < MAX_TWO_OPT_SWAPS:
        iterations += 1
        improved = False
        current = tour_km(route, depot)
        for i in range(n - 1):
            for k in range(i + 2, n):
                if swaps >= MAX_TWO_OPT_SWAPS:
                    return route
                candidate = route[: i + 1] + list(reversed(route[i + 1 : k + 1])) + route[k + 1 :]
                new_km = tour_km(candidate, depot)
                if new_km < current - 1e-12:
                    route = candidate
                    current = new_km
                    swaps += 1
                    improved = True
                    break
            if improved:
                break
        if not improved:
            break
    return route


def sequence_orders(orders: list[Order], depot: tuple[float, float]) -> list[Order]:
    return two_opt(nearest_neighbor(orders, depot), depot)
