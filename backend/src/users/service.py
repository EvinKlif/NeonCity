from fastapi import Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session
from database import get_session
from users.model import User as Usermodel


class User:
    def __init__(self, session: AsyncSession = Depends(get_session)):
        self.db: Session = session
        self.user = Usermodel


    async def add_user(self, username):
        result = await self.db.execute(select(self.user).filter(self.user.username == username))
        user = result.scalars().first()
        if user:
            raise HTTPException(status_code=409, detail="User already exists")
        else:
            self.user_name = self.user(username=username)
            self.db.add(self.user_name)
            await self.db.commit()
            await self.db.refresh(self.user_name)
            return self.user_name


    async def get_user(self, username):
        result = await self.db.execute(select(self.user).filter(self.user.username == username))
        user = result.scalars().first()
        if user:
            return user.username
        raise HTTPException(status_code=404, detail="User not found")
