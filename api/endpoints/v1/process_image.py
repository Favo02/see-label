from fastapi import APIRouter
import logging
from fastapi import FastAPI, File, UploadFile
from starlette.responses import JSONResponse

from services.model_service import get_model_service

router = APIRouter()
logger = logging.getLogger(__name__)

model_service = get_model_service()

@router.post("/image-data")
async def process_image(file: UploadFile = File(...)):
    image_data = await file.read()
    results = model_service.get_image_elements(image_data)

    return JSONResponse(content={"data": [obj.dict() for obj in results]})

