from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from models.userModel import User  # Asumsikan kamu punya model SQLAlchemy User
from config.db import engine
from database import get_db  # Fungsi untuk mendapatkan session
from schemas.user_schema import UserRegister, UserLogin
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = os.getenv("JWT_SECRET")
ALGORITHM = "HS256"

# REGISTER
@router.post("/register")
def register_user(payload: UserRegister, db: Session = Depends(get_db)):
    hashed_password = pwd_context.hash(payload.password)
    new_user = User(
        username=payload.username,
        email=payload.email,
        password_hash=hashed_password,
        role="user"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"msg": "User registered", "user": {"id": new_user.id, "email": new_user.email}}

# LOGIN
@router.post("/login")
def login_user(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not pwd_context.verify(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token_data = {
        "id": user.id,
        "role": user.role
    }

    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)

    return {
        "token": token,
        "id": user.id,
        "role": user.role
    }
