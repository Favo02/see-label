import os
import io
from typing import List

from PIL import Image
from ultralytics import YOLO

from dto.DetectedObject import DetectedObject
from services.color_service import ColorService


class ModelService:
    """
    A singleton service class for loading and running YOLO object detection models.

    Attributes
    ----------
    model_path : str
        The path to the directory where the model is stored.
    image_path : str
        The path to the directory where the images are stored.

    Methods
    -------
    get_image_elements(img_raw, model_name="yolov8x-seg.pt", conf_threshold=0.25) -> List[DetectedObject]
        Processes an image and returns detected objects using the YOLO model.
    """

    _instance = None

    def __new__(cls, *args, **kwargs):
        """
        Creates a new instance of ModelService if one does not already exist.

        Parameters
        ----------
        *args : tuple
            Variable length argument list.
        **kwargs : dict
            Arbitrary keyword arguments.

        Returns
        -------
        ModelService
            The singleton instance of ModelService.
        """
        if cls._instance is None:
            cls._instance = super(ModelService, cls).__new__(cls, *args, **kwargs)
        return cls._instance

    def __init__(self):
        """
        Initializes the ModelService instance with environment variables for model and image paths.
        This method ensures it runs only once per singleton instance.
        """
        if not hasattr(self, 'initialized'):
            self.model_path = os.getenv("MODEL_PATH", "./")
            self.image_path = os.getenv("IMAGE_PATH", "./")
            self.initialized = True

    def get_image_elements(self, img_raw, model_name="yolov8x-seg.pt", conf_threshold=0.25) -> List[DetectedObject]:
        """
        Processes an image to detect objects using the specified YOLO model.

        Parameters
        ----------
        img_raw : bytes
            The raw image data in bytes.
        model_name : str, optional
            The filename of the YOLO model to use (default is "yolov8x-seg.pt").
        conf_threshold : float, optional
            The confidence threshold for object detection (default is 0.25).

        Returns
        -------
        List[DetectedObject]
            A list of DetectedObject instances representing the objects detected in the image.
        """
        model = YOLO(f"{self.model_path}/{model_name}")
        img = Image.open(io.BytesIO(img_raw))

        results = iter(model(img, conf=conf_threshold))  # results list
        detected_objects = []

        # Utility class to make sure every detected object has an unique color per category
        color_service = ColorService(len(model.names))

        r = next(results)
        for index, box in enumerate(r.boxes):
            classId = box.cls.item()
            color = color_service.get_color(classId)
            object_name = model.names[classId]
            mask_points = r.masks[index].xy
            boxes_points = r.boxes[index].xyxy
            confidence = r.boxes[index].conf

            detected_object = DetectedObject(classId, object_name, mask_points, boxes_points, confidence, color)
            detected_objects.append(detected_object)

        return detected_objects


def get_model_service() -> ModelService:
    return ModelService()
