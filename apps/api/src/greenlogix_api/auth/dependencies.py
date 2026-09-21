"""FastAPI auth dependencies and authorization guards."""

from __future__ import annotations

from fastapi import Depends, HTTPException
from greenlogix_api.auth.models import AuthContext, UserRole
from greenlogix_api.auth.service import resolve_auth_context


def get_current_auth(auth: AuthContext = Depends(resolve_auth_context)) -> AuthContext:
    return auth


def require_manager_role(auth: AuthContext = Depends(get_current_auth)) -> AuthContext:
    if not auth.is_manager:
        raise HTTPException(status_code=403, detail="forbidden: manager role required")
    return auth


def require_driver_role(auth: AuthContext = Depends(get_current_auth)) -> AuthContext:
    if not auth.is_driver:
        raise HTTPException(status_code=403, detail="forbidden: driver role required")
    return auth


def verify_driver_plate_access(auth: AuthContext, target_plate: str) -> None:
    """Ensure a scoped driver cannot access or mutate another driver's vehicle route."""
    if auth.is_manager:
        return
    if auth.assigned_plate is not None:
        norm_target = target_plate.replace("-", "").replace(".", "").upper()
        norm_assigned = auth.assigned_plate.replace("-", "").replace(".", "").upper()
        if norm_assigned not in norm_target and norm_target not in norm_assigned:
            raise HTTPException(
                status_code=403,
                detail=f"forbidden: driver is not assigned to vehicle {target_plate}",
            )
