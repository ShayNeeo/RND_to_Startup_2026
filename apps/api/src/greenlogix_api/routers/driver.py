"""Driver route + stop writeback. PIN via X-Driver-Pin (D-19)."""

from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException, UploadFile
from sqlmodel import Session, select

from greenlogix_api.auth import require_driver
from greenlogix_api.db import get_session
from greenlogix_api.models import Route, Stop
from greenlogix_api.schemas import DriverRouteList, DriverRouteOut, StatusIn, StatusOut
from greenlogix_api.serialize import stop_out

log = logging.getLogger("greenlogix")

router = APIRouter(tags=["driver"])


@router.get("/driver/route", response_model=DriverRouteList)
def driver_route(
    plate: str | None = None,
    session: Session = Depends(get_session),
    _: None = Depends(require_driver),
) -> DriverRouteList:
    log.info("path=/driver/route")
    routes = [r for r in session.exec(select(Route)).all() if r.published]
    if plate:
        routes = [r for r in routes if r.plate == plate]
    out: list[DriverRouteOut] = []
    for route in routes:
        stops = [
            s
            for s in session.exec(select(Stop).where(Stop.route_id == route.id)).all()
        ]
        stops.sort(key=lambda s: s.seq)
        out.append(DriverRouteOut(plate=route.plate, stops=[stop_out(s) for s in stops]))
    return DriverRouteList(routes=out)


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
