from fastapi import APIRouter, Depends
from users.schemas import UserSchemas
from users.service import User

user_router = APIRouter(tags=["user"])


@user_router.post('/add_user')
async def add_user(username: UserSchemas, menu: User = Depends()):
    return await menu.add_user(username.username)

@user_router.get('/get_user/{user}')
async def add_user(user: str, menu: User = Depends()):
    return await menu.get_user(user)