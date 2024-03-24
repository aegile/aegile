from fastapi import HTTPException
from sqlalchemy import select, delete
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.tutorial import Tutorial
from .user import get_user
from .util import validate_course_existence


@validate_course_existence
async def create_tutorial(
    db_session: AsyncSession, course_id: str, tutorial_form: dict
):
    tutorial = Tutorial(course_id=course_id, **tutorial_form.model_dump())
    try:
        db_session.add(tutorial)
        await db_session.commit()
    except IntegrityError as exc:
        await db_session.rollback()
        raise HTTPException(
            status_code=400,
            detail=exc.orig.args[0],
            # detail=f"Tutorial '{tutorial_form.name}' already exists for this course.",
        ) from exc


@validate_course_existence
async def get_tutorials_by_course(db_session: AsyncSession, course_id: str):
    query = select(Tutorial).where(Tutorial.course_id == course_id)
    return (await db_session.scalars(query)).all()


async def get_tutorial(db_session: AsyncSession, tutorial_id: str):
    query = select(Tutorial).where(Tutorial.id == tutorial_id)
    tutorial = (await db_session.scalars(query)).first()
    if not tutorial:
        raise HTTPException(status_code=404, detail="Tutorial not found")
    return tutorial


async def update_tutorial(
    db_session: AsyncSession, tutorial_id: str, update_data: dict
):
    tutorial = await get_tutorial(db_session, tutorial_id)
    tutorial.update(update_data)
    await db_session.commit()


async def delete_tutorial(db_session: AsyncSession, tutorial_id: str):
    query = delete(Tutorial).where(Tutorial.id == tutorial_id)
    await db_session.execute(query)
    await db_session.commit()
    if await get_tutorial(db_session, tutorial_id):
        raise HTTPException(status_code=500, detail="Tutorial not deleted")


async def get_enrolled_tutorials(db_session: AsyncSession, user_id: str):
    db_user = get_user(db_session, user_id)
    query = select(Tutorial).where(db_user in Tutorial.userset.members)
    return (await db_session.scalars(query)).all()


async def enrol_user_to_tutorial(
    db_session: AsyncSession, user_id: str, tutorial_id: str
):
    db_tut = await get_tutorial(db_session, tutorial_id)
    db_user = await get_user(db_session, user_id)
    db_tut.member_add_one(db_user)
    await db_session.commit()
    return {"message": "Success!! User enrolled to tutorial."}


async def get_tutorial_enrolments(db_session: AsyncSession, tutorial_id: str):
    db_tut = await get_tutorial(db_session, tutorial_id)
    return db_tut.userset.members
