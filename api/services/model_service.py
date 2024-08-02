from ultralytics import YOLO

class ModelService:
    def __init__(self):
        pass

    def get_image_elements(self, model_path):
        model = YOLO("yolov8l-seg.pt")
        results = model("img.jpg", conf=0.5)  # results list
        # Visualize the results
        for i, r in enumerate(results):
            for f, box in enumerate(r.boxes):
                clsId = box.cls.item()
                object_name = model.names[clsId]
                mask_points = r.masks[f].xy
                boxes_points = r.boxes[f].xyxy
                confidence = r.boxes[f].conf
                print(f"Found {object_name}")
                print("Coordinates Mask:", mask_points)
                print("Coordinates Box:", boxes_points)

    def get_available_models(self):
        #TODO: Iterate in model folders to see available models
        pass


# Load a pretrained YOLOv8n model


# Run inference on 'bus.jpg'


        # print()

    # print(model.names[])
    # print(r.masks)

    # Save results to disk


def get_model() -> ModelService:
    return ModelService()
