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
)
from src.schemas.course import CourseBase, CourseInfo

router = APIRouter(
    prefix="/api/courses",
    tags=["courses"],
    responses={404: {"description": "Not found"}},
)


@router.get("", response_model=List[CourseInfo])
async def get_all_courses(db_session: DBSessionDep):
    return await get_courses(db_session)


@router.get("/{course_id}", response_model=CourseInfo)
async def get_course_via_id(course_id: str, db_session: DBSessionDep):
    return await get_course(db_session, course_id)


@router.post("")
async def create_courses(course: CourseBase, db_session: DBSessionDep):
    await create_course(db_session, course)
    return {"message": "Success!! Course created."}


@router.put("/{course_id}")
async def update_course_via_id(
    course_id: str, data: CourseBase, db_session: DBSessionDep
):
    await update_course(db_session, course_id, data)
    return {"message": "Success!! Course updated."}


@router.delete("/{course_id}")
async def delete_course_via_id(course_id: str, db_session: DBSessionDep):
    await delete_course(db_session, course_id)
    return {"message": "Success!! Course deleted."}


@router.get("/enrolments/{user_id}", response_model=List[CourseInfo])
async def get_enrolled_courses_of_a_user(user_id: str, db_session: DBSessionDep):
    return await get_enrolled_courses(db_session, user_id)


@router.post("/{course_id}/enrolments/{user_id}")
async def enrol_a_user_to_a_course(
    course_id: str, user_id: str, db_session: DBSessionDep
):
    await enrol_user_to_course(db_session, user_id, course_id)
    return {"message": "Success!! User has been enrolled."}
