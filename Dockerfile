FROM node:22-alpine AS frontend

WORKDIR /app/frontend

COPY frontend .

RUN npm ci
RUN npm run build
RUN mv build /app/build

FROM ultralytics/ultralytics:latest-python AS api

WORKDIR /app/api

COPY ./api .
RUN pip install --no-cache-dir -r requirements.txt
COPY --from=frontend /app/build /app/api/build

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
