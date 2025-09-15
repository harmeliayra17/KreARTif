from pydantic import BaseModel

class KomentarCreate(BaseModel):
    isi: str