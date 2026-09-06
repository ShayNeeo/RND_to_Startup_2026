"""Request/response models. JSON keys match OpenAPI (no aliases)."""

from __future__ import annotations

from typing import Annotated, Literal, Self

from pydantic import BaseModel, Field, model_validator

CargoType = Literal["thuong", "lanh", "de_vo"]
FuelType = Literal["petrol", "diesel"]
VehicleStatus = Literal["ready", "maintenance"]
DeliveryStatus = Literal["arrived", "delivered", "failed"]
FailureReason = Literal["khach_vang", "sai_dia_chi", "hang_hong", "tu_choi"]
LocalTime = Annotated[str, Field(pattern=r"^(?:[01][0-9]|2[0-3]):[0-5][0-9]$")]


class HealthOut(BaseModel):
    status: Literal["ok"]


class OrderOut(BaseModel):
    id: int
    address: str
    lat: float
    lng: float
    receiver: str
    phone: str
    kg: float
    window_start: LocalTime
    window_end: LocalTime
    cargo_type: CargoType
    notes: str
    excel_row: int | None
    status: Literal["pending", "assigned", "arrived", "delivered", "failed"]


class OrderPatch(BaseModel):
    address: str | None = None
    lat: float | None = Field(default=None, ge=-90, le=90, allow_inf_nan=False)
    lng: float | None = Field(default=None, ge=-180, le=180, allow_inf_nan=False)
    receiver: str | None = None
    phone: str | None = None
    kg: float | None = Field(default=None, ge=0, allow_inf_nan=False)
    window_start: LocalTime | None = None
    window_end: LocalTime | None = None
    cargo_type: CargoType | None = None
    notes: str | None = None


class ImportErrorItem(BaseModel):
    excel_row: int
    field: str
    message: str


class ImportResult(BaseModel):
    imported: int
    errors: list[ImportErrorItem]


class VehicleOut(BaseModel):
    id: int
    plate: str
    type: str
    capacity_kg: float
    fuel: FuelType
    l_per_100km: float
    status: VehicleStatus


class VehiclePatch(BaseModel):
    type: str | None = None
    capacity_kg: float | None = Field(default=None, gt=0, allow_inf_nan=False)
    fuel: FuelType | None = None
    l_per_100km: float | None = Field(default=None, gt=0, allow_inf_nan=False)
    status: VehicleStatus | None = None


class OptimizeIn(BaseModel):
    cluster_radius_km: float = Field(default=3.0, gt=0, allow_inf_nan=False)


class StopOut(BaseModel):
    id: int
    seq: int
    kind: Literal["depot", "stop"]
    order_id: int | None
    lat: float
    lng: float
    address: str
    phone: str
    window_start: str
    window_end: str
    notes: str
    kg: float
    status: Literal["pending", "arrived", "delivered", "failed"]
    fail_reason: FailureReason | None


class RouteOut(BaseModel):
    id: int
    vehicle_id: int
    plate: str
    color: str
    published: bool
    km: float
    litres: float
    kg_co2: float
    overload: bool
    stops: list[StopOut]


class TotalsOut(BaseModel):
    km: float
    litres: float
    kg_co2: float


class OptimizeOut(BaseModel):
    routes: list[RouteOut]
    unassigned_order_ids: list[int]
    totals: TotalsOut


class PublishIn(BaseModel):
    route_ids: list[int] = Field(default_factory=list)


class DriverRouteOut(BaseModel):
    plate: str
    stops: list[StopOut]


class DriverRouteList(BaseModel):
    routes: list[DriverRouteOut]


class StatusIn(BaseModel):
    status: DeliveryStatus
    reason: FailureReason | None = Field(
        default=None,
        description="Required and non-null when status is failed.",
    )

    @model_validator(mode="after")
    def require_failure_reason(self) -> Self:
        if self.status == "failed" and self.reason is None:
            raise ValueError("reason is required when status is failed")
        return self


class StatusOut(BaseModel):
    id: int
    status: DeliveryStatus
    reason: FailureReason | None


class ReportTotals(BaseModel):
    km: float
    litres: float
    kg_co2: float


class ReportDelta(BaseModel):
    km: float
    litres: float
    kg_co2: float
    km_pct: float
    litres_pct: float
    kg_co2_pct: float


class ReportOut(BaseModel):
    baseline: ReportTotals
    optimized: ReportTotals
    delta: ReportDelta


class DepotOut(BaseModel):
    lat: float
    lng: float
    name: str


class SeedOut(BaseModel):
    orders: int
    vehicles: int
    depot: DepotOut


ZERO_TOTALS = TotalsOut(km=0.0, litres=0.0, kg_co2=0.0)
ZERO_REPORT_TOTALS = ReportTotals(km=0.0, litres=0.0, kg_co2=0.0)
ZERO_DELTA = ReportDelta(
    km=0.0,
    litres=0.0,
    kg_co2=0.0,
    km_pct=0.0,
    litres_pct=0.0,
    kg_co2_pct=0.0,
)
