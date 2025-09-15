from fastapi import Depends, HTTPException, status
from middleware.authenticate import get_current_user

def role_required(required_role: str):
    def wrapper(current_user: dict = Depends(get_current_user)):
        if not current_user or current_user.get("role") != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Akses ditolak: tidak memiliki izin"
            )
        return current_user
    return Depends(wrapper)
