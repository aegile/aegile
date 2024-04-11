from fastapi import HTTPException
from sqlalchemy import select, delete
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.project import Project
from src.models.deliverable import Deliverable, DeliverableSubmission
from src.schemas.deliverable import DeliverableBase, SubmissionBase
from .util import fetch_one


def create_deliverable(db_session: Session, deliverable_form: DeliverableBase):
    deliverable = Deliverable(**deliverable_form.model_dump())
    try:
        db_session.add(deliverable)
        db_session.commit()
    except IntegrityError as exc:
        db_session.rollback()
        raise HTTPException(status_code=400, detail=exc.orig.args[0]) from exc
        # detail=f"Deliverable '{deliverable_form.name}' already exists for this assignment.",


def get_deliverable(db_session: Session, deliverable_id: str):
    return fetch_one(db_session, Deliverable, deliverable_id)


def get_deliverables(db_session: Session, assignment_id: str):
    query = select(Deliverable)
    if assignment_id:
        query = query.where(Deliverable.assignment_id == assignment_id)
    return (db_session.scalars(query)).all()


def update_deliverable(db_session: Session, deliverable_id: str, update_data: dict):
    db_deliverable = fetch_one(db_session, Deliverable, deliverable_id)
    db_deliverable.update(update_data)
    db_session.commit()


def delete_deliverable(db_session: Session, deliverable_id: str):
    query = delete(Deliverable).where(Deliverable.id == deliverable_id)
    db_session.execute(query)
    db_session.commit()
    if fetch_one(db_session, Deliverable, deliverable_id):
        raise HTTPException(status_code=500, detail="Failed to delete deliverable")


# =============================================================================
#                           Deliverable Submissions
# =============================================================================


def create_submission(
    db_session: Session,
    deliverable_id: str,
    project_id: str,
    submission_form: SubmissionBase,
):
    db_deliverable = fetch_one(db_session, Deliverable, deliverable_id)
    db_project = fetch_one(db_session, Project, project_id)

    # check that deliverable_id and project_id both belong to the same assignment
    if db_deliverable.assignment_id != db_project.assignment_id:
        raise HTTPException(
            status_code=400,
            detail="Deliverable and project do not belong to the same assignment",
        )

    # check that the submission time is before the deliverable deadline
    if submission_form.submission_time > db_deliverable.deadline:
        raise HTTPException(
            status_code=400,
            detail="Submission time is after the deliverable deadline",
        )

    submission = DeliverableSubmission(
        deliverable_id=deliverable_id,
        project_id=project_id,
        **submission_form.model_dump()
    )
    try:
        db_session.add(submission)
        db_session.commit()
    except IntegrityError as exc:
        db_session.rollback()
        raise HTTPException(status_code=400, detail=exc.orig.args[0]) from exc
        # detail=f"Submission for deliverable '{submission_form.deliverable_id}' already exists.",


def get_submission(db_session: Session, deliverable_id: str, project_id: str):
    query = (
        select(DeliverableSubmission)
        .where(DeliverableSubmission.deliverable_id == deliverable_id)
        .where(DeliverableSubmission.project_id == project_id)
    )
    submission = (db_session.scalars(query)).first()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    return submission


def get_submissions(db_session: Session, deliverable_id: str):
    query = select(DeliverableSubmission).where(
        DeliverableSubmission.deliverable_id == deliverable_id
    )
    return (db_session.scalars(query)).all()


def update_submission(
    db_session: Session,
    deliverable_id: str,
    project_id: str,
    update_data: SubmissionBase,
):
    db_submission = get_submission(db_session, deliverable_id, project_id)
    db_submission.update(update_data)
    db_session.commit()


def delete_submission(db_session: Session, deliverable_id: str, project_id: str):
    query = (
        delete(DeliverableSubmission)
        .where(DeliverableSubmission.deliverable_id == deliverable_id)
        .where(DeliverableSubmission.project_id == project_id)
    )
    db_session.execute(query)
    db_session.commit()
    if get_submission(db_session, deliverable_id, project_id):
        raise HTTPException(status_code=500, detail="Failed to delete submission")


