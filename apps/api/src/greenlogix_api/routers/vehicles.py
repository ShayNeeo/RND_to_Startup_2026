"""Vehicle registry. Bodies empty/503 until plan 01-01."""

from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException

from greenlogix_api.auth import require_dispatcher
from greenlogix_api.schemas import VehicleOut, VehiclePatch

log = logging.getLogger("greenlogix")

router = APIRouter(tags=["vehicles"])


@router.get("/vehicles", response_model=list[VehicleOut])
def list_vehicles(_: None = Depends(require_dispatcher)) -> list[VehicleOut]:
    log.info("path=/vehicles")
    return []


@router.patch("/vehicles/{id}", response_model=VehicleOut)
def patch_vehicle(
    id: int,
    body: VehiclePatch,
    _: None = Depends(require_dispatcher),
) -> VehicleOut:
    log.info("path=/vehicles/%s", id)
    raise HTTPException(status_code=503, detail="not_implemented")
