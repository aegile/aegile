from typing import Annotated

from src import models
from src.api.dependencies.core import DBSessionDep
from src.crud.user import get_user_by_email
from src.schemas.auth import TokenData
from src.utils.auth import decode_jwt, oauth2_scheme
from fastapi import Depends, HTTPException, status
from jwt import PyJWTError


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)], db_session: DBSessionDep
) -> models.User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_jwt(token)
        email = payload.get("sub")
        if email is None:
            raise credentials_exception
        permissions = payload.get("permissions")
        if permissions is None:
            raise credentials_exception
        token_data = TokenData(email=email, permissions=permissions)
    except PyJWTError as e:
        raise credentials_exception from e
    user = await get_user_by_email(db_session, token_data.email)
    if user is None:
        raise credentials_exception
    return user


CurrentUserDep = Annotated[models.User, Depends(get_current_user)]
