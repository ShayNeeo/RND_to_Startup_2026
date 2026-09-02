"""Order import and CRUD."""

from __future__ import annotations

import logging

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile
from sqlmodel import Session, select

from greenlogix_api.auth import require_dispatcher
from greenlogix_api.db import get_session
from greenlogix_api.ingest_xlsx import MAX_UPLOAD_BYTES, IngestLimitError, parse_xlsx
from greenlogix_api.late import matches_q
from greenlogix_api.models import Order, Route, Stop
from greenlogix_api.schemas import ImportResult, OrderOut, OrderPatch
from greenlogix_api.serialize import order_out

log = logging.getLogger("greenlogix")

router = APIRouter(tags=["orders"])


def _published_assignment(session: Session, order_id: int) -> bool:
    stops = session.exec(select(Stop).where(Stop.order_id == order_id)).all()
    for stop in stops:
        if stop.route_id is None:
            continue
        route = session.get(Route, stop.route_id)
        if route is not None and route.published:
            return True
    return False


def _reject_if_published(session: Session, order: Order) -> None:
    if order.id is not None and _published_assignment(session, order.id):
        raise HTTPException(status_code=409, detail="published")


@router.post("/orders/import", response_model=ImportResult)
def import_orders(
    file: UploadFile,
    session: Session = Depends(get_session),
    _: None = Depends(require_dispatcher),
) -> ImportResult:
    name = (file.filename or "").lower()
    log.info("path=/orders/import")
    if not name.endswith(".xlsx"):
        raise HTTPException(status_code=400, detail="xlsx only")
    raw = file.file.read()
    if len(raw) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=400, detail="file too large")
    try:
        orders, errors = parse_xlsx(raw)
    except IngestLimitError:
        raise HTTPException(status_code=400, detail="too many rows") from None
    except Exception:
        log.info("path=/orders/import invalid xlsx")
        raise HTTPException(status_code=400, detail="invalid xlsx") from None
    for order in orders:
        session.add(order)
    session.commit()
    log.info("imported=%s errors=%s", len(orders), len(errors))
    return ImportResult(imported=len(orders), errors=errors)


@router.get("/orders", response_model=list[OrderOut])
def list_orders(
    q: Annotated[str | None, Query()] = None,
    late: Annotated[int | None, Query()] = None,
    session: Session = Depends(get_session),
    _: None = Depends(require_dispatcher),
) -> list[OrderOut]:
    log.info("path=/orders q=%s late=%s", q, late)
    rows = list(session.exec(select(Order)).all())
    out = [order_out(o) for o in rows]
    out = [o for o in out if matches_q(o.address, o.phone, o.receiver, q)]
    if late == 1:
        out = [o for o in out if o.late_risk]
    return out


@router.get("/orders/{id}", response_model=OrderOut)
def get_order(
    id: int,
    session: Session = Depends(get_session),
    _: None = Depends(require_dispatcher),
) -> OrderOut:
    log.info("path=/orders/%s", id)
    order = session.get(Order, id)
    if order is None:
        raise HTTPException(status_code=404, detail="not_found")
    return order_out(order)


@router.patch("/orders/{id}", response_model=OrderOut)
def patch_order(
    id: int,
    body: OrderPatch,
    session: Session = Depends(get_session),
    _: None = Depends(require_dispatcher),
) -> OrderOut:
    log.info("path=/orders/%s", id)
    order = session.get(Order, id)
    if order is None:
        raise HTTPException(status_code=404, detail="not_found")
    _reject_if_published(session, order)
    data = body.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(order, key, value)
    session.add(order)
    session.commit()
    session.refresh(order)
    return order_out(order)


@router.delete("/orders/{id}")
def delete_order(
    id: int,
    session: Session = Depends(get_session),
    _: None = Depends(require_dispatcher),
) -> dict[str, int]:
    log.info("path=/orders/%s", id)
    order = session.get(Order, id)
    if order is None:
        raise HTTPException(status_code=404, detail="not_found")
    _reject_if_published(session, order)
    session.delete(order)
    session.commit()
    return {"id": id}
