from typing import List, Optional
from fastapi import APIRouter, Depends
from src.api.dependencies.auth import validate_is_authenticated
from src.api.dependencies.core import DBSessionDep
from src.crud.task import (
    create_task,
    get_task_from_id,
    get_tasks_with_filters,
    update_task,
    delete_task,
)

from src.schemas.task import SchemaTaskCreation, SchemaTaskUpdate, SchemaTaskRead
from src.schemas.user import UserInfo, UserEnrol

router = APIRouter(
    prefix="/api/tasks",
    tags=["tasks"],
    responses={404: {"description": "Not found"}},
)


@router.post("")
def create_a_task_within_a_project(
    db_session: DBSessionDep, task_form: SchemaTaskCreation
):
    create_task(db_session, task_form)
    return {"message": "Success!! Task created."}


@router.get("", response_model=List[SchemaTaskRead])
def get_all_tasks_with_filters(
    db_session: DBSessionDep,
    project_id: Optional[str] = None,
    assignee_id: Optional[str] = None,
):
    return get_tasks_with_filters(db_session, project_id, assignee_id)


@router.get("/{task_id}", response_model=SchemaTaskRead)
def get_project_via_id(db_session: DBSessionDep, task_id: str):
    return get_task_from_id(db_session, task_id)


@router.put("/{task_id}")
def update_task_via_id(
    db_session: DBSessionDep, task_id: str, update_data: SchemaTaskUpdate
):
    update_task(db_session, task_id, update_data)
    return {"message": "Success!! Task updated."}


@router.delete("/{task_id}")
def delete_task_via_id(db_session: DBSessionDep, task_id: str):
    delete_task(db_session, task_id)
    return {"message": "Success!! Task deleted."}
