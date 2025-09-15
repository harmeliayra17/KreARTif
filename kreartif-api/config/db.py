from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

load_dotenv()

# Ambil variabel dari .env
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")
DB_HOST = os.getenv("DB_HOST")

# Format koneksi MySQL (jika pakai MySQL)
DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"

# Buat engine SQLAlchemy
engine = create_engine(DATABASE_URL)

# Ekspor engine agar bisa dipakai di tempat lain
# Contoh: from config.db import engine
