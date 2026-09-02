"""Before/after km, litres, CO₂ from last optimize (RPT-02)."""

from __future__ import annotations

import logging

from fastapi import APIRouter, Depends

from greenlogix_api.auth import require_dispatcher
from greenlogix_api.carbon import delta_from_totals, load_report
from greenlogix_api.schemas import ZERO_DELTA, ZERO_REPORT_TOTALS, ReportOut

log = logging.getLogger("greenlogix")

router = APIRouter(tags=["report"])


@router.get("/report", response_model=ReportOut)
def report(_: None = Depends(require_dispatcher)) -> ReportOut:
    log.info("path=/report")
    stored = load_report()
    if stored is None:
        return ReportOut(
            baseline=ZERO_REPORT_TOTALS,
            optimized=ZERO_REPORT_TOTALS,
            delta=ZERO_DELTA,
        )
    # Recompute so km_pct is owned here, not a marketing constant (RPT-02).
    delta = delta_from_totals(stored.baseline, stored.optimized)
    km_pct = delta.km_pct
    log.info("km_pct=%s", km_pct)
    return ReportOut(baseline=stored.baseline, optimized=stored.optimized, delta=delta)
