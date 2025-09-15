from fastapi import HTTPException
from sqlalchemy.orm import Session, joinedload
from models.notifikasiModel import Notifikasi
from models.userModel import User
from models.karyaModel import Karya

def get_notifikasi(db: Session, current_user: dict):
    try:
        print("✅ Memulai fetch notifikasi untuk user_id:", current_user["id"])

        notifikasi_list = (
            db.query(Notifikasi)
            .filter(Notifikasi.user_id == current_user["id"])
            .options(
                joinedload(Notifikasi.dari_user).load_only(User.id, User.username, User.profile_picture),
                joinedload(Notifikasi.karya).load_only(Karya.id, Karya.file_url)
            )
            .order_by(Notifikasi.created_at.desc())
            .all()
        )

        print(f"✅ Jumlah notifikasi ditemukan: {len(notifikasi_list)}")
        return notifikasi_list

    except Exception as e:
        print("❌ Terjadi error saat mengambil notifikasi:", str(e))
        raise HTTPException(status_code=500, detail=f"Error internal: {str(e)}")
