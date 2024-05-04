from functools import wraps
from typing import List
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

# from sqlalchemy.ext.asyncio import AsyncSession
from src.models.course import CourseEnrolment
from src.models.user import User, UserSetManager


def fetch_one(db_session: Session, model, query_id: str):
    query = select(model).where(model.id == query_id)
    item = (db_session.scalars(query)).first()
    if not item:
        raise HTTPException(status_code=404, detail=f"{model.__name__} not found")
    return item


def fetch_many(db_session: Session, model, query_ids: List[str]):
    query = select(model).where(model.id.in_(query_ids))
    items = (db_session.scalars(query)).first()
    if len(items) != len(query_ids):
        raise HTTPException(
            status_code=400,
            detail=f"Some or all {model.__name__.lower()}s were not found",
        )
    return items


# async def fetch_one(db_session: AsyncSession, model, query_id: str):
#     query = select(model).where(model.id == query_id)
#     item = (await db_session.scalars(query)).first()
#     if not item:
#         raise HTTPException(status_code=404, detail=f"{model.__name__} not found")
#     return item


# async def fetch_many(db_session: AsyncSession, model, query_ids: List[str]):
#     query = select(model).where(model.id.in_(query_ids))
#     items = (await db_session.scalars(query)).first()
#     if len(items) != len(query_ids):
#         raise HTTPException(
#             status_code=400,
#             detail=f"Some or all {model.__name__.lower()}s were not found",
#         )
#     return items


# POST   - database will encounter FOREIGN KEY error if id doesn't exist
# GET    - nothing gets returned
# UPDATE - need to fetch the object first, so will throw error if not found
# DELETE - nothing gets deleted as nothing is found
# What we need to check:
# - is user enrolled in a parent userset or course?
# - if multiple ids are given, is there a valid relationship?
# - submission times need to occur before the deadline
