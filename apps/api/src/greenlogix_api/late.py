"""Haversine ETA vs window_end at 30 km/h. No traffic API."""

from __future__ import annotations

from datetime import datetime, time, timedelta
from zoneinfo import ZoneInfo

from greenlogix_api.seed import DEPOT_LAT, DEPOT_LNG
from greenlogix_api.solver.distance import road_km

SPEED_KMH = 30.0
HCMC_TZ = ZoneInfo("Asia/Ho_Chi_Minh")


def now_hcmc() -> datetime:
    return datetime.now(HCMC_TZ)


def eta_minutes(
    lat: float,
    lng: float,
    depot_lat: float = DEPOT_LAT,
    depot_lng: float = DEPOT_LNG,
) -> float:
    return road_km(depot_lat, depot_lng, lat, lng) / SPEED_KMH * 60.0


def parse_hhmm(window_end: str) -> time | None:
    text = (window_end or "").strip()
    if len(text) >= 5 and text[2] == ":":
        try:
            hour = int(text[:2])
            minute = int(text[3:5])
            return time(hour, minute)
        except ValueError:
            return None
    return None


def late_risk(
    lat: float,
    lng: float,
    window_end: str,
    *,
    depot_lat: float = DEPOT_LAT,
    depot_lng: float = DEPOT_LNG,
    now: datetime | None = None,
) -> bool:
    """True when depot→stop road ETA at 30 km/h would miss today's window_end."""
    clock = now or now_hcmc()
    if clock.tzinfo is None:
        clock = clock.replace(tzinfo=HCMC_TZ)
    else:
        clock = clock.astimezone(HCMC_TZ)
    end = parse_hhmm(window_end)
    if end is None:
        return False
    deadline = datetime.combine(clock.date(), end, tzinfo=HCMC_TZ)
    arrival = clock + timedelta(minutes=eta_minutes(lat, lng, depot_lat, depot_lng))
    return arrival > deadline


def matches_q(address: str, phone: str, receiver: str, q: str | None) -> bool:
    needle = (q or "").strip().casefold()
    if not needle:
        return True
    return any(needle in field.casefold() for field in (address, phone, receiver))
