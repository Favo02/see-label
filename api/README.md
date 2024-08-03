# API 

Backend of the SeeLabel used to retrieve elements within the given images via YOLO vision models

## Usage

The service exposes a REST API at `POST /api/v1/image-data`, where an image can be passed to the YOLO model to label the objects within. Clients can also set two optional parameters:

- `model_name`: The name of the YOLO model to use (default is `yolov8x-seg.pt`).
- `confidence_threshold`: Filters the detected objects based on their confidence score (default is `0.25`).

### Example Request

A `curl` request to the endpoint would look like the following:

```bash
curl -F "file=@path/to/your/image.jpg" "http://localhost:8000/api/v1/image-data?model_name=yolov8x-seg.pt&confidence_threshold=0.3"
```
## Frameworks:

![FastApi](https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png) ![PyTorch](https://raw.githubusercontent.com/pytorch/pytorch/main/docs/source/_static/img/pytorch-logo-dark.png)

