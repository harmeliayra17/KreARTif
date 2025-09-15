from fastapi import APIRouter, Depends, UploadFile, File, Request, Form
from sqlalchemy.orm import Session
from controllers import karyaController, likeController
from database import get_db
from middleware.authenticate import get_current_user
from schemas.user_schema import UserOut
from typing import Optional

router = APIRouter(tags=["karya"])

@router.get("/")
def get_all_karya(db: Session = Depends(get_db)):
    return karyaController.get_all_karya(db)


@router.get("/me")
def get_my_karya(
    db: Session = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    return karyaController.get_my_karya(db, current_user)


@router.get("/{id}")
def get_karya_by_id(id: int, db: Session = Depends(get_db)):
    return karyaController.get_karya_by_id(db, id)


@router.post("/")
def create_karya(
    request: Request,
    judul: str = Form(...),
    deskripsi: str = Form(...),
    kategori: str = Form(...),
    file_url: Optional[str] = Form(None),
    file: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    return karyaController.create_karya(
        db=db,
        current_user=current_user,
        judul=judul,
        deskripsi=deskripsi,
        kategori=kategori,
        file=file,
        request=request,
        file_url=file_url
    )


@router.post("/update/{id}")
def update_karya_post(
    id: int,
    request: Request,
    judul: Optional[str] = Form(None),
    deskripsi: Optional[str] = Form(None),
    kategori: Optional[str] = Form(None),
    file: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    return karyaController.update_karya(
        db=db,
        current_user=current_user,
        id=id,
        judul=judul,
        deskripsi=deskripsi,
        kategori=kategori,
        file=file,
        request=request
    )



@router.delete("/{id}")
def delete_karya(
    id: int,
    db: Session = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    return karyaController.delete_karya(db, current_user, id)


@router.post("/{karya_id}/like")
def like_karya(
    karya_id: int,
    db: Session = Depends(get_db),
    current_user: UserOut = Depends(get_current_user)
):
    return likeController.lik
