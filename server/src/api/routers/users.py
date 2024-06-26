from typing import List
from fastapi import APIRouter, Depends
from src.api.dependencies.auth import validate_is_authenticated
from src.api.dependencies.core import DBSessionDep
from src.crud.user import (
    get_users,
    get_user,
    get_user_by_email,
    create_user,
    update_user,
    delete_user,
)
from src.schemas.user import UserRegister, UserInfo, UserProfile

router = APIRouter(
    prefix="/api/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)


@router.get("", response_model=List[UserInfo])
def get_all_users(db_session: DBSessionDep):
    return get_users(db_session)


@router.get(
    "/{user_id}",
    response_model=UserInfo,
    dependencies=[Depends(validate_is_authenticated)],
)
def get_user_via_id(user_id: str, db_session: DBSessionDep):
    user = get_user(db_session, user_id)
    return user


@router.get("/email/{user_email}", response_model=UserInfo)
def get_user_via_email(user_email: str, db_session: DBSessionDep):
    user = get_user_by_email(db_session, user_email)
    return user


@router.post("")
def create_users(user: UserRegister, db_session: DBSessionDep):
    create_user(db_session, user)


@router.put("/{user_id}")
def update_user_via_id(user_id: str, data: UserProfile, db_session: DBSessionDep):
    update_user(db_session, user_id, data)
    return {"message": "User updated"}


@router.delete("/{user_id}")
def delete_user_via_id(user_id: str, db_session: DBSessionDep):
    delete_user(db_session, user_id)
    return {"message": "User deleted."}


# =========


# async def get_user_via_id(user_id: str, db_session: DBSessionDep):
#     user = await get_user(db_session, user_id)
#     return user


# @router.get("/email/{user_email}", response_model=UserInfo)
# async def get_user_via_email(user_email: str, db_session: DBSessionDep):
#     user = await get_user_by_email(db_session, user_email)
#     return user


# @router.get("", response_model=List[UserInfo])
# async def get_all_users(db_session: DBSessionDep):
#     return await get_users(db_session)


# @router.post("")
# async def create_users(user: UserRegister, db_session: DBSessionDep):
#     await create_user(db_session, user)


# @router.put("/{user_id}")
# async def update_user_via_id(user_id: str, data: UserProfile, db_session: DBSessionDep):
#     await update_user(db_session, user_id, data)
#     return {"message": "User updated"}


# @router.delete("/{user_id}")
# async def delete_user_via_id(user_id: str, db_session: DBSessionDep):
#     await delete_user(db_session, user_id)
#     return {"message": "User deleted."}
