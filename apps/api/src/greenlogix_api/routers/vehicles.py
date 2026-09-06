"""Vehicle registry (VEH-01, VEH-02)."""

from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from greenlogix_api.auth import require_dispatcher
from greenlogix_api.db import get_session
from greenlogix_api.models import Vehicle
from greenlogix_api.schemas import VehicleOut, VehiclePatch
from greenlogix_api.serialize import vehicle_out

log = logging.getLogger("greenlogix")

router = APIRouter(tags=["vehicles"])


@router.get("/vehicles", response_model=list[VehicleOut])
def list_vehicles(
    session: Session = Depends(get_session),
    _: None = Depends(require_dispatcher),
) -> list[VehicleOut]:
    log.info("path=/vehicles")
    rows = list(session.exec(select(Vehicle)).all())
    return [vehicle_out(v) for v in rows]


@router.patch("/vehicles/{id}", response_model=VehicleOut)
def patch_vehicle(
    id: int,
    body: VehiclePatch,
    session: Session = Depends(get_session),
    _: None = Depends(require_dispatcher),
) -> VehicleOut:
    log.info("path=/vehicles/%s", id)
    vehicle = session.get(Vehicle, id)
    if vehicle is None:
        raise HTTPException(status_code=404, detail="not_found")
    data = body.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(vehicle, key, value)
    session.add(vehicle)
    session.commit()
    session.refresh(vehicle)
    return vehicle_out(vehicle)
