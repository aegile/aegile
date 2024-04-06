from typing import List
from fastapi import HTTPException
from sqlalchemy import select, delete
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.tutorial import Tutorial
from src.models.user import User, UserSet
from .user import get_user


async def create_tutorial(db_session: AsyncSession, tutorial_form: dict):
    tutorial = Tutorial(**tutorial_form.model_dump())
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


async def get_tutorials(db_session: AsyncSession, user_id: str, course_id: str):
    query = select(Tutorial)
    if user_id:
        query = (
            query.join(Tutorial.userset).join(UserSet.members).where(User.id == user_id)
        )
    if course_id:
        query = query.where(Tutorial.course_id == course_id)

    return (await db_session.scalars(query)).all()


async def get_tutorial(db_session: AsyncSession, tutorial_id: str):
    query = select(Tutorial).where(Tutorial.id == tutorial_id)
    db_tutorial = (await db_session.scalars(query)).first()
    if not db_tutorial:
        raise HTTPException(status_code=404, detail="Tutorial not found")
    return db_tutorial


async def update_tutorial(
    db_session: AsyncSession, tutorial_id: str, update_data: dict
):
    db_tutorial = await get_tutorial(db_session, tutorial_id)
    db_tutorial.update(update_data)
    await db_session.commit()


async def delete_tutorial(db_session: AsyncSession, tutorial_id: str):
    query = delete(Tutorial).where(Tutorial.id == tutorial_id)
    await db_session.execute(query)
    await db_session.commit()
    if await get_tutorial(db_session, tutorial_id):
        raise HTTPException(status_code=500, detail="Tutorial not deleted")


async def get_enrolled_tutorials(db_session: AsyncSession, user_id: str):
    query = (
        select(Tutorial)
        .join(Tutorial.userset)
        .join(UserSet.members)
        .where(User.id == user_id)
    )
    return (await db_session.execute(query)).scalars().all()


async def enrol_tutorial_member(
    db_session: AsyncSession, user_id: str, tutorial_id: str
):
    # check if user is enrolled in parent course
    db_tutorial: Tutorial = await get_tutorial(db_session, tutorial_id)
    # await verify_single_course_enrolment(db_session, user_id, db_tutorial.course_id)

    db_user = await get_user(db_session, user_id)
    db_tutorial.member_add_one(db_user)  # handles user already in userset
    await db_session.commit()


async def enrol_tutorial_members(
    db_session: AsyncSession, user_ids: List[str], tutorial_id: str
):
    # check if users are enrolled in parent course
    db_tutorial: Tutorial = await get_tutorial(db_session, tutorial_id)
    # await verify_multi_course_enrolment(db_session, user_ids, db_tutorial.course_id)

    query = select(User).where(User.id.in_(user_ids))
    db_users: List[User] = (await db_session.execute(query)).scalars().all()
    db_tutorial.member_add_many(db_users)  # handles users already in userset
    await db_session.commit()


async def get_tutorial_enrolments(db_session: AsyncSession, tutorial_id: str):
    db_tutorial = await get_tutorial(db_session, tutorial_id)
    return db_tutorial.userset.members
