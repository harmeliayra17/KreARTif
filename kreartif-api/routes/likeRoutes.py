from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from controllers import likeController
from middleware.authenticate import get_current_user
from database import get_db
from schemas.user_schema import UserOut

router = APIRouter(tags=["like"])

# GET: jumlah like suatu karya
@router.get("/count/{karya_id}")
def get_like_count(
    karya_id: int,
    db: Session = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    return likeController.get_like_count(karya_id=karya_id, db=db)

# GET: apakah user sudah like karya ini?
@router.get("/check/{karya_id}")
def is_liked_by_user(
    karya_id: int,
    db: Session = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    return likeController.is_liked_by_user(karya_id=karya_id, db=db, current_user=current_user)

# GET: semua karya yang disukai oleh user
@router.get("/liked/all")
def get_liked_karya(
    db: Session = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    return likeController.get_liked_karya(db=db, current_user=current_user)

# POST: like karya
@router.post("/{karya_id}")
def like_karya(
    karya_id: int,
    db: Session = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    return likeController.like_karya(karya_id=karya_id, db=db, current_user=current_user)

# DELETE: unlike karya
@router.delete("/{karya_id}")
def unlike_karya(
    karya_id: int,
    db: Session = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    return likeController.unlike_karya(karya_id=karya_id, db=db, current_user=current_user)
