from fastapi import FastAPI
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from endpoints import router as api_router

# API entrypoint
app = FastAPI()

# CORS Policy set to accept every origin
origins = ["*", "localhost:8001"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mapping of the other endpoints defined under /endpoints/v1/...
app.include_router(api_router, prefix="/api")
app.mount("/", StaticFiles(directory="build", html=True), name="Frontend")


# Health check endpoint
@app.get("/status")
async def root():
    return {"status": "up"}
