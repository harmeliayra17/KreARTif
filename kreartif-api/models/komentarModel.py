from sqlalchemy import Column, DateTime, Integer, Text, ForeignKey, func
from sqlalchemy.orm import relationship
from database import Base

class Komentar(Base):
    __tablename__ = "komentars"

    id = Column(Integer, primary_key=True, index=True)
    isi = Column(Text, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    karya_id = Column(Integer, ForeignKey("karyas.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relasi ke user dan karya
    user = relationship("User", back_populates="komentar_list")
    karya = relationship("Karya", back_populates="komentar_list")
