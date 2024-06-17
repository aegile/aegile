import time

from fastapi import HTTPException
from sqlalchemy import select, delete
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.course import Course, CourseEnrolment
from .user import get_user


# async def create_course(db_session: AsyncSession, course_form: dict):
#     course = Course(**course_form.model_dump())
#     try:
#         db_session.add(course)
#         await db_session.commit()
#     except IntegrityError as exc:
#         await db_session.rollback()
#         raise HTTPException(status_code=400, detail=exc.orig.args[0]) from exc


# async def get_courses(db_session: AsyncSession):
#     query = select(Course)
#     return (await db_session.scalars(query)).all()


# async def get_course(db_session: AsyncSession, course_id: str):
#     query = select(Course).where(Course.id == course_id)
#     course = (await db_session.scalars(query)).first()
#     if not course:
#         raise HTTPException(status_code=404, detail="Course not found")
#     return course


# async def update_course(db_session: AsyncSession, course_id: str, update_data: dict):
#     query = select(Course).where(Course.id == course_id)
#     db_course = (await db_session.scalars(query)).first()
#     if not db_course:
#         raise HTTPException(status_code=404, detail="Course not found")
#     db_course.update(update_data)
#     await db_session.commit()


# async def delete_course(db_session: AsyncSession, course_id: str):
#     query = delete(Course).where(Course.id == course_id)
#     await db_session.execute(query)
#     await db_session.commit()
#     if await get_course(db_session, course_id):
#         raise HTTPException(status_code=500, detail="Course not deleted")


# async def get_enrolled_courses(db_session: AsyncSession, user_id: str):
#     query = select(CourseEnrolment).where(CourseEnrolment.user_id == user_id)
#     db_enrolments = (await db_session.scalars(query)).all()
#     return [enrolment.course for enrolment in db_enrolments]


# async def enrol_user_to_course(db_session: AsyncSession, user_id: str, course_id: str):
#     await get_course(db_session, course_id)  # check if course exists
#     await get_user(db_session, user_id)  # check if user exists
#     db_enrolment = CourseEnrolment(user_id=user_id, course_id=course_id)
#     # TODO - roles or default a role
#     try:
#         db_session.add(db_enrolment)
#         await db_session.commit()
#     except IntegrityError as exc:
#         await db_session.rollback()
#         raise HTTPException(status_code=400, detail="User already enrolled") from exc


# async def get_course_enrolments(db_session: AsyncSession, course_id: str):
#     query = select(CourseEnrolment).where(CourseEnrolment.course_id == course_id)
#     db_enrolments = (await db_session.scalars(query)).all()
#     return db_enrolments


def create_course(db_session: Session, course_form: dict):
    course = Course(**course_form.model_dump())
    try:
        db_session.add(course)
        db_session.commit()
    except IntegrityError as exc:
        db_session.rollback()
        raise HTTPException(status_code=400, detail=exc.orig.args[0]) from exc


def get_courses(db_session: Session):
    query = select(Course)
    return (db_session.scalars(query)).all()


def get_course(db_session: Session, course_id: str):
    query = select(Course).where(Course.id == course_id)
    course = (db_session.scalars(query)).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course


def update_course(db_session: Session, course_id: str, update_data: dict):
    query = select(Course).where(Course.id == course_id)
    db_course = (db_session.scalars(query)).first()
    if not db_course:
        raise HTTPException(status_code=404, detail="Course not found")
    db_course.update(update_data)
    db_session.commit()


def delete_course(db_session: Session, course_id: str):
    get_course(db_session, course_id)
    query = delete(Course).where(Course.id == course_id)
    db_session.execute(query)
    db_session.commit()
    # if get_course(db_session, course_id): # this function throws 404 because deleted
    #     raise HTTPException(status_code=500, detail="Course not deleted")


def get_enrolled_courses(db_session: Session, user_id: str):
    query = select(CourseEnrolment).where(CourseEnrolment.user_id == user_id)
    db_enrolments = (db_session.scalars(query)).all()
    return [enrolment.course for enrolment in db_enrolments]


def enrol_user_to_course(db_session: Session, user_id: str, course_id: str):
    get_course(db_session, course_id)  # check if course exists
    get_user(db_session, user_id)  # check if user exists
    db_enrolment = CourseEnrolment(user_id=user_id, course_id=course_id)
    # TODO - roles or default a role
    try:
        db_session.add(db_enrolment)
        db_session.commit()
    except IntegrityError as exc:
        db_session.rollback()
        raise HTTPException(status_code=400, detail="User already enrolled") from exc


def get_course_enrolments(db_session: Session, course_id: str):
    query = select(CourseEnrolment).where(CourseEnrolment.course_id == course_id)
    db_enrolments = (db_session.scalars(query)).all()
    return db_enrolments
