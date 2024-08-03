from typing import Optional

from pydantic import BaseModel


# Body used at the /image-data endpoint, parameters are optional

class ImageProcessRequest(BaseModel):
    yolo_model_name: Optional[str] = "yolov8x-seg.pt"
    confidence_threshold: Optional[float] = 0.25
