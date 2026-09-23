"""Request/response models. JSON keys match OpenAPI (no aliases)."""

from __future__ import annotations

from typing import Annotated, Literal, Self

from pydantic import BaseModel, Field, model_validator

CargoType = Literal["thuong", "lanh", "de_vo"]
FuelType = Literal["petrol", "diesel"]
VehicleStatus = Literal["ready", "maintenance"]
StopStatus = Literal["pending", "arrived", "delivered", "failed"]
DeliveryStatus = Literal["arrived", "delivered", "failed"]
FailureReason = Literal["khach_vang", "sai_dia_chi", "hang_hong", "tu_choi"]
LocalTime = Annotated[str, Field(pattern=r"^(?:[01][0-9]|2[0-3]):[0-5][0-9]$")]


class HealthOut(BaseModel):
    status: Literal["ok"]
    # T-LOOP-RBAC-HEALTH (additive, optional): road-graph audit versions wired
    # from geo/road_graph manifest, offline-safe. ``None`` when the manifest
    # is unreadable — /health still returns 200 with status ok.
    road_graph_version: str | None = None
    restriction_overlay_version: str | None = None
    cost_model_version: str | None = None
    road_graph_reachable: bool | None = None


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
    late_risk: bool = False
    # T-LOOP-GOFA (additive, nullable): provenance passthrough from Order.
    # Optional so existing clients/orders are unaffected.
    place_id: str | None = None
    place_provider: str | None = None
    place_confidence: float | None = None
    geocode_at: str | None = None


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
    # T-02 C-02 (additive, optional): envelope passthrough from Vehicle.
    # None = not recorded. Additive only; no path change.
    height_m: float | None = None
    width_m: float | None = None
    length_m: float | None = None
    gvw_kg: float | None = None
    axle_load_t: float | None = None
    frontal_area_m2: float | None = None
    cd: float | None = None


class VehiclePatch(BaseModel):
    type: str | None = None
    capacity_kg: float | None = Field(default=None, gt=0, allow_inf_nan=False)
    fuel: FuelType | None = None
    l_per_100km: float | None = Field(default=None, gt=0, allow_inf_nan=False)
    status: VehicleStatus | None = None
    # T-02 C-02 (additive, optional): envelope overrides, positive only.
    height_m: float | None = Field(default=None, gt=0, allow_inf_nan=False)
    width_m: float | None = Field(default=None, gt=0, allow_inf_nan=False)
    length_m: float | None = Field(default=None, gt=0, allow_inf_nan=False)
    gvw_kg: float | None = Field(default=None, gt=0, allow_inf_nan=False)
    axle_load_t: float | None = Field(default=None, gt=0, allow_inf_nan=False)
    frontal_area_m2: float | None = Field(default=None, gt=0, allow_inf_nan=False)
    cd: float | None = Field(default=None, gt=0, allow_inf_nan=False)


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
    status: StopStatus
    fail_reason: FailureReason | None = None
    late_risk: bool = False


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
    baseline: TotalsOut
    distance_provider: str = "circuity"
    routing_quality: str = "DEGRADED"
    eco_weight: float = 0.0


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
    status: StopStatus
    reason: FailureReason | None


FeedbackIssueType = Literal["road_closed", "height_barrier", "weight_limit", "unexpected_ban"]
FeedbackStatus = Literal["pending_review", "verified", "rejected"]


class FeedbackIn(BaseModel):
    plate: str
    lat: float = Field(ge=-90, le=90, allow_inf_nan=False)
    lng: float = Field(ge=-180, le=180, allow_inf_nan=False)
    issue_type: FeedbackIssueType
    notes: str = ""


class FeedbackOut(BaseModel):
    id: str
    status: FeedbackStatus


class FeedbackItemOut(BaseModel):
    """One queued driver restriction report (admin review read model)."""

    id: str
    driver_id: str
    plate: str
    lat: float
    lng: float
    issue_type: FeedbackIssueType
    notes: str
    status: FeedbackStatus


class FeedbackVerifyIn(BaseModel):
    approved: bool


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
    distance_provider: str = "circuity"
    routing_quality: str = "DEGRADED"
    eco_weight: float = 0.0


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
