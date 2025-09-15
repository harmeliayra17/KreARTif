from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.routing import APIRoute
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# Create FastAPI instance
app = FastAPI()

# Setup CORS (disesuaikan ke frontend kamu)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Ganti sesuai domain frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files from /uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Database tables creation
from config.db import engine
from models import userModel, karyaModel, komentarModel, likeModel, notifikasiModel

@app.on_event("startup")
def create_tables():
    userModel.Base.metadata.create_all(bind=engine)
    karyaModel.Base.metadata.create_all(bind=engine)
    komentarModel.Base.metadata.create_all(bind=engine)
    likeModel.Base.metadata.create_all(bind=engine)
    notifikasiModel.Base.metadata.create_all(bind=engine)

# Register Routes
from routes import (
    authRoutes,
    userRoutes,
    karyaRoutes,
    komentarRoutes,
    likeRoutes,
    nontifikasiRoutes,
)

app.include_router(authRoutes.router, prefix="/api/auth", tags=["Auth"])
app.include_router(userRoutes.router, prefix="/api")
app.include_router(karyaRoutes.router, prefix="/api/karya", tags=["Karya"])
app.include_router(komentarRoutes.router, prefix="/api/komentar", tags=["Komentar"])
app.include_router(likeRoutes.router, prefix="/api/like", tags=["Like"])
app.include_router(nontifikasiRoutes.router, prefix="/api/notifikasi", tags=["Notifikasi"])

for route in app.routes:
    if isinstance(route, APIRoute):
        print(f"{route.path} -> {route.endpoint}")
    else:
        print(f"{route.path} (non-API route)")
