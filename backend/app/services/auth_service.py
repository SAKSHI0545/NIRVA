from fastapi import HTTPException, status

from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import user_document
from app.repositories.user_repository import UserRepository
from app.schemas.user import PasswordChange, ProfileUpdate, UserCreate, UserLogin


class AuthService:
    def __init__(self, repository: UserRepository):
        self.repository = repository

    async def register(self, payload: UserCreate) -> dict:
        if await self.repository.find_by_email(payload.email):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email is already registered")
        if await self.repository.find_by_username(payload.username):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username is already taken")

        user = await self.repository.create(
            user_document(payload.username, payload.email, hash_password(payload.password))
        )
        return {"access_token": create_access_token(user["id"]), "user": user}

    async def login(self, payload: UserLogin) -> dict:
        user = await self.repository.find_by_email(payload.email)
        if not user or not verify_password(payload.password, user["password_hash"]):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        return {"access_token": create_access_token(user["id"]), "user": user}

    async def update_profile(self, user_id: str, payload: ProfileUpdate) -> dict:
        updates = payload.model_dump(exclude_unset=True)
        if "email" in updates and await self.repository.find_by_email(updates["email"]):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email is already registered")
        if "username" in updates and await self.repository.find_by_username(updates["username"]):
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username is already taken")
        user = await self.repository.update(user_id, updates)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return user

    async def change_password(self, user_id: str, payload: PasswordChange) -> None:
        user = await self.repository.find_by_id(user_id)
        if not user or not verify_password(payload.current_password, user["password_hash"]):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")
        await self.repository.update(user_id, {"password_hash": hash_password(payload.new_password)})
