from typing import List
from fastapi import APIRouter, Depends
from src.api.dependencies.auth import validate_is_authenticated
from src.api.dependencies.core import DBSessionDep
from src.crud.tutorial import (
    create_tutorial,
    get_tutorials_by_course,
    get_tutorial,
    update_tutorial,
    delete_tutorial,
    get_enrolled_tutorials,
    enrol_user_to_tutorial,
    get_tutorial_enrolments,
)
from src.schemas.tutorial import TutorialBase, TutorialInfo
from src.schemas.user import UserInfo

router = APIRouter(
    prefix="/api/tutorials",
    tags=["tutorials"],
    responses={404: {"description": "Not found"}},
)


@router.get("/{course_id}", response_model=List[TutorialInfo])
async def get_all_tutorials_via_course(course_id: str, db_session: DBSessionDep):
    return await get_tutorials_by_course(db_session, course_id)


@router.get("/{tutorial_id}", response_model=TutorialInfo)
async def get_tutorial_via_id(tutorial_id: str, db_session: DBSessionDep):
    return await get_tutorial(db_session, tutorial_id)


@router.post("/{course_id}")
async def create_course_tutorial(
    course_id: str, tutorial: TutorialBase, db_session: DBSessionDep
):
    await create_tutorial(db_session, course_id, tutorial)
    return {"message": "Success!! Tutorial created."}


@router.put("/{tutorial_id}")
async def update_tutorial_via_id(
    tutorial_id: str, data: TutorialBase, db_session: DBSessionDep
):
    await update_tutorial(db_session, tutorial_id, data)
    return {"message": "Success!! Tutorial updated."}


@router.delete("/{tutorial_id}")
async def delete_tutorial_via_id(tutorial_id: str, db_session: DBSessionDep):
    await delete_tutorial(db_session, tutorial_id)
    return {"message": "Success!! Tutorial deleted."}


@router.get("/enrolments/{user_id}", response_model=List[TutorialInfo])
async def get_enrolled_tutorials_of_a_user(user_id: str, db_session: DBSessionDep):
    return await get_enrolled_tutorials(db_session, user_id)


@router.post("/{tutorial_id}/enrolments/{user_id}")
async def enrol_a_user_to_a_tutorial(
    tutorial_id: str, user_id: str, db_session: DBSessionDep
):
    await enrol_user_to_tutorial(db_session, user_id, tutorial_id)
    return {"message": "Success!! User enrolled to tutorial."}


@router.get("/{tutorial_id}/enrolments", response_model=List[UserInfo])
async def get_users_enrolled_in_tutorial(tutorial_id: str, db_session: DBSessionDep):
    return await get_tutorial_enrolments(db_session, tutorial_id)
