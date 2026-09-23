"""Authentication and authorization package."""

from greenlogix_api.auth.models import AuthContext, UserRole
from greenlogix_api.auth.service import resolve_auth_context
from greenlogix_api.auth.dependencies import (
    get_current_auth,
    require_manager_role,
    require_driver_role,
    verify_driver_plate_access,
    verify_org_access,
    verify_tenant_plate_access,
)
from greenlogix_api.auth.legacy import (
    demo_enabled,
    require_dispatcher,
    require_driver,
)

__all__ = [
    "AuthContext",
    "UserRole",
    "resolve_auth_context",
    "get_current_auth",
    "require_manager_role",
    "require_driver_role",
    "verify_driver_plate_access",
    "verify_org_access",
    "verify_tenant_plate_access",
    "demo_enabled",
    "require_dispatcher",
    "require_driver",
]
