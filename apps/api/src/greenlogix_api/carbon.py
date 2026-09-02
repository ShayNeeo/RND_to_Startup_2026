"""TTW kg CO₂ from in-repo emission_factors.json (D-09, RPT-01)."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from greenlogix_api import db as dbmod
from greenlogix_api.schemas import ReportDelta, ReportOut, ReportTotals, TotalsOut

_cache: dict[str, Any] | None = None


def load_factors(path: Path | None = None) -> dict[str, Any]:
    global _cache
    target = path or dbmod.FACTORS_PATH
    if _cache is not None and path is None:
        return _cache
    data = json.loads(target.read_text(encoding="utf-8"))
    if path is None:
        _cache = data
    return data


def kg_co2_per_litre(fuel: str, path: Path | None = None) -> float:
    data = load_factors(path)
    key = (fuel or "").strip().lower()
    fuels = data.get("fuels") or {}
    for name, spec in fuels.items():
        aliases = [str(name).lower()]
        aliases.extend(str(a).lower() for a in (spec.get("aliases") or []))
        if key in aliases:
            return float(spec["kg_co2_per_litre"])
    raise ValueError(f"unknown fuel {fuel!r}")


def litres_used(km: float, l_per_100km: float) -> float:
    return km * (l_per_100km / 100.0)


def kg_co2(km: float, l_per_100km: float, fuel: str, path: Path | None = None) -> float:
    return litres_used(km, l_per_100km) * kg_co2_per_litre(fuel, path)


def totals_from_legs(
    km: float, l_per_100km: float, fuel: str, path: Path | None = None
) -> TotalsOut:
    liq = litres_used(km, l_per_100km)
    return TotalsOut(km=km, litres=liq, kg_co2=liq * kg_co2_per_litre(fuel, path))


def save_report(baseline: TotalsOut, optimized: TotalsOut, path: Path | None = None) -> None:
    target = path or dbmod.REPORT_PATH
    target.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "baseline": baseline.model_dump(),
        "optimized": optimized.model_dump(),
    }
    target.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


def load_report(path: Path | None = None) -> ReportOut | None:
    target = path or dbmod.REPORT_PATH
    if not target.is_file():
        return None
    raw = json.loads(target.read_text(encoding="utf-8"))
    baseline = ReportTotals(**raw["baseline"])
    optimized = ReportTotals(**raw["optimized"])
    bkm = baseline.km or 0.0
    delta = ReportDelta(
        km=baseline.km - optimized.km,
        litres=baseline.litres - optimized.litres,
        kg_co2=baseline.kg_co2 - optimized.kg_co2,
        km_pct=((baseline.km - optimized.km) / bkm * 100.0) if bkm else 0.0,
        litres_pct=(
            ((baseline.litres - optimized.litres) / baseline.litres * 100.0)
            if baseline.litres
            else 0.0
        ),
        kg_co2_pct=(
            ((baseline.kg_co2 - optimized.kg_co2) / baseline.kg_co2 * 100.0)
            if baseline.kg_co2
            else 0.0
        ),
    )
    return ReportOut(baseline=baseline, optimized=optimized, delta=delta)
