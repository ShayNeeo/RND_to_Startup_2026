"""Road-network distance providers (OSM now, Google Directions later).

Google-class baseline is Valhalla auto/truck or OSRM driving until a Google
Maps key is configured. Circuity (haversine × HCMC_CIRCUITY) is the offline
fallback so CI and the demo never depend on a local OSM extract. Do not scrape
Google.
"""

from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from collections.abc import Callable, Sequence
from typing import Any, Protocol

from greenlogix_api.solver.distance import HCMC_CIRCUITY, haversine_km

LatLng = tuple[float, float]
Transport = Callable[[str, str, bytes | None], dict[str, Any]]

DEFAULT_OSRM_URL = "https://router.project-osrm.org"
DEFAULT_VALHALLA_URL = "https://valhalla1.openstreetmap.de"
DEFAULT_TIMEOUT_S = 2.5


class RoadBaselineError(Exception):
    """OSM / Google provider failure."""


class RoadBaselineNotConfigured(RoadBaselineError):
    """Provider selected but credentials or client are missing."""


class RoadBaseline(Protocol):
    provider_id: str

    def pair_km(self, lat1: float, lng1: float, lat2: float, lng2: float) -> float: ...

    def matrix_km(self, points: Sequence[LatLng]) -> list[list[float]]: ...


def _key(lat: float, lng: float) -> tuple[float, float]:
    return (round(lat, 5), round(lng, 5))


def default_transport(
    url: str,
    method: str,
    body: bytes | None,
    *,
    timeout_s: float = DEFAULT_TIMEOUT_S,
) -> dict[str, Any]:
    req = urllib.request.Request(url, data=body, method=method)
    req.add_header("User-Agent", "GreenLogix-RoadBaseline/1.0")
    if body is not None:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=timeout_s) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as exc:
        raise RoadBaselineError(str(exc)) from exc


