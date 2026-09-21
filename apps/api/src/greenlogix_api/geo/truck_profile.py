"""Heavy-duty and urban truck physical envelope profile for road routing."""

from __future__ import annotations

from dataclasses import dataclass
import hashlib
from typing import Any, Literal

TruckClass = Literal["xe_tai_nho", "xe_tai_trung", "xe_tai_nang", "xe_van"]
FuelType = Literal["diesel", "petrol", "electric"]


@dataclass(frozen=True)
class TruckProfile:
    """Physical and legal vehicle envelope for truck-restricted routing."""

    name: str
    vehicle_class: TruckClass
    height_m: float
    width_m: float
    length_m: float
    gross_vehicle_weight_t: float
    empty_weight_kg: float
    max_payload_kg: float
    fuel_type: FuelType = "diesel"
    rated_l_per_100km: float = 11.5
    axle_load_t: float | None = None
    frontal_area_m2: float = 4.2
    cd: float = 0.65

    def to_valhalla_truck_options(self) -> dict[str, Any]:
        """Convert physical envelope to Valhalla truck costing parameters."""
        return {
            "height": round(self.height_m, 2),
            "width": round(self.width_m, 2),
            "length": round(self.length_m, 2),
            "weight": round(self.gross_vehicle_weight_t, 2),
            "axle_load": round(self.axle_load_t if self.axle_load_t is not None else (self.gross_vehicle_weight_t / 2.0), 2),
            "hazmat": False,
        }

    def profile_hash(self) -> str:
        """Deterministic short hash of the physical envelope for matrix cache keys."""
        spec = (
            f"{self.vehicle_class}:h{self.height_m:.2f}:w{self.width_m:.2f}:"
            f"l{self.length_m:.2f}:g{self.gross_vehicle_weight_t:.2f}"
        )
        return hashlib.sha256(spec.encode("utf-8")).hexdigest()[:12]


# Canonical presets for Vietnam urban freight fleet
XE_TAI_NHO_1T5 = TruckProfile(
    name="Xe tải nhỏ 1.5 Tấn (Hyundai Porter / Thaco Kia)",
    vehicle_class="xe_tai_nho",
    height_m=2.1,
    width_m=1.8,
    length_m=4.8,
    gross_vehicle_weight_t=3.2,
    empty_weight_kg=1700.0,
    max_payload_kg=1500.0,
    fuel_type="diesel",
    rated_l_per_100km=9.5,
    frontal_area_m2=3.8,
    cd=0.55,
)

XE_TAI_TRUNG_3T5 = TruckProfile(
    name="Xe tải trung 3.5 Tấn (Isuzu NPR / Hino 300)",
    vehicle_class="xe_tai_trung",
    height_m=2.8,
    width_m=2.1,
    length_m=6.2,
    gross_vehicle_weight_t=6.5,
    empty_weight_kg=3000.0,
    max_payload_kg=3500.0,
    fuel_type="diesel",
    rated_l_per_100km=13.5,
    frontal_area_m2=5.0,
    cd=0.65,
)

XE_TAI_NANG_8T = TruckProfile(
    name="Xe tải nặng 8 Tấn (Hino 500 / Dongfeng)",
    vehicle_class="xe_tai_nang",
    height_m=3.5,
    width_m=2.45,
    length_m=9.5,
    gross_vehicle_weight_t=14.0,
    empty_weight_kg=6000.0,
    max_payload_kg=8000.0,
    fuel_type="diesel",
    rated_l_per_100km=21.0,
    frontal_area_m2=6.8,
    cd=0.75,
)

DEFAULT_TRUCK_PROFILE = XE_TAI_NHO_1T5


def get_profile_for_vehicle(
    vehicle_type: str = "",
    capacity_kg: float = 0.0,
    fuel: str = "diesel",
    l_per_100km: float = 0.0,
) -> TruckProfile:
    """Infer appropriate TruckProfile from vehicle metadata."""
    v_norm = vehicle_type.lower().strip()
    if "nang" in v_norm or capacity_kg > 5000:
        base = XE_TAI_NANG_8T
    elif "trung" in v_norm or capacity_kg > 2000:
        base = XE_TAI_TRUNG_3T5
    else:
        base = XE_TAI_NHO_1T5

    if l_per_100km > 0 or (fuel in ("diesel", "petrol", "electric") and fuel != base.fuel_type):
        return TruckProfile(
            name=base.name,
            vehicle_class=base.vehicle_class,
            height_m=base.height_m,
            width_m=base.width_m,
            length_m=base.length_m,
            gross_vehicle_weight_t=base.gross_vehicle_weight_t,
            empty_weight_kg=base.empty_weight_kg,
            max_payload_kg=max(capacity_kg, base.max_payload_kg) if capacity_kg > 0 else base.max_payload_kg,
            fuel_type="petrol" if fuel == "petrol" else ("electric" if fuel == "electric" else "diesel"),
            rated_l_per_100km=l_per_100km if l_per_100km > 0 else base.rated_l_per_100km,
            frontal_area_m2=base.frontal_area_m2,
            cd=base.cd,
        )
    return base
