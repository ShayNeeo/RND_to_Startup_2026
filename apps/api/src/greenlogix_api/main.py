"""GreenLogix API — CORS, lifespan, frozen routes, demo flag (D-19)."""

from __future__ import annotations

import json
import logging
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import Depends, FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, Response
from fastapi.templating import Jinja2Templates
from sqlmodel import Session

from greenlogix_api.auth import require_dispatcher
from greenlogix_api.db import DATA_DIR, get_session, init_db
from greenlogix_api.routers import driver, optimize, orders, report, vehicles
from greenlogix_api.schemas import HealthOut, SeedOut
from greenlogix_api.seed import seed_database

log = logging.getLogger("greenlogix")

API_ROOT = Path(__file__).resolve().parents[2]
OPENAPI_PATH = API_ROOT / "openapi.json"
templates = Jinja2Templates(directory=str(API_ROOT / "templates"))


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    init_db()
    yield


app = FastAPI(title="GreenLogix API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(orders.router)
app.include_router(vehicles.router)
app.include_router(optimize.router)
app.include_router(driver.router)
app.include_router(report.router)


@app.get("/health", response_model=HealthOut)
def health() -> HealthOut:
    log.info("path=/health")
    return HealthOut(status="ok")


@app.get("/favicon.ico")
def favicon() -> Response:
    return Response(status_code=204)


@app.get("/dispatcher", response_class=HTMLResponse)
def dispatcher(request: Request, _: None = Depends(require_dispatcher)) -> HTMLResponse:
    log.info("path=/dispatcher")
    return templates.TemplateResponse(request, "dispatcher.html")


@app.post("/seed", response_model=SeedOut)
def seed(
    session: Session = Depends(get_session),
    _: None = Depends(require_dispatcher),
) -> SeedOut:
    log.info("path=/seed")
    return seed_database(session)


def dump_openapi(path: Path = OPENAPI_PATH) -> None:
    path.write_text(json.dumps(app.openapi(), indent=2) + "\n", encoding="utf-8")
