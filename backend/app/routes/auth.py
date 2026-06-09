from fastapi import APIRouter, Depends

from app.dependencies.auth import get_current_user
from app.dependencies.services import get_auth_service
from app.schemas.user import PasswordChange, ProfileUpdate, TokenResponse, UserCreate, UserLogin, UserResponse
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/register", response_model=TokenResponse, status_code=201)
async def register(payload: UserCreate, service: AuthService = Depends(get_auth_service)) -> dict:
    return await service.register(payload)


@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLogin, service: AuthService = Depends(get_auth_service)) -> dict:
    return await service.login(payload)


@router.post("/logout")
async def logout() -> dict[str, str]:
    return {"message": "Logout is handled client-side by removing the token"}


@router.get("/me", response_model=UserResponse)
async def me(current_user: dict = Depends(get_current_user)) -> dict:
    return current_user


@router.patch("/profile", response_model=UserResponse)
async def update_profile(
    payload: ProfileUpdate,
    current_user: dict = Depends(get_current_user),
    service: AuthService = Depends(get_auth_service),
) -> dict:
    return await service.update_profile(current_user["id"], payload)


@router.post("/change-password")
async def change_password(
    payload: PasswordChange,
    current_user: dict = Depends(get_current_user),
    service: AuthService = Depends(get_auth_service),
) -> dict[str, str]:
    await service.change_password(current_user["id"], payload)
    return {"message": "Password updated"}
