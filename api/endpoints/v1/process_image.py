import logging
from typing import Optional

from fastapi import APIRouter, File, UploadFile, Query, Depends
from starlette.responses import JSONResponse

from dto.image_process_request import ImageProcessRequest
from services.model_service import get_model_service

router = APIRouter()
logger = logging.getLogger(__name__)

model_service = get_model_service()

# Endpoint used to process images

@router.post("/image-data")
async def process_image(file: UploadFile = File(...), request: ImageProcessRequest = Depends()):
    # Get image in raw format
    image_data = await file.read()

    results = model_service.get_image_elements(image_data, model_name=request.yolo_model_name, conf_threshold=request.confidence_threshold)
    return JSONResponse(content={"data": [obj.dict() for obj in results]})

