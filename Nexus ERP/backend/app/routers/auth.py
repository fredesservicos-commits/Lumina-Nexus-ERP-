from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.auth_service import sign_up, sign_in

router = APIRouter()


class AuthRequest(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    email: str
    localId: str
    idToken: str
    refreshToken: str


@router.post("/register", response_model=AuthResponse)
def register(data: AuthRequest):
    try:
        return sign_up(data.email, data.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=AuthResponse)
def login(data: AuthRequest):
    try:
        return sign_in(data.email, data.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))