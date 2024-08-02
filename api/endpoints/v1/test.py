from PIL import Image

from ultralytics import YOLO

# Load a pretrained YOLOv8n model
model = YOLO("yolov8l-seg.pt")

# Run inference on 'bus.jpg'
results = model("img.jpg", conf=0.5)  # results list
result = results[0]
# Visualize the results
for i, r in enumerate(results):

    for f, box in enumerate(r.boxes):
        
        clsId = box.cls.item()
        object_name = model.names[clsId]
        mask_points = r.masks[f].xy
        boxes_points = r.boxes[f].xyxy
        print(f"Found {object_name}")
        print("Coordinates Mask:", mask_points)
        print("Coordinates Box:", boxes_points)



        # print()

    # print(model.names[])
    # print(r.masks)

    # Save results to disk