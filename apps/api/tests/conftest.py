import pytest
from sqlmodel import create_engine

from greenlogix_api import db, main


@pytest.fixture(autouse=True)
def isolated_database(tmp_path, monkeypatch):
    data_dir = tmp_path / "data"
    database_path = data_dir / "greenlogix.db"
    engine = create_engine(
        f"sqlite:///{database_path}", connect_args={"check_same_thread": False}
    )
    monkeypatch.delenv("GREENLOGIX_DEMO", raising=False)
    monkeypatch.setattr(db, "DATA_DIR", data_dir)
    monkeypatch.setattr(db, "UPLOADS_DIR", data_dir / "uploads")
    monkeypatch.setattr(db, "DB_PATH", database_path)
    monkeypatch.setattr(db, "engine", engine)
    monkeypatch.setattr(main, "DATA_DIR", data_dir)
    yield engine
    engine.dispose()
