from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Karya(Base):
    __tablename__ = "karyas"

    id = Column(Integer, primary_key=True, index=True)
    judul = Column(String(255), nullable=False)
    deskripsi = Column(Text, nullable=False)
    kategori = Column(String(255), nullable=False)
    file_url = Column(String(255), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relasi opsional (bisa diaktifkan jika dibutuhkan)
    komentar_list = relationship("Komentar", back_populates="karya", cascade="all, delete-orphan")
    user = relationship("User", back_populates="karya")
    likes = relationship("Like", back_populates="karya", cascade="all, delete-orphan")
    notifikasi_list = relationship("Notifikasi", back_populates="karya", cascade="all, delete-orphan")
