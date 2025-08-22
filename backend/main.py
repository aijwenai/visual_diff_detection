from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.comparison import router as comp_router
import os

app = FastAPI()
origins = ["*"]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=["*"], allow_headers=["*"])

static_dir = os.path.join(os.path.dirname(__file__), 'static')
upload_dir = os.path.join(static_dir, 'uploads')
os.makedirs(upload_dir, exist_ok=True)

app.mount("/static", StaticFiles(directory=static_dir), name="static")
app.include_router(comp_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Visual Regression MVP"}