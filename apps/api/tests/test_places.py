import pytest
from greenlogix_api.places.base import GeoPoint
from greenlogix_api.places.mock import MockPlaceProvider
from greenlogix_api.places.gofa import GofaPlaceProvider

@pytest.mark.anyio
async def test_mock_place_provider_autocomplete():
    provider = MockPlaceProvider()
    results = await provider.autocomplete("Lý Thường Kiệt")
    assert len(results) >= 1
    first = results[0]
    assert "268 Lý Thường Kiệt" in first.description
    assert first.place_id == "gofa_hcmc_ly_thuong_kiet"

@pytest.mark.anyio
async def test_mock_place_provider_unaccented_search():
    provider = MockPlaceProvider()
    results = await provider.autocomplete("ly thuong kiet")
    assert len(results) >= 1
    assert any("268 Lý Thường Kiệt" in r.description for r in results)

@pytest.mark.anyio
async def test_mock_place_provider_detail():
    provider = MockPlaceProvider()
    detail = await provider.detail("gofa_hcmc_depot_tanbinh")
    assert detail is not None
    assert "Tân Bình" in detail.formatted_address
    assert round(detail.point.lat, 4) == 10.8123
    assert round(detail.point.lng, 4) == 106.6543
    assert detail.district == "Tân Bình"
    assert detail.confidence == 1.0

@pytest.mark.anyio
async def test_gofa_place_provider_fallback_when_no_key():
    provider = GofaPlaceProvider(api_key="")
    # Should use fallback without throwing
    results = await provider.autocomplete("Lê Duẩn")
    assert len(results) >= 1
    assert "15 Lê Duẩn" in results[0].description

    detail = await provider.detail(results[0].place_id)
    assert detail is not None
    assert "Quận 1" in detail.district

@pytest.mark.anyio
async def test_gofa_caching_behavior():
    provider = GofaPlaceProvider(api_key="MOCK")
    # First call
    res1 = await provider.autocomplete("landmark")
    assert len(res1) >= 1
    # Second call should hit memory cache
    res2 = await provider.autocomplete("landmark")
    assert res1 == res2
