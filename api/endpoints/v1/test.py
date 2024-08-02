from fastapi import APIRouter
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/test")
async def test_endpoint():
    logger.info("Endpoint /test is called")
    return {"message": "Hello, World!"}
