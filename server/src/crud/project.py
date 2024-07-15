from typing import List
from fastapi import HTTPException
from pprint import pprint
from sqlalchemy import select, delete, and_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.user import User, UserSet
from src.models.project import Project
from src.models.membership import TutorialProjectMembership, ProjectMembership
from src.schemas.project import ProjectBase
from .user import get_user


def create_project(db_session: Session, project_form: ProjectBase):
    # TODO - must check that assignment.course_id === tutorial.course_id
    project: Project = Project(**project_form.model_dump())
    try:
        db_session.add(project)
        db_session.commit()
        return project.id
    except IntegrityError as exc:
        db_session.rollback()
        raise HTTPException(
            status_code=400,
            detail=exc.orig.args[0],
            # detail=f"Project '{project_form.name}' already exists for this tutorial.",
        ) from exc


def get_projects(
    db_session: Session, user_id: str, tutorial_id: str, assignment_id: str
):
    query = select(Project)
    if user_id:
        query = query.where(Project.members.any(User.id == user_id))
    if tutorial_id:
        query = query.where(Project.tutorial_id == tutorial_id)
    if assignment_id:
        query = query.where(Project.assignment_id == assignment_id)
    db_projects = (db_session.scalars(query)).all()
    return db_projects


def get_projects_by_assignment(db_session: Session, assignment_id: str):
    query = select(Project).where(Project.assignment_id == assignment_id)
    return (db_session.scalars(query)).all()


def get_project(db_session: Session, project_id: str):
    query = select(Project).where(Project.id == project_id)
    project = (db_session.scalars(query)).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


def update_project(db_session: Session, project_id: str, update_data: dict):
    project = get_project(db_session, project_id)
    project.update(update_data)
    db_session.commit()


def delete_project(db_session: Session, project_id: str):
    query = delete(Project).where(Project.id == project_id)
    db_session.execute(query)
    db_session.commit()
    if get_project(db_session, project_id):
        raise HTTPException(status_code=500, detail="Project not deleted")


def get_enrolled_projects(db_session: Session, user_id: str):
    db_user = get_user(db_session, user_id)
    query = select(Project).where(db_user in Project.members)
    return (db_session.scalars(query)).all()


def enrol_user_to_project(db_session: Session, user_id: str, project_id: str):
    db_project = get_project(db_session, project_id)
    db_user = get_user(db_session, user_id)
    db_tut_project_membership = ProjectMembership(
        user_id=user_id, project_id=project_id, assignment_id=db_project.assignment_id
    )
    db_session.add(db_tut_project_membership)
    # db_project.member_add_one(db_user)
    db_session.commit()


def enrol_users_to_project(db_session: Session, user_ids: List[str], project_id: str):
    db_project = get_project(db_session, project_id)
    for user_id in user_ids:
        # unassign users from their existing project if so,
        # ProjectMembership(user_id, assignment_id, project_id)

        # delete memberships of each user for that one assignment
        # I don't believe they should have multiple?

        query = delete(ProjectMembership).where(
            and_(
                ProjectMembership.user_id == user_id,
                ProjectMembership.assignment_id == db_project.assignment_id,
            )
        )
        db_session.execute(query)

        db_tut_project_membership = ProjectMembership(
            user_id=user_id,
            project_id=project_id,
            assignment_id=db_project.assignment_id,
        )
        db_session.add(db_tut_project_membership)

    # db_project = get_project(db_session, project_id)
    # query = select(User).where(User.id.in_(user_ids))
    # db_users = (db_session.scalars(query)).all()
    # db_project.member_add_many(db_users)
    db_session.commit()


# async def create_project(db_session: AsyncSession, project_form: ProjectBase):
#     # TODO - must check that assignment.course_id === tutorial.course_id
#     project = Project(**project_form.model_dump())
#     try:
#         db_session.add(project)
#         await db_session.commit()
#     except IntegrityError as exc:
#         await db_session.rollback()
#         raise HTTPException(
#             status_code=400,
#             detail=exc.orig.args[0],
#             # detail=f"Project '{project_form.name}' already exists for this tutorial.",
#         ) from exc


# async def get_projects_by_tutorial(db_session: AsyncSession, tutorial_id: str):
#     query = select(Project).where(Project.tutorial_id == tutorial_id)
#     return (await db_session.scalars(query)).all()


# async def get_projects_by_assignment(db_session: AsyncSession, assignment_id: str):
#     query = select(Project).where(Project.assignment_id == assignment_id)
#     return (await db_session.scalars(query)).all()


# async def get_project(db_session: AsyncSession, project_id: str):
#     query = select(Project).where(Project.id == project_id)
#     project = (await db_session.scalars(query)).first()
#     if not project:
#         raise HTTPException(status_code=404, detail="Project not found")
#     return project


# async def update_project(db_session: AsyncSession, project_id: str, update_data: dict):
#     project = await get_project(db_session, project_id)
#     project.update(update_data)
#     await db_session.commit()


# async def delete_project(db_session: AsyncSession, project_id: str):
#     query = delete(Project).where(Project.id == project_id)
#     await db_session.execute(query)
#     await db_session.commit()
#     if await get_project(db_session, project_id):
#         raise HTTPException(status_code=500, detail="Project not deleted")


# async def get_enrolled_projects(db_session: AsyncSession, user_id: str):
#     db_user = get_user(db_session, user_id)
#     query = select(Project).where(db_user in Project.userset.members)
#     return (await db_session.scalars(query)).all()


# async def enrol_user_to_project(
#     db_session: AsyncSession,
#     user_id: str,
#     project_id: str,
# ):
#     db_project = await get_project(db_session, project_id)
#     db_user = await get_user(db_session, user_id)
#     db_project.member_add_one(db_user)
#     await db_session.commit()


# async def enrol_users_to_project(
#     db_session: AsyncSession, user_ids: List[str], project_id: str
# ):
#     db_project = await get_project(db_session, project_id)
#     query = select(User).where(User.id.in_(user_ids))
#     db_users = (await db_session.scalars(query)).all()
#     db_project.member_add_many(db_users)
#     await db_session.commit()
