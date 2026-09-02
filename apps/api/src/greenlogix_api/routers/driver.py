"""Driver route + stop writeback. PIN via X-Driver-Pin (D-19)."""

from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException, UploadFile

from greenlogix_api.auth import require_driver
from greenlogix_api.schemas import DriverRouteList, StatusIn, StatusOut

log = logging.getLogger("greenlogix")

router = APIRouter(tags=["driver"])


@router.get("/driver/route", response_model=DriverRouteList)
def driver_route(
    plate: str | None = None,
    _: None = Depends(require_driver),
) -> DriverRouteList:
    log.info("path=/driver/route")
    return DriverRouteList(routes=[])


@router.post("/stops/{id}/status", response_model=StatusOut)
def stop_status(
    id: int,
    body: StatusIn,
    _: None = Depends(require_driver),
) -> StatusOut:
    log.info("path=/stops/%s/status", id)
    raise HTTPException(status_code=503, detail="not_implemented")


@router.post("/stops/{id}/photo", response_model=StatusOut)
def stop_photo(
    id: int,
    file: UploadFile,
    _: None = Depends(require_driver),
) -> StatusOut:
    log.info("path=/stops/%s/photo", id)
    raise HTTPException(status_code=503, detail="not_implemented")
