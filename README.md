## See Label - NOI Hackathon 2024 Summer edition

> Our solution for challenge offered by **_Gruppo FOS_** at **[NOI Hackathon 2024 Summer edition](https://hackathon.bz.it)**.
> 
![screenshot](demo-screen.png)

### Team

- [Luca Favini](https://github.com/Favo02)
- [Matteo Zagheno](https://github.com/Tsagae)
- [Andrea Sacchi](https://github.com/alsacchi)
- [Matteo Bianchi](https://github.com/OnSuorce)

### Architecture

The solution is composed of two parts: the API and the frontend.

- The API provides the necessary functionality to auto-label objects within an image.
- The frontend displays the data returned from the API and manages both import and export operations.

For further details, please refer to the README files located in the `/api` and `/frontend` directories.

### Deployment

Both the API and the frontend come with a Dockerfile, enabling you to run the entire application using Docker Compose with the provided `docker-compose.yml` file.
- `docker-compose up -d`

To rebuild after changes: 
- `docker compose up --force-recreate --build`

Both the UI and the API can be accessed from `http://localhost:3004`.

### Demo

A live demo is available at: `<url>`

### TODO

- import image base64
- frontend notifications
- remove todos
