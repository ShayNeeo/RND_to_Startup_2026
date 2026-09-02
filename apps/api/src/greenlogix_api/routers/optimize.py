"""Optimize / publish. Empty JSON until the solver lands in 01-01."""

from __future__ import annotations

import logging

from fastapi import APIRouter, Depends

from greenlogix_api.auth import require_dispatcher
from greenlogix_api.schemas import (
    ZERO_TOTALS,
    OptimizeIn,
    OptimizeOut,
    PublishIn,
    RouteOut,
)

log = logging.getLogger("greenlogix")

router = APIRouter(tags=["optimize"])


@router.post("/optimize", response_model=OptimizeOut)
def optimize(
    body: OptimizeIn,
    _: None = Depends(require_dispatcher),
) -> OptimizeOut:
    log.info("path=/optimize")
    return OptimizeOut(routes=[], unassigned_order_ids=[], totals=ZERO_TOTALS)


@router.get("/routes", response_model=list[RouteOut])
def list_routes(_: None = Depends(require_dispatcher)) -> list[RouteOut]:
    log.info("path=/routes")
    return []


@router.post("/routes/publish", response_model=list[RouteOut])
def publish_routes(
    body: PublishIn,
    _: None = Depends(require_dispatcher),
) -> list[RouteOut]:
    log.info("path=/routes/publish")
    return []
