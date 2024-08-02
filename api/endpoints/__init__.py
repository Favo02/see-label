from fastapi import APIRouter

from endpoints.v1 import test

router = APIRouter()

router.include_router(test.router, prefix="/v1", tags=["v1"])
