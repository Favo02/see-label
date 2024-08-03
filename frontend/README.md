# Frontend

The frontend main tasks are:
- display and draw polygons returned from the API
- let the user draw manually polygons, storing them in the same format as the ones from the API
- export / import polygons and images

## Exporting and Importing

The frontend allows the user to export and import both polygons only and polygons and images, both in JSON format (with Base64 encoding for the image, if included).

## Usage and Deploy

The frontend uses the React Framework and a bit of vanilla JavaScript, mostly to draw on canvas.

It can be build independently from the backend, and it can be deployed on a static server, using the `Dockerfile` provided in the `frontend` folder.
