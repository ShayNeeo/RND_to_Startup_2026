"""SQLite engine at apps/api/data/greenlogix.db (D-11)."""

from __future__ import annotations

from collections.abc import Iterator
from pathlib import Path

from sqlalchemy.engine import Engine
from sqlmodel import Session, SQLModel, create_engine

API_ROOT = Path(__file__).resolve().parents[2]
DATA_DIR = API_ROOT / "data"
UPLOADS_DIR = DATA_DIR / "uploads"
SEED_DIR = DATA_DIR / "seed"
DB_PATH = DATA_DIR / "greenlogix.db"
REPORT_PATH = DATA_DIR / "last_report.json"
FACTORS_PATH = DATA_DIR / "emission_factors.json"

engine = create_engine(
    f"sqlite:///{DB_PATH}",
    connect_args={"check_same_thread": False},
)


def _ensure_stop_route_id(eng: Engine) -> None:
    with eng.connect() as conn:
        rows = conn.exec_driver_sql("PRAGMA table_info(stops)").fetchall()
        if not rows:
            return
        cols = {row[1] for row in rows}
        if "route_id" not in cols:
            conn.exec_driver_sql("ALTER TABLE stops ADD COLUMN route_id INTEGER")
            conn.commit()


def set_engine(url: str, *, recreate: bool = False) -> Engine:
    global engine
    engine = create_engine(url, connect_args={"check_same_thread": False})
    from greenlogix_api import models as _models  # noqa: F401

    if recreate:
        SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)
    _ensure_stop_route_id(engine)
    return engine


def init_db(*, recreate: bool = False) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    SEED_DIR.mkdir(parents=True, exist_ok=True)
    from greenlogix_api import models as _models  # noqa: F401

    if recreate:
        SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)
    _ensure_stop_route_id(engine)


def get_session() -> Iterator[Session]:
    with Session(engine) as session:
        yield session
