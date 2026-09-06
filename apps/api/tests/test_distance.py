from greenlogix_api.solver.distance import HCMC_CIRCUITY, haversine_km, road_km


def test_hcmc_circuity_constant() -> None:
    assert HCMC_CIRCUITY == 1.35


def test_road_km_is_haversine_times_circuity() -> None:
    h = haversine_km(10.776, 106.700, 10.801, 106.661)
    r = road_km(10.776, 106.700, 10.801, 106.661)
    assert h > 0
    assert abs(r / h - HCMC_CIRCUITY) < 1e-12
