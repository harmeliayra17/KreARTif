from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, ForeignKey, Enum
from sqlalchemy.orm import relationship
from database import Base
import enum

class JenisNotifikasiEnum(str, enum.Enum):
    like = "like"
    komentar = "komentar"

class Notifikasi(Base):
    __tablename__ = "notifikasis"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    dari_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    karya_id = Column(Integer, ForeignKey("karyas.id"), nullable=False)
    jenis = Column(Enum(JenisNotifikasiEnum), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    dari_user = relationship("User", foreign_keys=[dari_user_id])
    karya = relationship("Karya", back_populates="notifikasi_list")
