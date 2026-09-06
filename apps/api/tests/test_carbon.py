from greenlogix_api.carbon import kg_co2, kg_co2_per_litre, litres_used


def test_diesel_100km_12l() -> None:
    assert litres_used(100.0, 12.0) == 12.0
    assert kg_co2(100.0, 12.0, "diesel") == 12.0 * 2.68


def test_petrol_and_aliases() -> None:
    assert kg_co2_per_litre("petrol") == 2.31
    assert kg_co2_per_litre("xăng") == 2.31
    assert kg_co2_per_litre("dầu") == 2.68
