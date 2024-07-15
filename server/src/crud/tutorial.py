from typing import List
from fastapi import HTTPException
from sqlalchemy import select, delete, and_, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.tutorial import Tutorial
from src.models.user import User, UserSet
from src.models.course import CourseEnrolment
from src.models.assignment import Assignment
from src.models.membership import (
    TutorialMembership,
    ProjectMembership,
)
from src.models.project import Project
from pprint import pprint
from .user import get_user


def create_tutorial(db_session: Session, tutorial_form: dict):
    tutorial = Tutorial(**tutorial_form.model_dump())
    try:
        db_session.add(tutorial)
        db_session.commit()
    except IntegrityError as exc:
        db_session.rollback()
        raise HTTPException(
            status_code=400,
            detail=exc.orig.args[0],
            # detail=f"Tutorial '{tutorial_form.name}' already exists for this course.",
        ) from exc


def get_tutorials(db_session: Session, user_id: str, course_id: str):
    query = select(Tutorial)
    if user_id:
        query = (
            query.join(Tutorial.userset).join(UserSet.members).where(User.id == user_id)
        )
    if course_id:
        query = query.where(Tutorial.course_id == course_id)

    return (db_session.scalars(query)).all()


def get_tutorial(db_session: Session, tutorial_id: str):
    query = select(Tutorial).where(Tutorial.id == tutorial_id)
    db_tutorial = (db_session.scalars(query)).first()
    if not db_tutorial:
        raise HTTPException(status_code=404, detail="Tutorial not found")
    return db_tutorial


def update_tutorial(db_session: Session, tutorial_id: str, update_data: dict):
    db_tutorial = get_tutorial(db_session, tutorial_id)
    db_tutorial.update(update_data)
    db_session.commit()


def delete_tutorial(db_session: Session, tutorial_id: str):
    query = delete(Tutorial).where(Tutorial.id == tutorial_id)
    db_session.execute(query)
    db_session.commit()
    if get_tutorial(db_session, tutorial_id):
        raise HTTPException(status_code=500, detail="Tutorial not deleted")


def get_enrolled_tutorials(db_session: Session, user_id: str):
    query = (
        select(Tutorial)
        .join(Tutorial.userset)
        .join(UserSet.members)
        .where(User.id == user_id)
    )
    return (db_session.execute(query)).scalars().all()


def enrol_tutorial_member(db_session: Session, user_id: str, tutorial_id: str):
    # check if user is enrolled in parent course
    db_tutorial: Tutorial = get_tutorial(db_session, tutorial_id)
    # verify_single_course_enrolment(db_session, user_id, db_tutorial.course_id)

    db_user = get_user(db_session, user_id)
    db_tutorial_membership = TutorialMembership(
        tutorial_id=tutorial_id, user_id=user_id, course_id=db_tutorial.course_id
    )
    db_session.add(db_tutorial_membership)
    # db_tutorial.member_add_one(db_user)  # handles user already in userset
    db_session.commit()


def enrol_tutorial_members(db_session: Session, user_ids: List[str], tutorial_id: str):
    # check if users are enrolled in parent course
    db_tutorial: Tutorial = get_tutorial(db_session, tutorial_id)
    # verify_multi_course_enrolment(db_session, user_ids, db_tutorial.course_id)

    query = select(User).where(User.id.in_(user_ids))
    db_users: List[User] = (db_session.execute(query)).scalars().all()
    db_tutorial.member_add_many(db_users)  # handles users already in userset
    db_session.commit()


def get_tutorial_members(db_session: Session, tutorial_id: str, assignment_id: str):
    db_tutorial = get_tutorial(db_session, tutorial_id)
    user_ids = [user.id for user in db_tutorial.members]

    if not assignment_id:
        query = select(CourseEnrolment).where(
            and_(
                CourseEnrolment.course_id == db_tutorial.course_id,
                CourseEnrolment.user_id.in_(user_ids),
            )
        )

        db_enrolments = (db_session.execute(query)).scalars().all()
        return [
            {**enrolment.user.__dict__, "role": enrolment.role}
            for enrolment in db_enrolments
        ]

    query = (
        select(CourseEnrolment, Project.name)
        .join(
            Assignment,
            CourseEnrolment.course_id == Assignment.course_id,
        )
        .join(
            ProjectMembership,
            and_(
                CourseEnrolment.user_id == ProjectMembership.user_id,
                Assignment.id == ProjectMembership.assignment_id,
            ),
            isouter=True,
        )
        .join(
            Project,
            and_(
                ProjectMembership.project_id == Project.id,
                Project.assignment_id == Assignment.id,
            ),
            isouter=True,
        )
        .where(
            and_(
                CourseEnrolment.user_id.in_(user_ids),
                Assignment.id == assignment_id,
            )
        )
    )
    db_data = (db_session.execute(query)).all()

    # pprint(db_data)
    return [
        {**enrolment.user.__dict__, "role": enrolment.role, "group": project}
        for enrolment, project in db_data
    ]


