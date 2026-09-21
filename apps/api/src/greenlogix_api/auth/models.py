"""Auth and RBAC data structures."""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum


class UserRole(str, Enum):
    MANAGER = "MANAGER"
    DRIVER = "DRIVER"
    ADMIN = "ADMIN"


@dataclass(frozen=True)
class AuthContext:
    user_id: str
    role: UserRole
    organization_id: str = "org_demo"
    assigned_plate: str | None = None

    @property
    def is_manager(self) -> bool:
        return self.role in (UserRole.MANAGER, UserRole.ADMIN)

    @property
    def is_driver(self) -> bool:
        return self.role == UserRole.DRIVER
