from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Request
from sqlalchemy.orm import Session
from models.userModel import User
from database import get_db
from middleware.authenticate import get_current_user
from passlib.hash import bcrypt
from uuid import uuid4
import os

router = APIRouter()
UPLOAD_DIR = "./uploads/"

# GET profil pengguna saat ini
@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        user = db.query(User).filter(User.id == current_user["id"]).first()
        if not user:
            raise HTTPException(status_code=404, detail="User tidak ditemukan")
        user_data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "profile_picture": user.profile_picture
        }
        return user_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# GET semua pengguna (hanya untuk admin)
@router.get("/users")
def get_all_users(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Tidak diizinkan")

    try:
        users = db.query(User).with_entities(User.id, User.username, User.email, User.role).all()
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# UPDATE profil pengguna (termasuk upload foto)
@router.put("/me")
def update_me(
    request: Request,
    username: str = Form(None),
    email: str = Form(None),
    password: str = Form(None),
    file: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    try:
        user = db.query(User).filter(User.id == current_user["id"]).first()
        if not user:
            raise HTTPException(status_code=404, detail="User tidak ditemukan")

        if username:
            user.username = username
        if email:
            user.email = email
        if password:
            user.password_hash = bcrypt.hash(password)

        if file:
            if not file.content_type.startswith("image/"):
                raise HTTPException(status_code=400, detail="Hanya file gambar yang diizinkan")

            filename = f"{uuid4().hex}_{file.filename}"
            filepath = os.path.join(UPLOAD_DIR, filename)
            with open(filepath, "wb") as f:
                f.write(file.file.read())
            user.profile_picture = f"{request.base_url}uploads/{filename}"

        db.commit()
        db.refresh(user)

        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "profile_picture": user.profile_picture
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
