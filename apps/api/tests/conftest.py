"""Shared API test helpers. Isolated SQLite per test that needs the DB."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from greenlogix_api import carbon
from greenlogix_api import db as dbmod

AUTH = {"Authorization": "Bearer DEMO"}
PIN = {"X-Driver-Pin": "0000"}


@pytest.fixture(autouse=True)
def isolated_database(tmp_path, monkeypatch):
    data_dir = tmp_path / "data"
    data_dir.mkdir(parents=True, exist_ok=True)
    db_path = data_dir / "greenlogix.db"
    report_path = data_dir / "last_report.json"
    uploads_dir = data_dir / "uploads"
    uploads_dir.mkdir(parents=True, exist_ok=True)

    monkeypatch.setattr(dbmod, "DATA_DIR", data_dir)
    monkeypatch.setattr(dbmod, "UPLOADS_DIR", uploads_dir)
    monkeypatch.setattr(dbmod, "DB_PATH", db_path)
    monkeypatch.setattr(dbmod, "REPORT_PATH", report_path)
    dbmod.set_engine(f"sqlite:///{db_path}", recreate=True)
    carbon._cache = None
    yield


@pytest.fixture
def demo_client(monkeypatch):
    monkeypatch.setenv("GREENLOGIX_DEMO", "1")
    from greenlogix_api.main import app

    with TestClient(app) as client:
        yield client
