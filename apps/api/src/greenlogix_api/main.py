"""GreenLogix API — CORS, lifespan, frozen routes, demo flag (D-19)."""

from __future__ import annotations

import json
import logging
import math
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import Depends, FastAPI, Request
from fastapi.encoders import jsonable_encoder
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse

from greenlogix_api.auth import require_dispatcher
from greenlogix_api.db import DATA_DIR, init_db
from greenlogix_api.routers import driver, optimize, orders, report, vehicles
from greenlogix_api.schemas import DepotOut, HealthOut, SeedOut

log = logging.getLogger("greenlogix")

API_ROOT = Path(__file__).resolve().parents[2]
OPENAPI_PATH = API_ROOT / "openapi.json"


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    init_db()
    yield


app = FastAPI(title="GreenLogix API", lifespan=lifespan)


@app.exception_handler(RequestValidationError)
async def validation_error(
    _request: Request, error: RequestValidationError
) -> JSONResponse:
    errors = jsonable_encoder(
        error.errors(),
        custom_encoder={
            float: lambda value: value if math.isfinite(value) else str(value)
        },
    )
    return JSONResponse(status_code=422, content={"detail": errors})


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


@app.get("/dispatcher", response_class=HTMLResponse)
def dispatcher(_: None = Depends(require_dispatcher)) -> str:
    log.info("path=/dispatcher")
    return "GreenLogix dispatcher"


@app.post("/seed", response_model=SeedOut)
def seed(_: None = Depends(require_dispatcher)) -> SeedOut:
    log.info("path=/seed")
    return SeedOut(orders=0, vehicles=0, depot=DepotOut(lat=0.0, lng=0.0, name=""))


def dump_openapi(path: Path = OPENAPI_PATH) -> None:
    path.write_text(json.dumps(app.openapi(), indent=2) + "\n", encoding="utf-8")
