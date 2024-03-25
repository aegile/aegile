from functools import wraps
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.course import Course, CourseEnrolment
from src.models.tutorial import Tutorial
from src.models.project import Project
from src.models.user import User, UserSetManager


def validate_course_existence(func):
    @wraps(func)
    async def wrapper(db_session: AsyncSession, course_id: str, *args, **kwargs):
        query = select(Course).where(Course.id == course_id)
        course = (await db_session.scalars(query)).first()
        if not course:
            raise HTTPException(status_code=404, detail="Course not found")
        return await func(db_session, course_id, *args, **kwargs)

    return wrapper


def validate_tutorial_existence(func):
    @wraps(func)
    async def wrapper(db_session: AsyncSession, tutorial_id: str, *args, **kwargs):
        query = select(Tutorial).where(Tutorial.id == tutorial_id)
        tutorial = (await db_session.scalars(query)).first()
        if not tutorial:
            raise HTTPException(status_code=404, detail="Tutorial not found")
        return await func(db_session, tutorial_id, *args, **kwargs)

    return wrapper


def verify_parent_userset_enrolment(user: User, collection: UserSetManager):
    if user not in collection.userset.members:
        raise HTTPException(
            status_code=403,
            detail=f"User {user.handle} is not a member of this {collection.__class__.__name__.lower()}.",
        )


def verify_current_userset_enrolment(user: User, collection: UserSetManager):
    if user in collection.userset.members:
        raise HTTPException(
            status_code=403,
            detail=f"User {user.handle} is already a member of this {collection.__class__.__name__.lower()}.",
        )


def verify_tutorial_enrolment_eligibility(func):
    @wraps(func)
    async def wrapper(
        db_session: AsyncSession, user_id: str, tutorial_id: str, *args, **kwargs
    ):
        db_tutorial = (
            await db_session.scalars(select(Tutorial).where(Tutorial.id == tutorial_id))
        ).first()
        db_user = (
            await db_session.scalars(select(User).where(User.id == user_id))
        ).first()
        query = (
            select(CourseEnrolment)
            .where(CourseEnrolment.user_id == user_id)
            .where(CourseEnrolment.course_id == db_tutorial.course_id)
        )
        enrolment = (await db_session.scalars(query)).first()
        if not enrolment:
            raise HTTPException(
                status_code=403,
                detail=f"User {db_user.handle} is not enrolled in this course.",
            )
        verify_current_userset_enrolment(db_user, db_tutorial)
        return await func(db_session, db_user, db_tutorial, *args, **kwargs)

    return wrapper


def verify_project_enrolment_eligibility(func):
    @wraps(func)
    async def wrapper(
        db_session: AsyncSession, user_id: str, project_id: str, *args, **kwargs
    ):
        db_project = (
            await db_session.scalars(select(Project).where(Project.id == project_id))
        ).first()
        db_tutorial = (
            await db_session.scalars(
                select(Tutorial).where(Tutorial.id == db_project.tutorial_id)
            )
        ).first()
        db_user = (
            await db_session.scalars(select(User).where(User.id == user_id))
        ).first()
        verify_parent_userset_enrolment(db_user, db_tutorial)
        verify_current_userset_enrolment(db_user, db_project)
        return await func(db_session, db_user, db_project, *args, **kwargs)

    return wrapper
