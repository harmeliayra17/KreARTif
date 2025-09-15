from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from controllers import komentarController
from middleware.authenticate import get_current_user
from database import get_db
from schemas.user_schema import UserOut
from schemas.komentar_schema import KomentarCreate

router = APIRouter(tags=["komentar"])

# GET: Semua komentar untuk suatu karya
@router.get("/{karya_id}")
def get_komentar_by_karya(
    karya_id: int,
    db: Session = Depends(get_db)
):
    return komentarController.get_komentar_by_karya(karya_id=karya_id, db=db)

# POST: Tambah komentar (hanya untuk user login)
@router.post("/{karya_id}")
def add_komentar(
    karya_id: int,
    komentar_data: KomentarCreate,
    db: Session = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    return komentarController.add_komentar(
        karya_id=karya_id,
        komentar_data=komentar_data,
        db=db,
        current_user=current_user
    )

# GET: Hitung komentar untuk karya tertentu
@router.get("/count/{karya_id}")
def get_komentar_count(
    karya_id: int,
    db: Session = Depends(get_db)
):
    return komentarController.get_komentar_count(karya_id=karya_id, db=db)
