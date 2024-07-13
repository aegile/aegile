from typing import List
from fastapi import APIRouter, Depends
from src.api.dependencies.auth import validate_is_authenticated
from src.api.dependencies.core import DBSessionDep
from src.crud.course import (
    get_courses,
    get_course,
    create_course,
    update_course,
    delete_course,
    get_enrolled_courses,
    enrol_user_to_course,
    update_user_enrolment,
    get_course_participants,
    remove_user_from_course,
    get_course_enrollable_users,
)
from src.schemas.course import CourseBase, CourseInfo
from src.schemas.user import UserInfo
from src.schemas.membership import CourseMembership, CourseMembershipUpdate

router = APIRouter(
    prefix="/api/courses",
    tags=["courses"],
    responses={404: {"description": "Not found"}},
)


# @router.get("", response_model=List[CourseInfo])
# async def get_all_courses(db_session: DBSessionDep):
#     return await get_courses(db_session)


# @router.get("/{course_id}", response_model=CourseInfo)
# async def get_course_via_id(course_id: str, db_session: DBSessionDep):
#     return await get_course(db_session, course_id)


# @router.post("")
# async def create_courses(course: CourseBase, db_session: DBSessionDep):
#     await create_course(db_session, course)
#     return {"message": "Success!! Course created."}


# @router.put("/{course_id}")
# async def update_course_via_id(
#     course_id: str, data: CourseBase, db_session: DBSessionDep
# ):
#     await update_course(db_session, course_id, data)
#     return {"message": "Success!! Course updated."}


# @router.delete("/{course_id}")
# async def delete_course_via_id(course_id: str, db_session: DBSessionDep):
#     await delete_course(db_session, course_id)
#     return {"message": "Success!! Course deleted."}


# # @router.get("/enrolments/{user_id}", response_model=List[CourseInfo])
# # async def get_enrolled_courses_of_a_user(user_id: str, db_session: DBSessionDep):
# #     return await get_enrolled_courses(db_session, user_id)


# @router.post("/{course_id}/enrolments/{user_id}")
# async def enrol_a_user_to_a_course(
#     course_id: str, user_id: str, db_session: DBSessionDep
# ):
#     await enrol_user_to_course(db_session, user_id, course_id)
#     return {"message": "Success!! User has been enrolled."}


@router.get("", response_model=List[CourseInfo])
def get_all_courses(db_session: DBSessionDep):
    return get_courses(db_session)


@router.get("/{course_id}", response_model=CourseInfo)
def get_course_via_id(course_id: str, db_session: DBSessionDep):
    return get_course(db_session, course_id)


@router.post("")
def create_courses(course: CourseBase, db_session: DBSessionDep):
    create_course(db_session, course)
    return {"message": "Success!! Course created."}


@router.put("/{course_id}")
def update_course_via_id(course_id: str, data: CourseBase, db_session: DBSessionDep):
    update_course(db_session, course_id, data)
    return {"message": "Success!! Course updated."}


@router.delete("/{course_id}")
def delete_course_via_id(course_id: str, db_session: DBSessionDep):
    delete_course(db_session, course_id)
    return {"message": "Success!! Course deleted."}


# @router.get("/enrolments/{user_id}", response_model=List[CourseInfo])
# def get_enrolled_courses_of_a_user(user_id: str, db_session: DBSessionDep):
#     return get_enrolled_courses(db_session, user_id)


@router.get("/{course_id}/enrollable", response_model=List[UserInfo])
def get_list_of_enrollable_users_not_in_given_course(
    course_id: str, db_session: DBSessionDep
):
    return get_course_enrollable_users(db_session, course_id)


@router.get("/{course_id}/enrolments", response_model=List[CourseMembership])
def get_all_course_participants(course_id: str, db_session: DBSessionDep):
    return get_course_participants(db_session, course_id)


@router.post("/{course_id}/enrolments/{user_id}")
def enrol_a_user_to_a_course(course_id: str, user_id: str, db_session: DBSessionDep):
    enrol_user_to_course(db_session, user_id, course_id)
    return {"message": "Success!! User has been enrolled."}


@router.put("/{course_id}/enrolments/{user_id}")
def update_a_user_enrolment(
    course_id: str, user_id: str, data: CourseMembershipUpdate, db_session: DBSessionDep
):
    update_user_enrolment(db_session, user_id, course_id, data)
    return {"message": "Success!! User enrolment updated."}


@router.delete("/{course_id}/enrolments/{user_id}")
def remove_a_user_from_a_course(course_id: str, user_id: str, db_session: DBSessionDep):
    remove_user_from_course(db_session, user_id, course_id)
    return {"message": "Success!! User has been enrolled."}
