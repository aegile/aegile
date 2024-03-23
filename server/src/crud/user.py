import math
import random
from fastapi import HTTPException
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
from werkzeug.security import generate_password_hash, check_password_hash

from src.schemas.user import UserProfile, UserRegister
from src.models import User


async def create_user(db_session: AsyncSession, user: UserRegister):
    user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        handle=f"{user.first_name}{user.last_name}{math.floor(random.random()*1000)}",
        hashed_password=generate_password_hash(user.password),
    )
    db_session.add(user)
    await db_session.commit()


async def get_users(db_session: AsyncSession):
    query = select(User)
    return (await db_session.scalars(query)).all()


async def get_user(db_session: AsyncSession, user_id: int):
    query = select(User).where(User.id == user_id)
    user = (await db_session.scalars(query)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


async def get_user_by_email(db_session: AsyncSession, email: str):
    print(f"{email=}")
    query = select(User).where(User.email == email)
    user = (await db_session.scalars(query)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


async def update_user(db_session: AsyncSession, user_id: int, data: UserProfile):
    query = select(User).where(User.id == user_id)
    db_user = (await db_session.scalars(query)).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_user.update(data)
    # db_user.hashed_password = generate_password_hash(user.password)
    await db_session.commit()


async def delete_user(db_session: AsyncSession, user_id: int):
    query = delete(User).where(User.id == user_id)
    await db_session.execute(query)
    await db_session.commit()
    if await get_user(db_session, user_id):
        raise HTTPException(status_code=500, detail="User not deleted")
