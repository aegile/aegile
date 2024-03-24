from fastapi import HTTPException
from functools import wraps
from sqlalchemy.ext.asyncio import AsyncSession
from .course import get_course


def validate_course_existence(func):
    @wraps(func)
    async def wrapper(db_session: AsyncSession, course_id: str, *args, **kwargs):
        course = await get_course(db_session, course_id)
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        return await func(db_session, course_id, *args, **kwargs)

    return wrapper
