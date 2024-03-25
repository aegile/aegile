import math
import random
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash

from src.schemas.auth import AuthRegister, AuthLogin
from src.models import User


async def register_user(db_session: AsyncSession, user: AuthRegister):
    db_user = User(
        first_name=user.first_name,
        last_name=user.last_name,
        email=user.email,
        handle=f"{user.first_name}{user.last_name}{math.floor(random.random()*10000)}",
        hashed_password=generate_password_hash(user.password),
    )
    try:
        db_session.add(db_user)
        await db_session.commit()
    except IntegrityError as exc:
        await db_session.rollback()
        raise HTTPException(status_code=400, detail="User already exists") from exc


async def login_user(db_session: AsyncSession, user: AuthLogin):
    query = select(User).where(User.email == user.email)
    db_user = (await db_session.scalars(query)).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    if not check_password_hash(db_user.hashed_password, user.password):
        raise HTTPException(status_code=401, detail="Invalid password")
