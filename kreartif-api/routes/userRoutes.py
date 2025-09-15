from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status, Request, Form
from sqlalchemy.orm import Session
from controllers import userController
from middleware.authenticate import get_current_user
from schemas.user_schema import UserOut
from database import get_db

router = APIRouter(prefix="/user", tags=["user"])

# GET profil sendiri
@router.get("/me")
def get_me(
    db: Session = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    return userController.get_me(current_user, db)

# PATCH update profil + foto
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
    return userController.update_me(
        request=request,
        username=username,
        email=email,
        password=password,
        file=file,
        db=db,
        current_user=current_user
    )

# GET semua user — hanya admin boleh
@router.get("/")
def get_all_users(
    db: Session = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akses ditolak: hanya admin yang diizinkan"
        )
    return userController.get_all_users(db)
