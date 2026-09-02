"""Request/response models. JSON keys match OpenAPI (no aliases)."""

from __future__ import annotations

from pydantic import BaseModel, Field


class HealthOut(BaseModel):
    status: str


class OrderOut(BaseModel):
    id: int
    address: str
    lat: float
    lng: float
    receiver: str
    phone: str
    kg: float
    window_start: str
    window_end: str
    cargo_type: str
    notes: str
    excel_row: int | None
    status: str


class OrderPatch(BaseModel):
    address: str | None = None
    lat: float | None = None
    lng: float | None = None
    receiver: str | None = None
    phone: str | None = None
    kg: float | None = None
    window_start: str | None = None
    window_end: str | None = None
    cargo_type: str | None = None
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
    fuel: str
    l_per_100km: float
    status: str


class VehiclePatch(BaseModel):
    type: str | None = None
    capacity_kg: float | None = None
    fuel: str | None = None
    l_per_100km: float | None = None
    status: str | None = None


class OptimizeIn(BaseModel):
    cluster_radius_km: float = 3.0


class StopOut(BaseModel):
    id: int
    seq: int
    kind: str
    order_id: int | None
    lat: float
    lng: float
    address: str
    phone: str
    window_start: str
    window_end: str
    notes: str
    kg: float
    status: str
    fail_reason: str | None


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
    status: str
    reason: str | None = None


class StatusOut(BaseModel):
    id: int
    status: str
    reason: str | None


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
