"""Shared API test helpers. Isolated SQLite per test that needs the DB."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

AUTH = {"Authorization": "Bearer DEMO"}
PIN = {"X-Driver-Pin": "0000"}


@pytest.fixture
def demo_client(tmp_path, monkeypatch):
    monkeypatch.setenv("GREENLOGIX_DEMO", "1")
    db_path = tmp_path / "greenlogix.db"
    report_path = tmp_path / "last_report.json"
    from greenlogix_api import carbon, db as dbmod

    dbmod.set_engine(f"sqlite:///{db_path}", recreate=True)
    monkeypatch.setattr(dbmod, "REPORT_PATH", report_path)
    carbon._cache = None
    from greenlogix_api.main import app

    with TestClient(app) as client:
        yield client