# async def create_deliverable(
#     db_session: AsyncSession, deliverable_form: DeliverableBase
# ):
#     deliverable = Deliverable(**deliverable_form.model_dump())
#     try:
#         db_session.add(deliverable)
#         await db_session.commit()
#     except IntegrityError as exc:
#         await db_session.rollback()
#         raise HTTPException(status_code=400, detail=exc.orig.args[0]) from exc
#         # detail=f"Deliverable '{deliverable_form.name}' already exists for this assignment.",


# async def get_deliverable(db_session: AsyncSession, deliverable_id: str):
#     return await fetch_one(db_session, Deliverable, deliverable_id)


# async def get_deliverables(db_session: AsyncSession, assignment_id: str):
#     query = select(Deliverable)
#     if assignment_id:
#         query = query.where(Deliverable.assignment_id == assignment_id)
#     return (await db_session.scalars(query)).all()


# async def update_deliverable(
#     db_session: AsyncSession, deliverable_id: str, update_data: dict
# ):
#     db_deliverable = await fetch_one(db_session, Deliverable, deliverable_id)
#     db_deliverable.update(update_data)
#     await db_session.commit()


# async def delete_deliverable(db_session: AsyncSession, deliverable_id: str):
#     query = delete(Deliverable).where(Deliverable.id == deliverable_id)
#     await db_session.execute(query)
#     await db_session.commit()
#     if await fetch_one(db_session, Deliverable, deliverable_id):
#         raise HTTPException(status_code=500, detail="Failed to delete deliverable")


# # =============================================================================
# #                           Deliverable Submissions
# # =============================================================================


# async def create_submission(
#     db_session: AsyncSession,
#     deliverable_id: str,
#     project_id: str,
#     submission_form: SubmissionBase,
# ):
#     db_deliverable = await fetch_one(db_session, Deliverable, deliverable_id)
#     db_project = await fetch_one(db_session, Project, project_id)

#     # check that deliverable_id and project_id both belong to the same assignment
#     if db_deliverable.assignment_id != db_project.assignment_id:
#         raise HTTPException(
#             status_code=400,
#             detail="Deliverable and project do not belong to the same assignment",
#         )

#     # check that the submission time is before the deliverable deadline
#     if submission_form.submission_time > db_deliverable.deadline:
#         raise HTTPException(
#             status_code=400,
#             detail="Submission time is after the deliverable deadline",
#         )

#     submission = DeliverableSubmission(
#         deliverable_id=deliverable_id,
#         project_id=project_id,
#         **submission_form.model_dump()
#     )
#     try:
#         db_session.add(submission)
#         await db_session.commit()
#     except IntegrityError as exc:
#         await db_session.rollback()
#         raise HTTPException(status_code=400, detail=exc.orig.args[0]) from exc
#         # detail=f"Submission for deliverable '{submission_form.deliverable_id}' already exists.",


# async def get_submission(
#     db_session: AsyncSession, deliverable_id: str, project_id: str
# ):
#     query = (
#         select(DeliverableSubmission)
#         .where(DeliverableSubmission.deliverable_id == deliverable_id)
#         .where(DeliverableSubmission.project_id == project_id)
#     )
#     submission = (await db_session.scalars(query)).first()
#     if not submission:
#         raise HTTPException(status_code=404, detail="Submission not found")
#     return submission


# async def get_submissions(db_session: AsyncSession, deliverable_id: str):
#     query = select(DeliverableSubmission).where(
#         DeliverableSubmission.deliverable_id == deliverable_id
#     )
#     return (await db_session.scalars(query)).all()


# async def update_submission(
#     db_session: AsyncSession,
#     deliverable_id: str,
#     project_id: str,
#     update_data: SubmissionBase,
# ):
#     db_submission = await get_submission(db_session, deliverable_id, project_id)
#     db_submission.update(update_data)
#     await db_session.commit()


# async def delete_submission(
#     db_session: AsyncSession, deliverable_id: str, project_id: str
# ):
#     query = (
#         delete(DeliverableSubmission)
#         .where(DeliverableSubmission.deliverable_id == deliverable_id)
#         .where(DeliverableSubmission.project_id == project_id)
#     )
#     await db_session.execute(query)
#     await db_session.commit()
#     if await get_submission(db_session, deliverable_id, project_id):
#         raise HTTPException(status_code=500, detail="Failed to delete submission")
