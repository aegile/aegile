from functools import wraps
from typing import List
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.models.course import CourseEnrolment
from src.models.user import User, UserSetManager


async def fetch_one(db_session: AsyncSession, model, query_id: str):
    query = select(model).where(model.id == query_id)
    item = (await db_session.scalars(query)).first()
    if not item:
        raise HTTPException(status_code=404, detail=f"{model.__name__} not found")
    return item


async def fetch_many(db_session: AsyncSession, model, query_ids: List[str]):
    query = select(model).where(model.id.in_(query_ids))
    items = (await db_session.scalars(query)).first()
    if len(items) != len(query_ids):
        raise HTTPException(
            status_code=400,
            detail=f"Some or all {model.__name__.lower()}s were not found",
        )
    return items


# =============================================================================
#                       UserSet Enrolment Validation
# =============================================================================


async def verify_single_course_enrolment(
    db_session: AsyncSession,
    user_id: str,
    course_id: str,
):
    query = (
        select(CourseEnrolment)
        .where(CourseEnrolment.user_id == user_id)
        .where(CourseEnrolment.course_id == course_id)
    )
    enrolment = (await db_session.scalars(query)).first()
    if not enrolment:
        raise HTTPException(
            status_code=403,
            detail="User(s) not enrolled in this course.",
        )


async def verify_multi_course_enrolment(
    db_session: AsyncSession,
    user_ids: List[str],
    course_id: str,
):
    query = (
        select(CourseEnrolment)
        .where(CourseEnrolment.user_id.in_(user_ids))
        .where(CourseEnrolment.course_id == course_id)
    )
    enrolments = (await db_session.scalars(query)).all()
    if len(enrolments) != len(user_ids):
        raise HTTPException(
            status_code=403,
            detail="Some or all users are not enrolled in this course.",
        )


def verify_single_parent_userset_enrolment(
    db_user: User,
    db_parent: UserSetManager,
):
    if db_user not in db_parent.userset.members:
        raise HTTPException(
            status_code=403,
            detail=f"User {db_user.handle} is not a member of this {db_parent.__class__.__name__.lower()}.",
        )


def verify_multi_parent_userset_enrolment(
    db_users: List[User],
    db_parent: UserSetManager,
):
    # check that db_users list is a subset of db_tutorial.userset.members
    if not set(db_users).issubset(set(db_parent.userset.members)):
        raise HTTPException(
            status_code=403,
            detail="Some or all users are not enrolled in this tutorial.",
        )


# POST   - database will encounter FOREIGN KEY error if id doesn't exist
# GET    - nothing gets returned
# UPDATE - need to fetch the object first, so will throw error if not found
# DELETE - nothing gets deleted as nothing is found
# What we need to check:
# - is user enrolled in a parent userset or course?
# - if multiple ids are given, is there a valid relationship?
# - submission times need to occur before the deadline
