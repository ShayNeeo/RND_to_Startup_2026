import json
import pytest
from greenlogix_api.geo.truck_profile import (
    XE_TAI_NHO_1T5,
    XE_TAI_TRUNG_3T5,
    XE_TAI_NANG_8T,
    get_profile_for_vehicle,
)
from greenlogix_api.solver.road_baseline import (
    ValhallaRoadBaseline,
    materialize_matrix,
    valhalla_matrix_body,
)

def test_truck_profile_presets():
    assert XE_TAI_NHO_1T5.height_m == 2.1
    assert XE_TAI_NHO_1T5.gross_vehicle_weight_t == 3.2
    assert XE_TAI_TRUNG_3T5.height_m == 2.8
    assert XE_TAI_NANG_8T.height_m == 3.5

    opts = XE_TAI_TRUNG_3T5.to_valhalla_truck_options()
    assert opts["height"] == 2.8
    assert opts["width"] == 2.1
    assert opts["weight"] == 6.5
    assert opts["hazmat"] is False

def test_truck_profile_hashes_distinct():
    h_nho = XE_TAI_NHO_1T5.profile_hash()
    h_trung = XE_TAI_TRUNG_3T5.profile_hash()
    h_nang = XE_TAI_NANG_8T.profile_hash()
    assert len({h_nho, h_trung, h_nang}) == 3

def test_valhalla_matrix_body_with_truck_profile():
    points = [(10.8123, 106.6543), (10.7725, 106.6578)]
    body_nho = valhalla_matrix_body(points, costing="truck", truck_profile=XE_TAI_NHO_1T5)
    body_nang = valhalla_matrix_body(points, costing="truck", truck_profile=XE_TAI_NANG_8T)

    assert body_nho["costing_options"]["truck"]["height"] == 2.1
    assert body_nang["costing_options"]["truck"]["height"] == 3.5

def test_matrix_cache_key_includes_truck_profile():
    points = [(10.8123, 106.6543), (10.7725, 106.6578)]
    cache: dict = {}

    def fake_transport(url, method, body):
        return {
            "sources_to_targets": [
                [{"distance": 0.0}, {"distance": 5.2}],
                [{"distance": 5.2}, {"distance": 0.0}],
            ]
        }

    provider_nho = ValhallaRoadBaseline(transport=fake_transport, truck_profile=XE_TAI_NHO_1T5)
    provider_nang = ValhallaRoadBaseline(transport=fake_transport, truck_profile=XE_TAI_NANG_8T)

    materialize_matrix(provider_nho, points, cache=cache)
    materialize_matrix(provider_nang, points, cache=cache)

    # Both should be present in cache under distinct keys
    assert len(cache) == 2
    keys = list(cache.keys())
    assert any(XE_TAI_NHO_1T5.profile_hash() in k for k in keys)
    assert any(XE_TAI_NANG_8T.profile_hash() in k for k in keys)

def test_get_profile_for_vehicle_inference():
    p1 = get_profile_for_vehicle("Xe tải nhỏ 1.25 tấn", capacity_kg=1250)
    assert p1.vehicle_class == "xe_tai_nho"

    p2 = get_profile_for_vehicle("Xe tải trung 3.5T", capacity_kg=3500)
    assert p2.vehicle_class == "xe_tai_trung"

    p3 = get_profile_for_vehicle("Xe tải nặng 10T", capacity_kg=9000)
    assert p3.vehicle_class == "xe_tai_nang"
