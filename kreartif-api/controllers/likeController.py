from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload
from models.likeModel import Like
from models.karyaModel import Karya
from models.notifikasiModel import Notifikasi

# Like karya
def like_karya(karya_id: int, db: Session, current_user: dict):
    karya = db.query(Karya).filter(Karya.id == karya_id).first()
    if not karya:
        raise HTTPException(status_code=404, detail="Karya tidak ditemukan")

    existing_like = db.query(Like).filter(
        Like.user_id == current_user["id"], Like.karya_id == karya_id
    ).first()
    if existing_like:
        raise HTTPException(status_code=400, detail="Sudah disukai")

    like = Like(user_id=current_user["id"], karya_id=karya_id)
    db.add(like)
    db.commit()
    db.refresh(like)

    # Tambahkan notifikasi
    if current_user["id"] != karya.user_id:
        notif = Notifikasi(
            user_id=karya.user_id,
            dari_user_id=current_user["id"],
            karya_id=karya_id,
            jenis="like"
        )
        db.add(notif)
        db.commit()

    return {"msg": "Liked", "like": like}

# Unlike karya
def unlike_karya(karya_id: int, db: Session, current_user: dict):
    like = db.query(Like).filter(
        Like.user_id == current_user["id"], Like.karya_id == karya_id
    ).first()
    if not like:
        raise HTTPException(status_code=404, detail="Like tidak ditemukan")
    db.delete(like)
    db.commit()
    return {"msg": "Unliked"}

# Get jumlah like
def get_like_count(karya_id: int, db: Session):
    count = db.query(Like).filter(Like.karya_id == karya_id).count()
    return {"count": count}

# Cek apakah user sudah like
def is_liked_by_user(karya_id: int, db: Session, current_user: dict):
    like = db.query(Like).filter(
        Like.karya_id == karya_id, Like.user_id == current_user["id"]
    ).first()
    return {"liked": bool(like)}

# Get semua karya yang disukai user
def get_liked_karya(db: Session, current_user: dict):
    likes = (
        db.query(Like)
        .filter(Like.user_id == current_user["id"])
        .options(joinedload(Like.karya))
        .all()
    )
    karya_list = [like.karya for like in likes if like.karya]
    return karya_list
