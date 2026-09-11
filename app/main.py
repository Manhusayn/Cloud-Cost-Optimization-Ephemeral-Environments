from fastapi import FastAPI
from fastapi.responses import JSONResponse
import os
import socket
import time

app = FastAPI(title="FinOps Preview Service", version="1.0.0")
started_at = time.time()


@app.get("/")
def root():
    return {
        "service": "finops-preview-service",
        "status": "running",
        "hostname": socket.gethostname(),
        "environment": os.getenv("ENVIRONMENT", "local"),
        "uptime_seconds": round(time.time() - started_at, 2),
    }


@app.get("/health")
def health():
    return JSONResponse({"status": "healthy"})


@app.get("/ready")
def ready():
    return JSONResponse({"status": "ready"})
