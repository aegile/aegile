from typing import Annotated

from src.database import get_db_session
from fastapi import Depends
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession

# DBSessionDep = Annotated[AsyncSession, Depends(get_db_session)]
DBSessionDep = Annotated[Session, Depends(get_db_session)]
