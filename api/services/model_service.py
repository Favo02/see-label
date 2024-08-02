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

    def get_image_elements(self, img_raw, model_name="yolov8m-seg.pt", conf_threshold=0.5) -> List[DetectedObject]:
        model = YOLO(f"{self.model_path}/{model_name}")

        img = Image.open(io.BytesIO(img_raw))

        results = model(img, conf=conf_threshold)  # results list
        detected_objects = []
        # Visualize the results
        r = results[0]
        for f, box in enumerate(r.boxes):
            clsId = box.cls.item()
            object_name = model.names[clsId]
            mask_points = r.masks[f].xy
            boxes_points = r.boxes[f].xyxy
            confidence = r.boxes[f].conf
            print(f"Found {object_name}")
            print("Coordinates Mask:", mask_points)
            print("Coordinates Box:", boxes_points)

            detected_object = DetectedObject(clsId, object_name, mask_points, boxes_points, confidence)
            detected_objects.append(detected_object)

        return detected_objects

    def get_available_models(self):
        # TODO: Iterate in model folders to see available models
        pass



def get_model_service() -> ModelService:
    return ModelService()
