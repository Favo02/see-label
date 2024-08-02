from typing import Union, List

import numpy as np
import torch


class DetectedObject:
    def __init__(self, cls_id: int, object_name: str, mask_points, boxes_points: Union[np.ndarray, List], confidence: float):
        self.cls_id = cls_id
        self.object_name = object_name
        self.mask_points = [obj.tolist() for obj in mask_points]
        self.boxes_points = boxes_points
        self.confidence = confidence

    def dict(self):
        return {
            "clsId": self.cls_id,
            "object_name": self.object_name,
            "mask_points": self.mask_points,
            "boxes_points": self.boxes_points.tolist() if isinstance(self.boxes_points, torch.Tensor) else self.boxes_points,
            "confidence": self.confidence.item() if isinstance(self.confidence, torch.Tensor) else self.confidence
        }
