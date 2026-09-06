"""Demo auth gated by GREENLOGIX_DEMO=1 (D-19)."""

from __future__ import annotations

import os

from fastapi import Header, HTTPException, Request

_DEMO_BEARER = "Bearer DEMO"
_DEMO_PIN = "0000"


def demo_enabled() -> bool:
    return os.environ.get("GREENLOGIX_DEMO") == "1"


def require_dispatcher(
    request: Request,
    authorization: str | None = Header(default=None),
) -> None:
    if not demo_enabled():
        raise HTTPException(status_code=401, detail="unauthorized")
    if authorization == _DEMO_BEARER or request.query_params.get("token") == "DEMO":
        return
    raise HTTPException(status_code=401, detail="unauthorized")


def require_driver(
    x_driver_pin: str | None = Header(default=None, alias="X-Driver-Pin"),
) -> None:
    if not demo_enabled() or x_driver_pin != _DEMO_PIN:
        raise HTTPException(status_code=401, detail="unauthorized")
