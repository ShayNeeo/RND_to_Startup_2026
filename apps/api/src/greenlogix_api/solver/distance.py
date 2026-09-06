"""Haversine × HCMC circuity (D-07, VRP-03). Same factor on baseline and optimized."""

from __future__ import annotations

import math

HCMC_CIRCUITY = 1.35
EARTH_RADIUS_KM = 6371.0


def haversine_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlmb = math.radians(lng2 - lng1)
    a = math.sin(dphi / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dlmb / 2) ** 2
    return 2 * EARTH_RADIUS_KM * math.asin(math.sqrt(min(1.0, a)))


def road_km(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    return haversine_km(lat1, lng1, lat2, lng2) * HCMC_CIRCUITY
