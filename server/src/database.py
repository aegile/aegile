import os
import contextlib
import logging
from typing import Any, AsyncIterator
from pydantic import BaseModel

# from sqlalchemy import create_engine, Column, Integer, String, select
# from sqlalchemy import event
# from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import NullPool

# from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from sqlalchemy.ext.asyncio import (
    AsyncConnection,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

"""Toggle comment block to test Postgres connection"""
from dotenv import load_dotenv

load_dotenv(".env.local")

# """Toggle comment block to switch between local and production databases"""
# engine = create_async_engine(
#     os.environ.get("POSTGRES_URL")
#     .replace("postgres://", "postgresql+asyncpg://", 1)
#     .replace("sslmode", "ssl"),
#     # connect_args={"check_same_thread": False},
# )

# """Toggle comment block to test local SQLite connection"""
# engine = create_async_engine(
#     "sqlite+aiosqlite:///db.sqlite3", connect_args={"check_same_thread": False}
# )
# @event.listens_for(Engine, "connect")
# def set_sqlite_pragma(dbapi_connection, connection_record):
#     cursor = dbapi_connection.cursor()
#     cursor.execute("PRAGMA foreign_keys=ON")
#     cursor.close()


# ==============================================================================

# SessionLocal = async_sessionmaker(engine)


# async def get_db_session():
#     async with engine.begin() as conn:
#         await conn.run_sync(Base.metadata.create_all)

#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         await db.close()


class Base(DeclarativeBase):
    def update(self, data: BaseModel):
        for field, value in data.model_dump().items():
            if value:
                setattr(self, field, value)


class DatabaseSessionManager:
    def __init__(self, host: str, engine_kwargs: dict[str, Any] = {}):
        self._engine = create_async_engine(host, **engine_kwargs)
        self._sessionmaker = async_sessionmaker(
            autocommit=False,
            bind=self._engine,
            expire_on_commit=False,
        )
        # self._logger = logging.getLogger(__name__)

    async def close(self):
        if self._engine is None:
            raise Exception("DatabaseSessionManager is not initialized")
        await self._engine.dispose()

        self._engine = None
        self._sessionmaker = None

    @contextlib.asynccontextmanager
    async def connect(self) -> AsyncIterator[AsyncConnection]:
        if self._engine is None:
            raise Exception("DatabaseSessionManager is not initialized")

        async with self._engine.begin() as connection:
            try:
                yield connection
            except Exception:
                await connection.rollback()
                raise

        # async with self._engine.begin() as connection:
        #     self._logger.info("Starting new transaction")
        #     try:
        #         yield connection
        #     except Exception as e:
        #         self._logger.error("Exception occurred: %s", e)
        #         await connection.rollback()
        #         raise
        #     else:
        #         self._logger.info("Transaction completed")

    @contextlib.asynccontextmanager
    async def session(self) -> AsyncIterator[AsyncSession]:
        if self._sessionmaker is None:
            raise Exception("DatabaseSessionManager is not initialized")

        session = self._sessionmaker()
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


sessionmanager = DatabaseSessionManager(
    os.environ.get("POSTGRES_URL")
    .replace("postgres://", "postgresql+asyncpg://", 1)
    .replace("sslmode", "ssl"),
    {"poolclass": NullPool},
)


async def get_db_session():
    async with sessionmanager.session() as session:
        yield session
