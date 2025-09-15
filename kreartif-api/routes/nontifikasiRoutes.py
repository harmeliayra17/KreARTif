from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from controllers import nontifikasiController
from middleware.authenticate import get_current_user
from schemas.user_schema import UserOut
from database import get_db

router = APIRouter(tags=["notifikasi"])

# GET: semua notifikasi untuk user yang login
@router.get("/")
def get_notifikasi(
    db: Session = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    return nontifikasiController.get_notifikasi(db, current_user)
