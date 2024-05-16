from fastapi import APIRouter
from src.api.dependencies.core import DBSessionDep
from src.crud.auth import login_user, register_user
from src.schemas.auth import AuthRegister, AuthLogin

router = APIRouter(
    prefix="/api/auth",
    tags=["auth"],
    responses={404: {"description": "Not found"}},
)


@router.post("/login")
def login_existing_user(credentials: AuthLogin, db_session: DBSessionDep):
    login_user(db_session, credentials)
    return {"message": "Login success!!"}


@router.post("/register")
def register_a_new_user(credentials: AuthRegister, db_session: DBSessionDep):
    register_user(db_session, credentials)
    return {"message": "User registered successfully!!"}


# @router.post("/login")
# async def login_existing_user(credentials: AuthLogin, db_session: DBSessionDep):
#     await login_user(db_session, credentials)
#     return {"message": "Login success!!"}


# @router.post("/register")
# async def register_a_new_user(credentials: AuthRegister, db_session: DBSessionDep):
#     await register_user(db_session, credentials)
#     return {"message": "User registered successfully!!"}
