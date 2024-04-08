from typing import List
from fastapi import APIRouter, Depends
from src.api.dependencies.auth import validate_is_authenticated
from src.api.dependencies.core import DBSessionDep
from src.crud.assignment import (
    create_assignment,
    get_assignments_by_course,
    get_assignment,
    update_assignment,
    delete_assignment,
)

from src.schemas.assignment import AssignmentBase, AssignmentInfo

router = APIRouter(
    prefix="/api/assignments",
    tags=["assignments"],
    responses={404: {"description": "Not found"}},
)


@router.post("")
def create_course_assignment(assignment: AssignmentBase, db_session: DBSessionDep):
    create_assignment(db_session, assignment)
    return {"message": "Success!! Assignment created."}


# @router.get("/{course_id}", response_model=List[AssignmentInfo])
# def get_all_assignments_via_course(course_id: str, db_session: DBSessionDep):
#     return get_assignments_by_course(db_session, course_id)


@router.get("/{assignment_id}", response_model=AssignmentInfo)
def get_assignment_via_id(assignment_id: str, db_session: DBSessionDep):
    return get_assignment(db_session, assignment_id)


@router.put("/{assignment_id}")
def update_assignment_via_id(
    assignment_id: str, data: AssignmentBase, db_session: DBSessionDep
):
    update_assignment(db_session, assignment_id, data)
    return {"message": "Success!! Assignment updated."}


@router.delete("/{assignment_id}")
def delete_assignment_via_id(assignment_id: str, db_session: DBSessionDep):
    delete_assignment(db_session, assignment_id)
    return {"message": "Success!! Assignment deleted."}


# @router.post("")
# async def create_course_assignment(
#     assignment: AssignmentBase, db_session: DBSessionDep
# ):
#     await create_assignment(db_session, assignment)
#     return {"message": "Success!! Assignment created."}


# # @router.get("/{course_id}", response_model=List[AssignmentInfo])
# # async def get_all_assignments_via_course(course_id: str, db_session: DBSessionDep):
# #     return await get_assignments_by_course(db_session, course_id)


# @router.get("/{assignment_id}", response_model=AssignmentInfo)
# async def get_assignment_via_id(assignment_id: str, db_session: DBSessionDep):
#     return await get_assignment(db_session, assignment_id)


# @router.put("/{assignment_id}")
# async def update_assignment_via_id(
#     assignment_id: str, data: AssignmentBase, db_session: DBSessionDep
# ):
#     await update_assignment(db_session, assignment_id, data)
#     return {"message": "Success!! Assignment updated."}


# @router.delete("/{assignment_id}")
# async def delete_assignment_via_id(assignment_id: str, db_session: DBSessionDep):
#     await delete_assignment(db_session, assignment_id)
#     return {"message": "Success!! Assignment deleted."}
