from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.models.database import get_db
from app.services.auth_service import sign_up, sign_in

router = APIRouter()


class AuthRequest(BaseModel):
    email: str
    password: str
    display_name: str | None = None


class AuthResponse(BaseModel):
    email: str
    localId: str
    idToken: str
    refreshToken: str
    displayName: str | None = None
    role: str | None = None


@router.post("/register", response_model=AuthResponse)
def register(data: AuthRequest, db: Session = Depends(get_db)):
    try:
        return sign_up(db, data.email, data.password, data.display_name)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=AuthResponse)
def login(data: AuthRequest, db: Session = Depends(get_db)):
    try:
        return sign_in(db, data.email, data.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
