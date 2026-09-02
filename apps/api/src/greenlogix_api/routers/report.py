"""Before/after km, litres, CO₂ from last optimize (RPT-02)."""

from __future__ import annotations

import logging
from io import BytesIO

from fastapi import APIRouter, Depends
from fastapi.responses import Response
from openpyxl import Workbook

from greenlogix_api.auth import require_dispatcher
from greenlogix_api.carbon import delta_from_totals, load_report
from greenlogix_api.schemas import ZERO_DELTA, ZERO_REPORT_TOTALS, ReportOut

log = logging.getLogger("greenlogix")

router = APIRouter(tags=["report"])

XLSX_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"


def current_report() -> ReportOut:
    stored = load_report()
    if stored is None:
        return ReportOut(
            baseline=ZERO_REPORT_TOTALS,
            optimized=ZERO_REPORT_TOTALS,
            delta=ZERO_DELTA,
        )
    # Recompute so km_pct is owned here, not a marketing constant (RPT-02).
    delta = delta_from_totals(stored.baseline, stored.optimized)
    return ReportOut(baseline=stored.baseline, optimized=stored.optimized, delta=delta)


def report_workbook(payload: ReportOut) -> bytes:
    wb = Workbook()
    ws = wb.active
    assert ws is not None
    ws.title = "report"
    ws.append(["metric", "baseline", "optimized", "delta", "delta_pct"])
    rows = (
        ("km", payload.baseline.km, payload.optimized.km, payload.delta.km, payload.delta.km_pct),
        (
            "litres",
            payload.baseline.litres,
            payload.optimized.litres,
            payload.delta.litres,
            payload.delta.litres_pct,
        ),
        (
            "kg_co2",
            payload.baseline.kg_co2,
            payload.optimized.kg_co2,
            payload.delta.kg_co2,
            payload.delta.kg_co2_pct,
        ),
    )
    for row in rows:
        ws.append(list(row))
    buf = BytesIO()
    wb.save(buf)
    return buf.getvalue()


@router.get("/report", response_model=ReportOut)
def report(_: None = Depends(require_dispatcher)) -> ReportOut:
    log.info("path=/report")
    payload = current_report()
    log.info("km_pct=%s", payload.delta.km_pct)
    return payload


@router.get("/report.xlsx")
def report_xlsx(_: None = Depends(require_dispatcher)) -> Response:
    log.info("path=/report.xlsx")
    body = report_workbook(current_report())
    return Response(
        content=body,
        media_type=XLSX_TYPE,
        headers={"Content-Disposition": "attachment; filename=report.xlsx"},
    )
