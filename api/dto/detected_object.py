from typing import Union, List
import numpy as np
import torch


class DetectedObject:
    """
    A class to represent a detected object in an image.

    Attributes
    ----------
    object_name : str
        The name of the detected object.
    mask_points : list
        A list of points representing the mask of the object.
    boxes_points : Union[np.ndarray, List]
        A list or ndarray representing the bounding box of the object.
    confidence : float
        The confidence score of the detection.
    color : str
        The color assigned to the detected object.

    Methods
    -------
    dict():
        Converts the detected object to a dictionary format.
    """

    def __init__(self, object_name: str, mask_points, boxes_points: Union[np.ndarray, List],
                 confidence: float, color: str):
        """
        Constructs all the necessary attributes for the DetectedObject object.

        Parameters
        ----------
        object_name : str
            The name of the detected object.
        mask_points : list
            A list of points representing the mask of the object.
        boxes_points : Union[np.ndarray, List]
            A list or ndarray representing the bounding box of the object.
        confidence : float
            The confidence score of the detection.
        color : str
            The color assigned to the detected object.
        """
        self.object_name = object_name
        # Convert mask points to list of lists
        self.mask_points = [obj.tolist() for obj in mask_points]
        self.boxes_points = boxes_points
        self.confidence = confidence
        self.color = color

    def dict(self):
        """
        Converts the detected object to a dictionary format.
        Use this to serialize the object to JSON

        Returns
        -------
        dict
            A dictionary containing all the attributes of the detected object.
        """
        return {
            "object_name": self.object_name,
            "mask_points": self.mask_points,
            "boxes_points": self.boxes_points.tolist() if isinstance(self.boxes_points,
                                                                     torch.Tensor) else self.boxes_points,
            "confidence": self.confidence.item() if isinstance(self.confidence, torch.Tensor) else self.confidence,
            "color": self.color
        }
