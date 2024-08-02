import os
import io
from typing import List

from PIL import Image
from ultralytics import YOLO

from dto.DetectedObject import DetectedObject


class ModelService:
    def __init__(self):
        self.model_path = os.getenv("MODEL_PATH", "./")
        self.imagine_path = os.getenv("IMAGE_PATH", "./")

    def get_image_elements(self, img_raw, model_name="yolov8x-seg.pt", conf_threshold=0.25) -> List[DetectedObject]:

        model = YOLO(f"{self.model_path}/{model_name}")
        img = Image.open(io.BytesIO(img_raw))

        results = iter(model(img, conf=conf_threshold))  # results list
        detected_objects = []

        r = next(results)
        for index, box in enumerate(r.boxes):
            classId = box.cls.item()
            object_name = model.names[classId]
            mask_points = r.masks[index].xy
            boxes_points = r.boxes[index].xyxy
            confidence = r.boxes[index].conf

            detected_object = DetectedObject(classId, object_name, mask_points, boxes_points, confidence)
            detected_objects.append(detected_object)

        return detected_objects

    def get_available_models(self):
        # TODO: Iterate in model folders to see available models
        pass



def get_model_service() -> ModelService:
    return ModelService()
