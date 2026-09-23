"""Places autocomplete stub — BLOCKED on GOFA contract (T-LOOP-GOFA, CR-03).

BLOCKED: no official GOFA API docs were available at implementation time.
Do NOT invent base URL, auth scheme, query params, response schema, or ToS
terms. This stub never returns fake suggestions; it always answers 501 with
a BLOCKED detail naming the missing docs.

Wiring note: this router is intentionally NOT included in
``greenlogix_api.main.app`` yet. The frozen OpenAPI path set
(``tests/test_contract.py::test_frozen_openapi``) must stay unchanged
(additive only), so wiring is deferred until the real GOFA contract is
confirmed. Tests mount this router on an isolated FastAPI app.
"""

from __future__ import annotations

from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse

router = APIRouter(tags=["places"])

REQUIRED_GOFA_DOCS: list[str] = [
    "base URL",
    "auth",
    "response schema",
    "ToS",
]

BLOCKED_DETAIL = (
    "BLOCKED: GOFA places autocomplete unavailable — "
    "missing official GOFA docs: base URL, auth, response schema, ToS. "
    "No live call attempted; no cached or mock suggestions returned. "
    "See greenlogix_api.places.gofa.GofaPlaceProvider docstring."
)


@router.get("/places/autocomplete", status_code=501)
def places_autocomplete(
    q: str = Query(default="", description="Free-text place query (ignored while BLOCKED)."),
) -> JSONResponse:
    """Honest 501 stub. Never returns suggestions while GOFA is BLOCKED."""
    return JSONResponse(status_code=501, content={"detail": BLOCKED_DETAIL})
