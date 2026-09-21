"""Authentication service and token/PIN verification."""

from __future__ import annotations

import os
import re
from fastapi import Header, HTTPException, Request

from greenlogix_api.auth.models import AuthContext, UserRole

_BEARER_DEMO = re.compile(r"^bearer\s+demo$", re.IGNORECASE)
_DRIVER_PIN_PATTERN = re.compile(r"^driver_([a-zA-Z0-9_-]+)$")


def resolve_auth_context(
    request: Request,
    authorization: str | None = Header(default=None),
    x_driver_pin: str | None = Header(default=None, alias="X-Driver-Pin"),
) -> AuthContext:
    """Resolve caller identity and role from headers or query token."""
    if os.environ.get("GREENLOGIX_DEMO") != "1":
        raise HTTPException(status_code=401, detail="unauthorized")

    auth = (authorization or "").strip()
    query_token = request.query_params.get("token")

    # Manager / Dispatcher check
    if _BEARER_DEMO.match(auth) or query_token == "DEMO":
        return AuthContext(
            user_id="user_manager_demo",
            role=UserRole.MANAGER,
            organization_id="org_demo",
        )

    # Scoped Driver check
    if x_driver_pin:
        pin = x_driver_pin.strip()
        if pin == "0000":
            # Global demo driver
            return AuthContext(
                user_id="driver_demo_global",
                role=UserRole.DRIVER,
                organization_id="org_demo",
                assigned_plate=None,
            )
        # Format driver_<plate_safe> e.g. driver_51C01
        m = _DRIVER_PIN_PATTERN.match(pin)
        if m:
            plate_sub = m.group(1).upper()
            return AuthContext(
                user_id=f"driver_{plate_sub}",
                role=UserRole.DRIVER,
                organization_id="org_demo",
                assigned_plate=plate_sub,
            )

    raise HTTPException(status_code=401, detail="unauthorized")
