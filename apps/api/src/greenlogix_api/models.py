"""SQLModel tables matching the frozen OpenAPI field names (D-15)."""

from __future__ import annotations

from sqlmodel import Field, SQLModel


class Order(SQLModel, table=True):
    __tablename__ = "orders"

    id: int | None = Field(default=None, primary_key=True)
    address: str = ""
    lat: float = 0.0
    lng: float = 0.0
    receiver: str = ""
    phone: str = ""
    kg: float = 0.0
    window_start: str = ""
    window_end: str = ""
    cargo_type: str = "thuong"
    notes: str = ""
    excel_row: int | None = None
    status: str = "pending"


class Vehicle(SQLModel, table=True):
    __tablename__ = "vehicles"

    id: int | None = Field(default=None, primary_key=True)
    plate: str = ""
    type: str = ""
    capacity_kg: float = 0.0
    fuel: str = "petrol"
    l_per_100km: float = 0.0
    status: str = "ready"


class Route(SQLModel, table=True):
    __tablename__ = "routes"

    id: int | None = Field(default=None, primary_key=True)
    vehicle_id: int = 0
    plate: str = ""
    color: str = ""
    published: bool = False
    km: float = 0.0
    litres: float = 0.0
    kg_co2: float = 0.0
    overload: bool = False


class Stop(SQLModel, table=True):
    __tablename__ = "stops"

    id: int | None = Field(default=None, primary_key=True)
    seq: int = 0
    kind: str = "stop"
    order_id: int | None = None
    lat: float = 0.0
    lng: float = 0.0
    address: str = ""
    phone: str = ""
    window_start: str = ""
    window_end: str = ""
    notes: str = ""
    kg: float = 0.0
    status: str = "pending"
    fail_reason: str | None = None
