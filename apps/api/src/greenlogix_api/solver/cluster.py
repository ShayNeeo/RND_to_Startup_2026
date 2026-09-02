"""Greedy radius clustering on lat/lng (VRP-01, D-16). No sklearn."""

from __future__ import annotations

from greenlogix_api.models import Order
from greenlogix_api.solver.distance import haversine_km

CLUSTER_RADIUS_KM = 3.0


def greedy_clusters(
    orders: list[Order],
    radius_km: float = CLUSTER_RADIUS_KM,
) -> list[list[Order]]:
    remaining = list(orders)
    clusters: list[list[Order]] = []
    while remaining:
        seed = remaining.pop(0)
        cluster = [seed]
        kept: list[Order] = []
        for order in remaining:
            if haversine_km(seed.lat, seed.lng, order.lat, order.lng) <= radius_km:
                cluster.append(order)
            else:
                kept.append(order)
        remaining = kept
        clusters.append(cluster)
    return clusters
