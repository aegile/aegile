from typing import List
from fastapi import HTTPException
from pprint import pprint
from sqlalchemy import select, delete, and_, distinct
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.user import User, UserSet
from src.models.project import Project
from src.models.task import Task, TaskLabel
from src.schemas.task import SchemaTaskCreation, SchemaTaskUpdate, SchemaTaskRead


def create_task(db_session: Session, task_form: SchemaTaskCreation):
    task: Task = Task(**task_form.model_dump())
    try:
        db_session.add(task)
        db_session.commit()
    except IntegrityError as exc:
        db_session.rollback()
        raise HTTPException(
            status_code=400,
            detail=exc.orig.args[0],
        ) from exc


def get_task_from_id(db_session: Session, task_id: str):
    query = select(Task).where(Task.id == task_id)
    db_task = (db_session.scalars(query)).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task


def get_tasks_with_filters(db_session: Session, project_id: str, assignee_id: str):
    query = select(Task)
    if project_id:
        query = query.where(Task.project_id == project_id)
    if assignee_id:
        query = query.where(Task.assignee_id == assignee_id)
    return (db_session.scalars(query)).all()


def update_task(db_session: Session, task_id: str, update_data: dict):
    db_task = get_task_from_id(db_session, task_id)
    # TODO - check if
    db_task.update(update_data)
    db_session.commit()


def delete_task(db_session: Session, task_id: str):
    query = delete(Task).where(Task.id == task_id)
    db_session.execute(query)
    db_session.commit()
    # if get_task_from_id(db_session, task_id):
    #     raise HTTPException(status_code=500, detail="Task not deleted")


def get_task_labels(db_session: Session, task_id: str):
    query = select(TaskLabel).where(TaskLabel.task_id == task_id)
    return (db_session.scalars(query)).all()


def get_available_labels(db_session: Session, project_id: str):
    query = select(distinct(TaskLabel.label)).where(TaskLabel.project_id == project_id)
    return (db_session.scalars(query)).all()
