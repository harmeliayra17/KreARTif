from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload
from models.komentarModel import Komentar
from models.karyaModel import Karya
from models.notifikasiModel import Notifikasi
from models.userModel import User

# GET: Semua komentar untuk suatu karya
def get_komentar_by_karya(karya_id: int, db: Session):
    try:
        komentar_list = (
            db.query(Komentar)
            .filter(Komentar.karya_id == karya_id)
            .options(joinedload(Komentar.user).load_only(User.username, User.profile_picture))
            .order_by(Komentar.created_at.desc())
            .all()
        )
        return komentar_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# POST: Tambah komentar + notifikasi ke pemilik karya
def add_komentar(karya_id: int, komentar_data, db: Session, current_user: dict):
    try:
        isi = komentar_data.isi
        karya = db.query(Karya).filter(Karya.id == karya_id).first()

        if not karya:
            raise HTTPException(status_code=404, detail="Karya tidak ditemukan")

        komentar = Komentar(
            karya_id=karya_id,
            user_id=current_user["id"],
            isi=isi
        )
        db.add(komentar)
        db.commit()
        db.refresh(komentar)

        if current_user["id"] != karya.user_id:
            notifikasi = Notifikasi(
                user_id=karya.user_id,
                dari_user_id=current_user["id"],
                karya_id=karya_id,
                jenis="komentar"
            )
            db.add(notifikasi)
            db.commit()

        return komentar
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# GET: Hitung komentar untuk karya tertentu
def get_komentar_count(karya_id: int, db: Session):
    try:
        count = db.query(Komentar).filter(Komentar.karya_id == karya_id).count()
        return {"count": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
