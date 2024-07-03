from typing import List, Optional
from fastapi import APIRouter, Depends
from src.api.dependencies.auth import validate_is_authenticated
from src.api.dependencies.core import DBSessionDep
from src.crud.deliverable import (
    create_deliverable,
    get_deliverable,
    get_deliverables,
    update_deliverable,
    delete_deliverable,
    create_submission,
    get_submission,
    get_submissions,
    update_submission,
    delete_submission,
)
from src.schemas.deliverable import (
    DeliverableBase,
    DeliverableInfo,
    SubmissionBase,
    SubmissionInfo,
)

router = APIRouter(
    prefix="/api/deliverables",
    tags=["deliverables"],
    responses={404: {"description": "Not found"}},
)


@router.post("")
def create_assignment_deliverable(
    db_session: DBSessionDep, deliverable_form: DeliverableBase
):
    create_deliverable(db_session, deliverable_form)
    return {"message": "Success!! Deliverable created."}


@router.get("/{deliverable_id}", response_model=DeliverableInfo)
def get_deliverable_via_id(db_session: DBSessionDep, deliverable_id: str):
    return get_deliverable(db_session, deliverable_id)


@router.get("", response_model=List[DeliverableInfo])
def get_all_deliverables_with_optional_filters(
    db_session: DBSessionDep,
    assignment_id: Optional[str] = None,
):
    return get_deliverables(db_session, assignment_id)


@router.put("/{deliverable_id}")
def update_deliverable_via_id(
    db_session: DBSessionDep, deliverable_id: str, deliverable_form: DeliverableBase
):
    update_deliverable(db_session, deliverable_id, deliverable_form)
    return {"message": "Success!! Deliverable updated."}


@router.delete("/{deliverable_id}")
def delete_deliverable_via_id(db_session: DBSessionDep, deliverable_id: str):
    delete_deliverable(db_session, deliverable_id)
    return {"message": "Success!! Deliverable deleted."}


# =============================================================================
#                           Deliverable Submissions
# =============================================================================


@router.post("/{deliverable_id}/submissions/{project_id}")
def create_deliverable_submission(
    db_session: DBSessionDep,
    deliverable_id: str,
    project_id: str,
    submission_form: SubmissionBase,
):
    create_submission(db_session, deliverable_id, project_id, submission_form)
    return {"message": "Success!! Submission created."}


@router.get("/{deliverable_id}/submissions/{project_id}", response_model=SubmissionInfo)
def get_submission_via_ids(
    db_session: DBSessionDep,
    deliverable_id: str,
    project_id: str,
):
    return get_submission(db_session, deliverable_id, project_id)


@router.get("/{deliverable_id}/submissions", response_model=List[SubmissionInfo])
def get_all_deliverable_submissions(
    db_session: DBSessionDep,
    deliverable_id: str,
):
    return get_submissions(db_session, deliverable_id)


@router.put("/{deliverable_id}/submissions/{project_id}")
def update_submission_via_ids(
    db_session: DBSessionDep,
    deliverable_id: str,
    project_id: str,
    submission_form: SubmissionBase,
):
    update_submission(db_session, deliverable_id, project_id, submission_form)
    return {"message": "Success!! Submission updated."}


@router.delete("/{deliverable_id}/submissions/{project_id}")
def delete_submission_via_ids(
    db_session: DBSessionDep, deliverable_id: str, project_id: str
):
    delete_submission(db_session, deliverable_id, project_id)
    return {"message": "Success!! Submission deleted."}


# @router.post("")
# async def create_assignment_deliverable(
#     db_session: DBSessionDep, deliverable_form: DeliverableBase
# ):
#     await create_deliverable(db_session, deliverable_form)
#     return {"message": "Success!! Deliverable created."}


# @router.get("/{deliverable_id}", response_model=DeliverableInfo)
# async def get_deliverable_via_id(db_session: DBSessionDep, deliverable_id: str):
#     return await get_deliverable(db_session, deliverable_id)


# @router.get("", response_model=List[DeliverableInfo])
# async def get_all_deliverables(
#     db_session: DBSessionDep,
#     assignment_id: Optional[str] = None,
# ):
#     return await get_deliverables(db_session, assignment_id)


# @router.put("/{deliverable_id}")
# async def update_deliverable_via_id(
#     db_session: DBSessionDep, deliverable_id: str, deliverable_form: DeliverableBase
# ):
#     await update_deliverable(db_session, deliverable_id, deliverable_form)
#     return {"message": "Success!! Deliverable updated."}


# @router.delete("/{deliverable_id}")
# async def delete_deliverable_via_id(db_session: DBSessionDep, deliverable_id: str):
#     await delete_deliverable(db_session, deliverable_id)
#     return {"message": "Success!! Deliverable deleted."}


# # =============================================================================
# #                           Deliverable Submissions
# # =============================================================================


# @router.post("/{deliverable_id}/submissions/{project_id}")
# async def create_deliverable_submission(
#     db_session: DBSessionDep,
#     deliverable_id: str,
#     project_id: str,
#     submission_form: SubmissionBase,
# ):
#     await create_submission(db_session, deliverable_id, project_id, submission_form)
#     return {"message": "Success!! Submission created."}


# @router.get("/{deliverable_id}/submissions/{project_id}", response_model=SubmissionInfo)
# async def get_submission_via_ids(
#     db_session: DBSessionDep,
#     deliverable_id: str,
#     project_id: str,
# ):
#     return await get_submission(db_session, deliverable_id, project_id)


# @router.get("/{deliverable_id}/submissions", response_model=List[SubmissionInfo])
# async def get_all_deliverable_submissions(
#     db_session: DBSessionDep,
#     deliverable_id: str,
# ):
#     return await get_submissions(db_session, deliverable_id)


# @router.put("/{deliverable_id}/submissions/{project_id}")
# async def update_submission_via_ids(
#     db_session: DBSessionDep,
#     deliverable_id: str,
#     project_id: str,
#     submission_form: SubmissionBase,
# ):
#     await update_submission(db_session, deliverable_id, project_id, submission_form)
#     return {"message": "Success!! Submission updated."}


# @router.delete("/{deliverable_id}/submissions/{project_id}")
# async def delete_submission_via_ids(
#     db_session: DBSessionDep, deliverable_id: str, project_id: str
# ):
#     await delete_submission(db_session, deliverable_id, project_id)
#     return {"message": "Success!! Submission deleted."}
