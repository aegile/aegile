from typing import List, Optional
from fastapi import APIRouter, Depends
from src.api.dependencies.auth import validate_is_authenticated
from src.api.dependencies.core import DBSessionDep
from src.crud.tutorial import (
    create_tutorial,
    get_tutorials,
    get_tutorial,
    update_tutorial,
    delete_tutorial,
    get_enrolled_tutorials,
    enrol_tutorial_members,
    enrol_tutorial_member,
    get_tutorial_members,
    get_tutorial_enrollable,
    remove_tutorial_member,
    get_tutorial_assignments,
)
from src.schemas.tutorial import TutorialBase, TutorialInfo
from src.schemas.user import UserInfo, UserEnrol
from src.schemas.membership import TutorialProjectMembership
from src.schemas.assignment import AssignmentSelector

router = APIRouter(
    prefix="/api/tutorials",
    tags=["tutorials"],
    responses={404: {"description": "Not found"}},
)


@router.post("")
def create_course_tutorial(tutorial: TutorialBase, db_session: DBSessionDep):
    create_tutorial(db_session, tutorial)
    return {"message": "Success!! Tutorial created."}


@router.get("", response_model=List[TutorialInfo])
def get_all_tutorials_with_filter(
    db_session: DBSessionDep,
    user_id: Optional[str] = None,
    course_id: Optional[str] = None,
):
    return get_tutorials(db_session, user_id, course_id)


# @router.get("/{course_id}", response_model=List[TutorialInfo])
# def get_all_tutorials_via_course(course_id: str, db_session: DBSessionDep):
#     return get_tutorials_by_course(db_session, course_id)


@router.get("/{tutorial_id}", response_model=TutorialInfo)
def get_tutorial_via_id(tutorial_id: str, db_session: DBSessionDep):
    return get_tutorial(db_session, tutorial_id)


@router.put("/{tutorial_id}")
def update_tutorial_via_id(
    tutorial_id: str, data: TutorialBase, db_session: DBSessionDep
):
    update_tutorial(db_session, tutorial_id, data)
    return {"message": "Success!! Tutorial updated."}


@router.delete("/{tutorial_id}")
def delete_tutorial_via_id(tutorial_id: str, db_session: DBSessionDep):
    delete_tutorial(db_session, tutorial_id)
    return {"message": "Success!! Tutorial deleted."}


# @router.get("/enrolments/{user_id}", response_model=List[TutorialInfo])
# def get_enrolled_tutorials_of_a_user(user_id: str, db_session: DBSessionDep):
#     return get_enrolled_tutorials(db_session, user_id)


@router.post("/{tutorial_id}/members/{user_id}")
def enrol_a_single_user_to_a_given_tutorial(
    tutorial_id: str, user_id: str, db_session: DBSessionDep
):
    enrol_tutorial_member(db_session, user_id, tutorial_id)
    return {"message": "Success!! Users enrolled to tutorial."}


@router.post("/{tutorial_id}/members")
def enrol_users_to_tutorial(
    tutorial_id: str, user_ids: UserEnrol, db_session: DBSessionDep
):
    enrol_tutorial_members(db_session, user_ids.user_ids, tutorial_id)
    return {"message": "Success!! Users enrolled to tutorial."}


@router.get("/{tutorial_id}/members", response_model=List[TutorialProjectMembership])
def get_all_members_of_a_given_tutorial(
    db_session: DBSessionDep,
    tutorial_id: str,
    assignment_id: Optional[str] = None,
):
    return get_tutorial_members(db_session, tutorial_id, assignment_id)


@router.get("/{tutorial_id}/enrollable", response_model=List[UserInfo])
def get_all_users_not_enrolled_in_a_given_tutorial(
    tutorial_id: str, db_session: DBSessionDep
):
    return get_tutorial_enrollable(db_session, tutorial_id)


@router.delete("/{tutorial_id}/members/{user_id}")
def remove_a_single_user_from_a_given_tutorial(
    tutorial_id: str, user_id: str, db_session: DBSessionDep
):
    remove_tutorial_member(db_session, user_id, tutorial_id)
    return {"message": "Success!! User removed from tutorial."}


@router.get("/{tutorial_id}/assignments", response_model=List[AssignmentSelector])
def get_all_assignments_of_a_given_tutorial(tutorial_id: str, db_session: DBSessionDep):
    return get_tutorial_assignments(db_session, tutorial_id)


# @router.post("")
# async def create_course_tutorial(tutorial: TutorialBase, db_session: DBSessionDep):
#     await create_tutorial(db_session, tutorial)
#     return {"message": "Success!! Tutorial created."}


# @router.get("", response_model=List[TutorialInfo])
# async def get_all_tutorials_with_filter(
#     db_session: DBSessionDep,
#     user_id: Optional[str] = None,
#     course_id: Optional[str] = None,
# ):
#     return await get_tutorials(db_session, user_id, course_id)


# # @router.get("/{course_id}", response_model=List[TutorialInfo])
# # async def get_all_tutorials_via_course(course_id: str, db_session: DBSessionDep):
# #     return await get_tutorials_by_course(db_session, course_id)


# @router.get("/{tutorial_id}", response_model=TutorialInfo)
# async def get_tutorial_via_id(tutorial_id: str, db_session: DBSessionDep):
#     return await get_tutorial(db_session, tutorial_id)


# @router.put("/{tutorial_id}")
# async def update_tutorial_via_id(
#     tutorial_id: str, data: TutorialBase, db_session: DBSessionDep
# ):
#     await update_tutorial(db_session, tutorial_id, data)
#     return {"message": "Success!! Tutorial updated."}


# @router.delete("/{tutorial_id}")
# async def delete_tutorial_via_id(tutorial_id: str, db_session: DBSessionDep):
#     await delete_tutorial(db_session, tutorial_id)
#     return {"message": "Success!! Tutorial deleted."}


# # @router.get("/enrolments/{user_id}", response_model=List[TutorialInfo])
# # async def get_enrolled_tutorials_of_a_user(user_id: str, db_session: DBSessionDep):
# #     return await get_enrolled_tutorials(db_session, user_id)


# @router.post("/{tutorial_id}/enrolments")
# async def enrol_users_to_tutorial(
#     tutorial_id: str, user_ids: UserEnrol, db_session: DBSessionDep
# ):
#     await enrol_tutorial_members(db_session, user_ids.user_ids, tutorial_id)
#     return {"message": "Success!! Users enrolled to tutorial."}


# @router.get("/{tutorial_id}/enrolments", response_model=List[UserInfo])
# async def get_users_enrolled_in_tutorial(tutorial_id: str, db_session: DBSessionDep):
#     return await get_tutorial_enrolments(db_session, tutorial_id)
