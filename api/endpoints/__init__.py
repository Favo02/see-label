from fastapi import APIRouter

from endpoints.v1 import process_image

router = APIRouter()

router.include_router(process_image.router, prefix="/v1", tags=["v1"])
