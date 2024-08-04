<img src="assets/logo.png" width="150" align="right" alt="Logo" />

## See Label - NOI Hackathon 2024 Summer edition

> Our solution for challenge (_[requirements](assets/challenge-requirements.pdf)_) offered by **_Gruppo FOS_** at **[NOI Hackathon 2024 Summer edition](https://hackathon.bz.it)**:

**_SeeLabel_** is a webapp that lets users upload an **image** and **automatically label** objects within it. The application allows users to **manually add new labels** and **export (and import back)** the results in a JSON format.

### Features (with video demos)

- **Automatically detect** objects in an uploaded image

<video src="https://github.com/user-attachments/assets/81169f74-817a-4c9d-8f25-2b5a405f1ebc"></video>

- **Manually draw** objects (with invalid polygon detection)

<video src="https://github.com/user-attachments/assets/b76bd4da-0e44-4731-b514-e3e437bf9070"></video>

- **Export** _objects only_ or _objects + image_ in a JSON format (and **import** back)

<video src="https://github.com/user-attachments/assets/5438f248-73a4-41a0-8d8f-471780b05896"></video>

### Live demo and Presentation

> [!WARNING]
> The **demo** is hosted on an Intel Pentium Dual Core 4GB RAM server, please be **patient**.

A live demo is available at: [seelabel.favo02.dev](https://seelabel.favo02.dev) _(again, please be patient!)_

The presentation is available at: [slides.com/favo02/see-label/fullscreen](https://slides.com/favo02/see-label/fullscreen)

### Architecture

The solution is composed of two parts: the API and the frontend.

- The API provides the necessary functionality to **auto-label** objects within an image
  - Built using **FastAPI** and **PyTorch**
  - Change the **underlying model** simply changing an **environment variable** in `docker-compose` file (currently using **yolov9e**)
  - Surprisingly **lightweight**: good results are achieved with an **Intel Pentium** Dual Core 4GB RAM

For further details, please refer to the [README](./api/README.md) file located in the `/api` directory.

- The frontend displays the data returned from the API and manages both import and export operations
  - Built using **React**
  - Draw polygons both fetching backend API and manually, using `canvas` element
  - **Invalid polygons** validation
  - **Import / Export** polygons in **JSON** format (both with or without Base64 encoded images)

### Deployment

Both the API and the frontend come with a `Dockerfile`, enabling you to run the entire application using Docker Compose with the provided `docker-compose.yml` file:

- `docker-compose up -d`

To rebuild after changes:
- `docker compose up --force-recreate --build`

Both the UI and the API can be accessed from `http://localhost:3004`.

Starting independently the two services (for development purpose) is possible using the `docker-compose.yml.old` file:

- `docker-compose -f docker-compose.yml.old up -d`
