from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship
from database import Base
import enum

class RoleEnum(str, enum.Enum):
    user = "user"
    admin = "admin"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(RoleEnum), default=RoleEnum.user, nullable=False)
    profile_picture = Column(String(255), nullable=True)

    # Relasi (opsional tergantung kebutuhan proyek)
    karya = relationship("Karya", back_populates="user", cascade="all, delete-orphan")
    komentar_list = relationship("Komentar", back_populates="user", cascade="all, delete")
    likes = relationship("Like", back_populates="user", cascade="all, delete-orphan")
