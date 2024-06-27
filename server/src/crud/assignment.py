from fastapi import HTTPException
from sqlalchemy import select, delete
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.assignment import Assignment


def create_assignment(db_session: Session, assignment_form: dict):
    db_assignment = Assignment(**assignment_form.model_dump())
    try:
        db_session.add(db_assignment)
        db_session.commit()
    except IntegrityError as exc:
        db_session.rollback()
        raise HTTPException(
            status_code=400,
            detail=exc.orig.args[0]
            # detail=f"Assignment '{assignment_form.name}' already exists for this course.",
        ) from exc


def get_assignments_with_filter(
    db_session: Session, course_id: str, deadline: str, status: str
):
    query = select(Assignment)
    if course_id:
        query = query.where(Assignment.course_id == course_id)
    return (db_session.scalars(query)).all()


def get_assignments_by_course(db_session: Session, course_id: str):
    query = select(Assignment).where(Assignment.course_id == course_id)
    return (db_session.scalars(query)).all()


def get_assignment(db_session: Session, assignment_id: str):
    query = select(Assignment).where(Assignment.id == assignment_id)
    assignment = (db_session.scalars(query)).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")
    return assignment


def update_assignment(db_session: Session, assignment_id: str, update_data: dict):
    assignment = get_assignment(db_session, assignment_id)
    assignment.update(update_data)
    db_session.commit()


def delete_assignment(db_session: Session, assignment_id: str):
    query = delete(Assignment).where(Assignment.id == assignment_id)
    db_session.execute(query)
    db_session.commit()
    if get_assignment(db_session, assignment_id):
        raise HTTPException(status_code=500, detail="Assignment not deleted")


# async def create_assignment(db_session: AsyncSession, assignment_form: dict):
#     db_assignment = Assignment(**assignment_form.model_dump())
#     try:
#         db_session.add(db_assignment)
#         await db_session.commit()
#     except IntegrityError as exc:
#         await db_session.rollback()
#         raise HTTPException(
#             status_code=400,
#             detail=exc.orig.args[0]
#             # detail=f"Assignment '{assignment_form.name}' already exists for this course.",
#         ) from exc


# async def get_assignments_by_course(db_session: AsyncSession, course_id: str):
#     query = select(Assignment).where(Assignment.course_id == course_id)
#     return (await db_session.scalars(query)).all()


# async def get_assignment(db_session: AsyncSession, assignment_id: str):
#     query = select(Assignment).where(Assignment.id == assignment_id)
#     assignment = (await db_session.scalars(query)).first()
#     if not assignment:
#         raise HTTPException(status_code=404, detail="Assignment not found")
#     return assignment


# async def update_assignment(
#     db_session: AsyncSession, assignment_id: str, update_data: dict
# ):
#     assignment = await get_assignment(db_session, assignment_id)
#     assignment.update(update_data)
#     await db_session.commit()


# async def delete_assignment(db_session: AsyncSession, assignment_id: str):
#     query = delete(Assignment).where(Assignment.id == assignment_id)
#     await db_session.execute(query)
#     await db_session.commit()
#     if await get_assignment(db_session, assignment_id):
#         raise HTTPException(status_code=500, detail="Assignment not deleted")
