"""Before/after km, litres, CO₂. Zeros until the solver writes totals."""

from __future__ import annotations

import logging

from fastapi import APIRouter, Depends

from greenlogix_api.auth import require_dispatcher
from greenlogix_api.schemas import ZERO_DELTA, ZERO_REPORT_TOTALS, ReportOut

log = logging.getLogger("greenlogix")

router = APIRouter(tags=["report"])


@router.get("/report", response_model=ReportOut)
def report(_: None = Depends(require_dispatcher)) -> ReportOut:
    log.info("path=/report")
    return ReportOut(
        baseline=ZERO_REPORT_TOTALS,
        optimized=ZERO_REPORT_TOTALS,
        delta=ZERO_DELTA,
    )