class CircuityRoadBaseline:
    """Always-available fallback: haversine × HCMC_CIRCUITY=1.35."""

    provider_id = "circuity"

    def pair_km(self, lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        return haversine_km(lat1, lng1, lat2, lng2) * HCMC_CIRCUITY

    def matrix_km(self, points: Sequence[LatLng]) -> list[list[float]]:
        return [[self.pair_km(a[0], a[1], b[0], b[1]) for b in points] for a in points]


class CachedMatrixBaseline:
    """O(1) pair lookups from a precomputed matrix; circuity on a miss."""

    def __init__(
        self,
        points: Sequence[LatLng],
        matrix: list[list[float]],
        fallback: RoadBaseline | None = None,
        provider_id: str = "matrix_cache",
    ) -> None:
        self.provider_id = provider_id
        self._index = {_key(*pt): i for i, pt in enumerate(points)}
        self._matrix = matrix
        self._fallback = fallback or CircuityRoadBaseline()

    def pair_km(self, lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        i = self._index.get(_key(lat1, lng1))
        j = self._index.get(_key(lat2, lng2))
        if i is not None and j is not None:
            return float(self._matrix[i][j])
        return self._fallback.pair_km(lat1, lng1, lat2, lng2)

    def matrix_km(self, points: Sequence[LatLng]) -> list[list[float]]:
        return [[self.pair_km(a[0], a[1], b[0], b[1]) for b in points] for a in points]


class FallbackRoadBaseline:
    """Try primary OSM; fall back to circuity (or the next provider)."""

    provider_id = "fallback"

    def __init__(self, primary: RoadBaseline, fallback: RoadBaseline | None = None) -> None:
        self.primary = primary
        self.fallback = fallback or CircuityRoadBaseline()
        self.last_provider_id = self.fallback.provider_id

    def pair_km(self, lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        try:
            km = self.primary.pair_km(lat1, lng1, lat2, lng2)
            self.last_provider_id = self.primary.provider_id
            return km
        except Exception:
            self.last_provider_id = getattr(self.fallback, "last_provider_id", self.fallback.provider_id)
            return self.fallback.pair_km(lat1, lng1, lat2, lng2)

    def matrix_km(self, points: Sequence[LatLng]) -> list[list[float]]:
        try:
            matrix = self.primary.matrix_km(points)
            self.last_provider_id = self.primary.provider_id
            return matrix
        except Exception:
            self.last_provider_id = getattr(self.fallback, "last_provider_id", self.fallback.provider_id)
            return self.fallback.matrix_km(points)


def parse_osrm_table(payload: dict[str, Any]) -> list[list[float]]:
    if payload.get("code") != "Ok":
        raise ValueError(f"OSRM table error: {payload.get('code')!r}")
    distances = payload.get("distances")
    if not isinstance(distances, list) or not distances:
        raise ValueError("OSRM table missing distances")
    return [[float(cell) / 1000.0 for cell in row] for row in distances]


def osrm_table_url(base_url: str, points: Sequence[LatLng], profile: str = "driving") -> str:
    coords = ";".join(f"{lng},{lat}" for lat, lng in points)
    return f"{base_url.rstrip('/')}/table/v1/{profile}/{coords}?annotations=distance"


class OsrmRoadBaseline:
    """OSRM `/table/v1/driving` — Google Directions can replace this later."""

    provider_id = "osrm"

    def __init__(
        self,
        base_url: str = DEFAULT_OSRM_URL,
        *,
        timeout_s: float = DEFAULT_TIMEOUT_S,
        transport: Transport | None = None,
        profile: str = "driving",
    ) -> None:
        self.base_url = base_url.rstrip("/")
        self.timeout_s = timeout_s
        self.transport = transport
        self.profile = profile

    def _fetch(self, url: str, method: str, body: bytes | None) -> dict[str, Any]:
        if self.transport is not None:
            return self.transport(url, method, body)
        return default_transport(url, method, body, timeout_s=self.timeout_s)

    def matrix_km(self, points: Sequence[LatLng]) -> list[list[float]]:
        if len(points) < 2:
            return [[0.0] * len(points) for _ in points]
        payload = self._fetch(osrm_table_url(self.base_url, points, self.profile), "GET", None)
        return parse_osrm_table(payload)

    def pair_km(self, lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        return self.matrix_km([(lat1, lng1), (lat2, lng2)])[0][1]


def parse_valhalla_matrix(payload: dict[str, Any]) -> list[list[float]]:
    rows = payload.get("sources_to_targets")
    if not isinstance(rows, list) or not rows:
        raise ValueError("Valhalla matrix missing sources_to_targets")
    matrix: list[list[float]] = []
    for row in rows:
        matrix.append([float(cell["distance"]) for cell in row])
    return matrix


def valhalla_matrix_body(points: Sequence[LatLng], costing: str = "auto") -> dict[str, Any]:
    locs = [{"lat": lat, "lon": lng} for lat, lng in points]
    body: dict[str, Any] = {"sources": locs, "targets": locs, "costing": costing}
    if costing == "truck":
        # xe_tai_nho envelope — light truck, not a motorcycle.
        body["costing_options"] = {
            "truck": {"height": 2.4, "width": 2.0, "length": 5.2, "weight": 3.5}
        }
    return body


class ValhallaRoadBaseline:
    """Valhalla `/sources_to_targets` with auto or truck costing."""

    provider_id = "valhalla"

    def __init__(
        self,
        base_url: str = DEFAULT_VALHALLA_URL,
        *,
        costing: str = "auto",
        timeout_s: float = DEFAULT_TIMEOUT_S,
        transport: Transport | None = None,
    ) -> None:
        self.base_url = base_url.rstrip("/")
        self.costing = costing
        self.timeout_s = timeout_s
        self.transport = transport

    def _fetch(self, url: str, method: str, body: bytes | None) -> dict[str, Any]:
        if self.transport is not None:
            return self.transport(url, method, body)
        return default_transport(url, method, body, timeout_s=self.timeout_s)

    def matrix_km(self, points: Sequence[LatLng]) -> list[list[float]]:
        if len(points) < 2:
            return [[0.0] * len(points) for _ in points]
        payload = self._fetch(
            f"{self.base_url}/sources_to_targets",
            "POST",
            json.dumps(valhalla_matrix_body(points, self.costing)).encode("utf-8"),
        )
        return parse_valhalla_matrix(payload)

    def pair_km(self, lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        return self.matrix_km([(lat1, lng1), (lat2, lng2)])[0][1]


class GoogleDirectionsBaseline:
    """Stub so a Google Directions key can plug in behind RoadBaseline later."""

    provider_id = "google_directions"

    def __init__(self, api_key: str | None = None) -> None:
        if not api_key:
            raise RoadBaselineNotConfigured(
                "GOOGLE_MAPS_API_KEY not set; Google-class baseline is OSM (Valhalla/OSRM)"
            )
        raise RoadBaselineNotConfigured(
            "Google Directions client is not wired yet; keep using OSM RoadBaseline"
        )

    def pair_km(self, lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        raise RoadBaselineNotConfigured("Google Directions client is not wired yet")

    def matrix_km(self, points: Sequence[LatLng]) -> list[list[float]]:
        raise RoadBaselineNotConfigured("Google Directions client is not wired yet")


def resolve_road_baseline(
    name: str | None = None,
    *,
    osrm_url: str | None = None,
    valhalla_url: str | None = None,
    costing: str | None = None,
    transport: Transport | None = None,
) -> RoadBaseline:
    choice = (name or os.environ.get("ROAD_BASELINE") or "circuity").strip().lower()
    if choice in {"circuity", "haversine"}:
        return CircuityRoadBaseline()
    costing_name = (costing or os.environ.get("ROAD_BASELINE_COSTING") or "auto").strip().lower()
    shared = os.environ.get("ROAD_BASELINE_URL", "").strip()
    osrm = (osrm_url or os.environ.get("OSRM_URL") or (shared if choice == "osrm" else "") or DEFAULT_OSRM_URL)
    valhalla = (
        valhalla_url
        or os.environ.get("VALHALLA_URL")
        or (shared if choice == "valhalla" else "")
        or DEFAULT_VALHALLA_URL
    )
    if choice == "osrm":
        return FallbackRoadBaseline(OsrmRoadBaseline(osrm, transport=transport))
    if choice == "valhalla":
        return FallbackRoadBaseline(
            ValhallaRoadBaseline(valhalla, costing=costing_name, transport=transport)
        )
    return FallbackRoadBaseline(
        ValhallaRoadBaseline(valhalla, costing=costing_name, transport=transport),
        FallbackRoadBaseline(OsrmRoadBaseline(osrm, transport=transport)),
    )


def materialize_matrix(
    provider: RoadBaseline,
    points: Sequence[LatLng],
) -> tuple[RoadBaseline, str]:
    """Build a cached matrix once per optimize; fall back to circuity on failure."""
    try:
        matrix = provider.matrix_km(points)
        name = getattr(provider, "last_provider_id", None) or provider.provider_id
        return CachedMatrixBaseline(points, matrix, CircuityRoadBaseline(), name), name
    except Exception:
        return CircuityRoadBaseline(), "circuity"
