from fastapi import APIRouter, Depends

from app.dependencies.auth import get_current_user
from app.dependencies.services import get_auth_service
from app.schemas.user import PasswordChange, ProfileUpdate, UserResponse
from app.services.auth_service import AuthService

router = APIRouter()


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
