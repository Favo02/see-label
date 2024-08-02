from fastapi import APIRouter
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/process_image")
async def process_image():
    logger.info("Endpoint /test is called")
    return {"message": "Hello, World!"}