def get_tutorial_enrollable(db_session: Session, tutorial_id: str):
    db_tutorial: Tutorial = get_tutorial(db_session, tutorial_id)
    # subquery filters for all tutorial members belonging to the current course
    subquery_tutorial_members = (
        select(TutorialMembership.user_id).where(
            TutorialMembership.course_id == db_tutorial.course_id
        )
    ).subquery()

    print((db_session.execute(select(subquery_tutorial_members))).all())
    query = select(CourseEnrolment).where(
        CourseEnrolment.course_id == db_tutorial.course_id,
        CourseEnrolment.user_id.not_in(select(subquery_tutorial_members)),
    )

    db_enrollable_users = (db_session.execute(query)).scalars().all()

    return [candidate.user for candidate in db_enrollable_users]


def remove_tutorial_member(db_session: Session, user_id: str, tutorial_id: str):
    # # check if user is enrolled in parent tutorial
    # db_tutorial: Tutorial = get_tutorial(db_session, tutorial_id)
    # # verify_single_course_enrolment(db_session, user_id, db_tutorial.course_id)

    # db_user = get_user(db_session, user_id)
    # db_tutorial.member_remove_one(db_user)  # handles user already in userset
    # db_session.commit()

    query = (
        delete(TutorialMembership)
        .where(TutorialMembership.user_id == user_id)
        .where(TutorialMembership.tutorial_id == tutorial_id)
    )
    db_session.execute(query)
    db_session.commit()


def get_tutorial_assignments(db_session: Session, tutorial_id: str):
    db_tutorial: Tutorial = get_tutorial(db_session, tutorial_id)
    query = select(Assignment).where(Assignment.course_id == db_tutorial.course_id)

    return (db_session.execute(query)).scalars().all()


# async def create_tutorial(db_session: AsyncSession, tutorial_form: dict):
#     tutorial = Tutorial(**tutorial_form.model_dump())
#     try:
#         db_session.add(tutorial)
#         await db_session.commit()
#     except IntegrityError as exc:
#         await db_session.rollback()
#         raise HTTPException(
#             status_code=400,
#             detail=exc.orig.args[0],
#             # detail=f"Tutorial '{tutorial_form.name}' already exists for this course.",
#         ) from exc


# async def get_tutorials(db_session: AsyncSession, user_id: str, course_id: str):
#     query = select(Tutorial)
#     if user_id:
#         query = (
#             query.join(Tutorial.userset).join(UserSet.members).where(User.id == user_id)
#         )
#     if course_id:
#         query = query.where(Tutorial.course_id == course_id)

#     return (await db_session.scalars(query)).all()


# async def get_tutorial(db_session: AsyncSession, tutorial_id: str):
#     query = select(Tutorial).where(Tutorial.id == tutorial_id)
#     db_tutorial = (await db_session.scalars(query)).first()
#     if not db_tutorial:
#         raise HTTPException(status_code=404, detail="Tutorial not found")
#     return db_tutorial


# async def update_tutorial(
#     db_session: AsyncSession, tutorial_id: str, update_data: dict
# ):
#     db_tutorial = await get_tutorial(db_session, tutorial_id)
#     db_tutorial.update(update_data)
#     await db_session.commit()


# async def delete_tutorial(db_session: AsyncSession, tutorial_id: str):
#     query = delete(Tutorial).where(Tutorial.id == tutorial_id)
#     await db_session.execute(query)
#     await db_session.commit()
#     if await get_tutorial(db_session, tutorial_id):
#         raise HTTPException(status_code=500, detail="Tutorial not deleted")


# async def get_enrolled_tutorials(db_session: AsyncSession, user_id: str):
#     query = (
#         select(Tutorial)
#         .join(Tutorial.userset)
#         .join(UserSet.members)
#         .where(User.id == user_id)
#     )
#     return (await db_session.execute(query)).scalars().all()


# async def enrol_tutorial_member(
#     db_session: AsyncSession, user_id: str, tutorial_id: str
# ):
#     # check if user is enrolled in parent course
#     db_tutorial: Tutorial = await get_tutorial(db_session, tutorial_id)
#     # await verify_single_course_enrolment(db_session, user_id, db_tutorial.course_id)

#     db_user = await get_user(db_session, user_id)
#     db_tutorial.member_add_one(db_user)  # handles user already in userset
#     await db_session.commit()


# async def enrol_tutorial_members(
#     db_session: AsyncSession, user_ids: List[str], tutorial_id: str
# ):
#     # check if users are enrolled in parent course
#     db_tutorial: Tutorial = await get_tutorial(db_session, tutorial_id)
#     # await verify_multi_course_enrolment(db_session, user_ids, db_tutorial.course_id)

#     query = select(User).where(User.id.in_(user_ids))
#     db_users: List[User] = (await db_session.execute(query)).scalars().all()
#     db_tutorial.member_add_many(db_users)  # handles users already in userset
#     await db_session.commit()


# async def get_tutorial_enrolments(db_session: AsyncSession, tutorial_id: str):
#     db_tutorial = await get_tutorial(db_session, tutorial_id)
#     return db_tutorial.userset.members
