from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base

class Like(Base):
    __tablename__ = "likes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    karya_id = Column(Integer, ForeignKey("karyas.id"), nullable=False)

    # Relasi ke karya
    karya = relationship("Karya", back_populates="likes")
    user = relationship("User", back_populates="likes")

    # Optional: untuk mencegah duplikat user_id + karya_id
    __table_args__ = (UniqueConstraint('user_id', 'karya_id', name='_user_karya_uc'),)
