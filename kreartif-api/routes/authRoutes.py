from fastapi import APIRouter, Depends, HTTPException, status
from controllers import authController
from schemas.user_schema import UserRegister, UserLogin
from sqlalchemy.orm import Session
from database import get_db

router = APIRouter(tags=["auth"])

@router.post("/register")
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    return authController.register_user(user_data, db)

@router.post("/login")
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    return authController.login_user(login_data, db)

