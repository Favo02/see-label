# API 

Backend of the SeeLabel used to retrieve elements within the given images via YOLO vision models and return labels, mask coordinates, colors to the client


## Usage

The service exposes a REST API at `POST /api/v1/image-data`, where an image can be passed to the YOLO model to label the objects within. Clients can also set two optional parameters:

- `model_name`: The name of the YOLO model to use (default is `yolov8x-seg.pt`).
- `confidence_threshold`: Filters the detected objects based on their confidence score (default is `0.25`).

### Example Request

A `curl` request to the endpoint would look like the following:

```bash
curl -X POST -F "file=@/path/to/your/photo.jpeg" -H "Content-Type: multipart/form-data" -F 'request={"model_name": "yolov8x-seg.pt", "confidence_threshold": 0.3};type=application/json' "http://localhost:8000/api/v1/image-data"
```

A Response would be an array of Detected objects like this:
```json
{
  "object_name": "person",
  "mask_points": [
      [
        4471.64990234375,
        2764.5
      ],
      [
        4471.64990234375,
        2790.150146484375
      ],
      [
        4454.5498046875,
        2807.25
      ],
      [
        4428.89990234375,
        2807.25
      ],
      [
        4428.89990234375,
        2952.60009765625
      ],
      [
        4454.5498046875,
        2952.60009765625
      ],
      [
        4463.10009765625,
        2944.050048828125
      ],
      [
        4488.75,
        2944.050048828125
      ],
      [
        4497.2998046875,
        2935.5
      ],
      [
        4540.0498046875,
        2935.5
      ],
      [
        4591.35009765625,
        2986.800048828125
      ],
      [
        4591.35009765625,
        3003.900146484375
      ],
      [
        4599.89990234375,
        3012.449951171875
      ],
      [
        4659.75,
        3012.449951171875
      ],
      [
        4659.75,
        2995.35009765625
      ],
      [
        4634.10009765625,
        2995.35009765625
      ],
      [
        4617,
        2978.25
      ],
      [
        4617,
        2969.699951171875
      ],
      [
        4608.4501953125,
        2961.150146484375
      ],
      [
        4608.4501953125,
        2952.60009765625
      ],
      [
        4591.35009765625,
        2935.5
      ],
      [
        4591.35009765625,
        2892.75
      ],
      [
        4582.7998046875,
        2884.199951171875
      ],
      [
        4582.7998046875,
        2858.550048828125
      ],
      [
        4574.25,
        2850
      ],
      [
        4574.25,
        2841.449951171875
      ],
      [
        4565.7001953125,
        2832.900146484375
      ],
      [
        4565.7001953125,
        2824.35009765625
      ],
      [
        4574.25,
        2815.800048828125
      ],
      [
        4574.25,
        2764.5
      ]
  ],
  "boxes_points": [
    [
      4445.2880859375,
      2751.505126953125,
      4643.27001953125,
      3029.362548828125
    ]
  ],
  "confidence": 0.4938448667526245,
  "color": "#aec7e8"
}
```
## Noteworthy Components

| File                                                                                                    | Description                                                                   |
|---------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------|
| [main](https://github.com/Favo02/see-label/blob/main/api/main.py)                                       | Entry point for the FastApi application, it maps all the endpoints under /api |
| [process_image](https://github.com/Favo02/see-label/blob/main/api/endpoints/v1/process_image.py)        | endpoint that labels object of the given image                                |
| [model_service](https://github.com/Favo02/see-label/blob/main/api/services/model_service.py)            | service class that implements the logic required to label and output the data |
| [color_service](https://github.com/Favo02/see-label/blob/main/api/services/color_service.py)            | service class used to generate colors for the masks on the UI                 |
| [detected_object](https://github.com/Favo02/see-label/blob/main/api/dto/detected_object.py)             | Object representing a detected object                                         |
| [image_process_request](https://github.com/Favo02/see-label/blob/main/api/dto/image_process_request.py) | Optional request body for the process_image endpoint                          |

## Frameworks:

![FastApi](https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png) ![PyTorch](https://raw.githubusercontent.com/pytorch/pytorch/main/docs/source/_static/img/pytorch-logo-dark.png)

