from fastapi import HTTPException, UploadFile, Request
from sqlalchemy.orm import Session, joinedload
from models.karyaModel import Karya
from models.notifikasiModel import Notifikasi
from uuid import uuid4
from typing import Optional
import os

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def get_all_karya(db: Session):
    karya_list = db.query(Karya).options(joinedload(Karya.user)).all()

    result = []
    for karya in karya_list:
        result.append({
            "id": karya.id,
            "judul": karya.judul,
            "deskripsi": karya.deskripsi,
            "kategori": karya.kategori,
            "file_url": karya.file_url,
            "user_id": karya.user_id,
            "username": karya.user.username if karya.user else None
        })
    return result


def get_my_karya(db: Session, current_user: dict):
    return db.query(Karya).filter(Karya.user_id == current_user["id"]).all()


def get_karya_by_id(db: Session, id: int):
    karya = db.query(Karya).filter(Karya.id == id).first()
    if not karya:
        raise HTTPException(status_code=404, detail="Karya tidak ditemukan")
    return karya


def create_karya(
    db: Session,
    current_user: dict,
    judul: str,
    deskripsi: str,
    kategori: str,
    file: Optional[UploadFile],
    request: Request,
    file_url: Optional[str] = None,
):
    final_file_url = file_url

    if file:
        filename = f"{uuid4().hex}_{file.filename}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        with open(filepath, "wb") as f:
            f.write(file.file.read())
        final_file_url = f"{request.base_url}uploads/{filename}"

    if not final_file_url:
        raise HTTPException(status_code=400, detail="File atau URL harus disediakan")

    karya = Karya(
        judul=judul,
        deskripsi=deskripsi,
        kategori=kategori,
        file_url=final_file_url,
        user_id=current_user["id"],
    )

    db.add(karya)
    db.commit()
    db.refresh(karya)
    return karya


def update_karya(
    db: Session,
    current_user: dict,
    id: int,
    judul: Optional[str],
    deskripsi: Optional[str],
    kategori: Optional[str],
    file: Optional[UploadFile],
    request: Request,
):
    karya = db.query(Karya).filter(Karya.id == id).first()

    if not karya:
        raise HTTPException(status_code=404, detail="Karya tidak ditemukan")
    if karya.user_id != current_user["id"] and current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Tidak diizinkan")

    if judul:
        karya.judul = judul
    if deskripsi:
        karya.deskripsi = deskripsi
    if kategori:
        karya.kategori = kategori

    if file:
        filename = f"{uuid4().hex}_{file.filename}"
        filepath = os.path.join(UPLOAD_DIR, filename)
        with open(filepath, "wb") as f:
            f.write(file.file.read())
        karya.file_url = f"{request.base_url}uploads/{filename}"

    db.commit()
    db.refresh(karya)
    return {"msg": "Karya berhasil diperbarui", "karya": karya}


def delete_karya(db: Session, current_user: dict, id: int):
    karya = db.query(Karya).filter(Karya.id == id).first()

    if not karya:
        raise HTTPException(status_code=404, detail="Karya tidak ditemukan")
    if karya.user_id != current_user["id"] and current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Tidak diizinkan")

    db.query(Notifikasi).filter(Notifikasi.karya_id == id).delete()
    db.delete(karya)
    db.commit()
    return {"msg": "Karya berhasil dihapus"}
