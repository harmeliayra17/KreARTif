from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from config.db import engine

# Base untuk deklarasi model
Base = declarative_base()

# Buat session lokal
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Dependency: digunakan dalam FastAPI route
def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
