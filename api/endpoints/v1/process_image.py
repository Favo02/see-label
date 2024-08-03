import logging
from typing import Optional

from fastapi import APIRouter, File, UploadFile, Query
from starlette.responses import JSONResponse

from services.model_service import get_model_service

router = APIRouter()
logger = logging.getLogger(__name__)

model_service = get_model_service()

# Endpoint used to process images

@router.post("/image-data")
async def process_image(file: UploadFile = File(...), model_name: Optional[str] = Query("yolov8x-seg.pt"), confidence_threshold: Optional[float] = Query(0.25)):
    image_data = await file.read()
    results = model_service.get_image_elements(image_data, model_name=model_name, conf_threshold=confidence_threshold)
    return JSONResponse(content={"data": [obj.dict() for obj in results]})

