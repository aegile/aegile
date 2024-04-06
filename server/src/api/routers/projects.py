from typing import List
from fastapi import APIRouter, Depends
from src.api.dependencies.auth import validate_is_authenticated
from src.api.dependencies.core import DBSessionDep
from src.crud.project import (
    create_project,
    get_projects_by_tutorial,
    get_projects_by_assignment,
    get_project,
    update_project,
    delete_project,
    get_enrolled_projects,
    enrol_user_to_project,
    enrol_users_to_project,
)

from src.schemas.project import ProjectBase, ProjectInfo
from src.schemas.user import UserInfo, UserEnrol

router = APIRouter(
    prefix="/api/projects",
    tags=["projects"],
    responses={404: {"description": "Not found"}},
)


@router.post("")
async def create_project_for_assignment_in_tutorial(
    project: ProjectBase, db_session: DBSessionDep
):
    await create_project(db_session, project)
    return {"message": "Success!! Project created."}


# @router.get("/{tutorial_id}", response_model=List[ProjectInfo])
# async def get_all_projects_via_tutorial(tutorial_id: str, db_session: DBSessionDep):
#     return await get_projects_by_tutorial(db_session, tutorial_id)


@router.get("/{project_id}", response_model=ProjectInfo)
async def get_project_via_id(project_id: str, db_session: DBSessionDep):
    return await get_project(db_session, project_id)


@router.get("/enrolments/{user_id}", response_model=List[ProjectInfo])
async def get_enrolled_projects_of_a_user(user_id: str, db_session: DBSessionDep):
    return await get_enrolled_projects(db_session, user_id)


@router.post("/{project_id}/enrolments/{user_id}")
async def enrol_a_user_to_a_project(
    project_id: str, user_id: str, db_session: DBSessionDep
):
    await enrol_user_to_project(db_session, user_id, project_id)
    return {"message": "Success!! User enrolled to the project."}


@router.post("/{project_id}/enrolments")
async def enrol_multiple_users_to_a_project(
    project_id: str, user_ids: UserEnrol, db_session: DBSessionDep
):
    await enrol_users_to_project(db_session, user_ids.user_ids, project_id)
    return {"message": "Success!! Users enrolled to the project."}


@router.put("/{project_id}")
async def update_project_via_id(
    project_id: str, update_data: dict, db_session: DBSessionDep
):
    await update_project(db_session, project_id, update_data)
    return {"message": "Success!! Project updated."}


@router.delete("/{project_id}")
async def delete_project_via_id(project_id: str, db_session: DBSessionDep):
    await delete_project(db_session, project_id)
    return {"message": "Success!! Project deleted."}


# @router.get("/assignments/{assignment_id}", response_model=List[ProjectInfo])
# async def get_all_projects_via_assignment(assignment_id: str, db_session: DBSessionDep):
#     return await get_projects_by_assignment(db_session, assignment_id)
