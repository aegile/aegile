from typing import List
from fastapi import HTTPException
from sqlalchemy import select, delete
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.user import User
from src.models.project import Project
from src.schemas.project import ProjectBase
from .user import get_user


async def create_project(db_session: AsyncSession, project_form: ProjectBase):
    # TODO - must check that assignment.course_id === tutorial.course_id
    project = Project(**project_form.model_dump())
    try:
        db_session.add(project)
        await db_session.commit()
    except IntegrityError as exc:
        await db_session.rollback()
        raise HTTPException(
            status_code=400,
            detail=exc.orig.args[0],
            # detail=f"Project '{project_form.name}' already exists for this tutorial.",
        ) from exc


async def get_projects_by_tutorial(db_session: AsyncSession, tutorial_id: str):
    query = select(Project).where(Project.tutorial_id == tutorial_id)
    return (await db_session.scalars(query)).all()


async def get_projects_by_assignment(db_session: AsyncSession, assignment_id: str):
    query = select(Project).where(Project.assignment_id == assignment_id)
    return (await db_session.scalars(query)).all()


async def get_project(db_session: AsyncSession, project_id: str):
    query = select(Project).where(Project.id == project_id)
    project = (await db_session.scalars(query)).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


async def update_project(db_session: AsyncSession, project_id: str, update_data: dict):
    project = await get_project(db_session, project_id)
    project.update(update_data)
    await db_session.commit()


async def delete_project(db_session: AsyncSession, project_id: str):
    query = delete(Project).where(Project.id == project_id)
    await db_session.execute(query)
    await db_session.commit()
    if await get_project(db_session, project_id):
        raise HTTPException(status_code=500, detail="Project not deleted")


async def get_enrolled_projects(db_session: AsyncSession, user_id: str):
    db_user = get_user(db_session, user_id)
    query = select(Project).where(db_user in Project.userset.members)
    return (await db_session.scalars(query)).all()


async def enrol_user_to_project(
    db_session: AsyncSession,
    user_id: str,
    project_id: str,
):
    db_project = await get_project(db_session, project_id)
    db_user = await get_user(db_session, user_id)
    db_project.member_add_one(db_user)
    await db_session.commit()


async def enrol_users_to_project(
    db_session: AsyncSession, user_ids: List[str], project_id: str
):
    db_project = await get_project(db_session, project_id)
    query = select(User).where(User.id.in_(user_ids))
    db_users = (await db_session.scalars(query)).all()
    db_project.member_add_many(db_users)
    await db_session.commit()
