"""Order import and CRUD. Bodies empty/503 until plan 01-01."""

from __future__ import annotations

import logging

from fastapi import APIRouter, Depends, HTTPException, UploadFile

from greenlogix_api.auth import require_dispatcher
from greenlogix_api.schemas import ImportResult, OrderOut, OrderPatch

log = logging.getLogger("greenlogix")

router = APIRouter(tags=["orders"])


@router.post("/orders/import", response_model=ImportResult)
def import_orders(
    file: UploadFile,
    _: None = Depends(require_dispatcher),
) -> ImportResult:
    log.info("path=/orders/import")
    return ImportResult(imported=0, errors=[])


@router.get("/orders", response_model=list[OrderOut])
def list_orders(_: None = Depends(require_dispatcher)) -> list[OrderOut]:
    log.info("path=/orders")
    return []


@router.patch("/orders/{id}", response_model=OrderOut)
def patch_order(
    id: int,
    body: OrderPatch,
    _: None = Depends(require_dispatcher),
) -> OrderOut:
    log.info("path=/orders/%s", id)
    raise HTTPException(status_code=503, detail="not_implemented")


@router.delete("/orders/{id}")
def delete_order(id: int, _: None = Depends(require_dispatcher)) -> dict[str, int]:
    log.info("path=/orders/%s", id)
    raise HTTPException(status_code=503, detail="not_implemented")
