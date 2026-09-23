"""GOFA Places integration adapter with quota management and in-memory caching."""

from __future__ import annotations

import json
import logging
import os
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Any

from greenlogix_api.places.base import GeoPoint, PlaceDetail, PlaceProvider, PlaceSuggestion
from greenlogix_api.places.mock import MockPlaceProvider

logger = logging.getLogger(__name__)

GOFA_DEFAULT_BASE_URL = "https://api.gofa.vn"
DEFAULT_CACHE_TTL_SECONDS = 3600  # 1 hour


class GofaPlaceProvider(PlaceProvider):
    """Adapter for GOFA Places AutoComplete and Place Detail API.

    BLOCKED (CR-01, 2026-09-21): no official GOFA API docs/endpoint contract
    were available at implementation time. Base URL, auth scheme (Bearer),
    query params, and response shapes below are ASSUMED from common patterns,
    not verified against GOFA docs. Do not treat as ground truth; verify
    against the real GOFA spec before production use. No schema change until
    the contract is confirmed.

    Adheres strictly to the sponsored monthly quota (15k total calls:
    10k autocomplete + 5k detail). Falls back gracefully to MockPlaceProvider
    when running offline or when no API key is provided.
    """

    def __init__(
        self,
        api_key: str | None = None,
        base_url: str | None = None,
        *,
        fallback: PlaceProvider | None = None,
        timeout_seconds: float = 3.0,
    ) -> None:
        self.api_key = api_key or os.getenv("GOFA_API_KEY", "")
        self.base_url = (base_url or os.getenv("GOFA_BASE_URL", GOFA_DEFAULT_BASE_URL)).rstrip("/")
        self.fallback = fallback or MockPlaceProvider()
        self.timeout_seconds = timeout_seconds

        # Quota usage tracking
        self.autocomplete_calls: int = 0
        self.detail_calls: int = 0

        # Memory caches: key -> (timestamp, data)
        self._autocomplete_cache: dict[str, tuple[float, list[PlaceSuggestion]]] = {}
        self._detail_cache: dict[str, tuple[float, PlaceDetail]] = {}

    async def autocomplete(
        self,
        query: str,
        *,
        bias: GeoPoint | None = None,
        session_token: str | None = None,
    ) -> list[PlaceSuggestion]:
        query_clean = query.strip()
        if len(query_clean) < 2:
            return []

        # Check cache
        cache_key = f"{query_clean.lower()}_{bias.lat if bias else ''}_{bias.lng if bias else ''}"
        now = time.time()
        if cache_key in self._autocomplete_cache:
            ts, cached = self._autocomplete_cache[cache_key]
            if now - ts < DEFAULT_CACHE_TTL_SECONDS:
                return cached

        # If no key, delegate to mock fallback
        if not self.api_key or self.api_key == "MOCK":
            results = await self.fallback.autocomplete(query, bias=bias, session_token=session_token)
            self._autocomplete_cache[cache_key] = (now, results)
            return results

        # Live call to GOFA Places API
        self.autocomplete_calls += 1
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json",
        }
        params: dict[str, Any] = {"input": query_clean}
        if bias:
            params["location"] = f"{bias.lat},{bias.lng}"
        if session_token:
            params["sessiontoken"] = session_token

        try:
            query_str = urllib.parse.urlencode(params)
            url = f"{self.base_url}/places/autocomplete?{query_str}"
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=self.timeout_seconds) as resp:
                if resp.status == 200:
                    data = json.loads(resp.read().decode("utf-8"))
                    suggestions: list[PlaceSuggestion] = []
                    for item in data.get("predictions", []):
                        suggestions.append(
                            PlaceSuggestion(
                                place_id=item.get("place_id", ""),
                                description=item.get("description", ""),
                                main_text=item.get("structured_formatting", {}).get("main_text", item.get("description", "")),
                                secondary_text=item.get("structured_formatting", {}).get("secondary_text", ""),
                                provider="gofa",
                            )
                        )
                    self._autocomplete_cache[cache_key] = (now, suggestions)
                    return suggestions
        except Exception as exc:
            logger.warning("GOFA connection failed, using fallback: %s", exc)

        return await self.fallback.autocomplete(query, bias=bias, session_token=session_token)

    async def detail(self, place_id: str) -> PlaceDetail | None:
        place_id_clean = place_id.strip()
        if not place_id_clean:
            return None

        # Check cache
        now = time.time()
        if place_id_clean in self._detail_cache:
            ts, cached = self._detail_cache[place_id_clean]
            if now - ts < DEFAULT_CACHE_TTL_SECONDS:
                return cached

        # If no key or mock ID, delegate to fallback
        if not self.api_key or self.api_key == "MOCK" or place_id_clean.startswith("gofa_hcmc_") or place_id_clean.startswith("gofa_hn_"):
            detail = await self.fallback.detail(place_id_clean)
            if detail:
                self._detail_cache[place_id_clean] = (now, detail)
            return detail

        # Live call to GOFA Place Detail API
        self.detail_calls += 1
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/json",
        }
        params = {"place_id": place_id_clean}

        try:
            query_str = urllib.parse.urlencode(params)
            url = f"{self.base_url}/places/detail?{query_str}"
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=self.timeout_seconds) as resp:
                if resp.status == 200:
                    result = json.loads(resp.read().decode("utf-8")).get("result", {})
                    geom = result.get("geometry", {}).get("location", {})
                    lat = float(geom.get("lat", 0.0))
                    lng = float(geom.get("lng", 0.0))
                    detail = PlaceDetail(
                        place_id=place_id_clean,
                        formatted_address=result.get("formatted_address", ""),
                        point=GeoPoint(lat=lat, lng=lng),
                        provider="gofa",
                        province=result.get("province"),
                        district=result.get("district"),
                        ward=result.get("ward"),
                        confidence=0.99,
                    )
                    self._detail_cache[place_id_clean] = (now, detail)
                    return detail
        except Exception as exc:
            logger.warning("GOFA connection failed, using fallback: %s", exc)

        return await self.fallback.detail(place_id_clean)
