import os
import contextlib
from sqlite3 import Connection as SQLite3Connection
from typing import Any, AsyncIterator, Iterator
from pydantic import BaseModel

# from sqlalchemy import create_engine, Column, Integer, String, select
from sqlalchemy import event, create_engine, inspect
from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker, Session
from sqlalchemy.pool import NullPool

from sqlalchemy.ext.asyncio import (
    AsyncConnection,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from src.config import settings


class Base(DeclarativeBase):
    def update(self, data: BaseModel):
        for field, value in data.model_dump().items():
            if value:
                setattr(self, field, value)


# """Toggle comment block to switch between local and production databases"""
# engine = create_async_engine(
#     os.environ.get("POSTGRES_URL").replace("postgres://", "postgresql+asyncpg://", 1)
#     # .replace("sslmode", "ssl"),
#     # connect_args={"check_same_thread": False},
# )

# """Toggle comment block to test production Postgres connection"""
# engine = create_async_engine(url=settings.DATABASE_URL, echo=True)


# """Toggle comment block to test local SQLite connection"""
# engine = create_async_engine(
#     "sqlite+aiosqlite:///db.sqlite3", connect_args={"check_same_thread": False}
# )
@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    if isinstance(dbapi_connection, SQLite3Connection):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


# ==============================================================================

# SessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False)


# async def init_db():
#     async with engine.begin() as conn:
#         from src.models import User

#         await conn.run_sync(Base.metadata.create_all)


# async def get_db_session():
#     db = SessionLocal()
#     yield db
#     await db.close()


# ==============================================================================
#                                   ASYNCHRONOUS
# ==============================================================================


# class DatabaseSessionManager:
#     def __init__(self, host: str, engine_kwargs: dict[str, Any] = {}):
#         self._engine = create_async_engine(host, **engine_kwargs)
#         self._sessionmaker = async_sessionmaker(autocommit=False, bind=self._engine)

#     async def close(self):
#         if self._engine is None:
#             raise Exception("DatabaseSessionManager is not initialized")
#         await self._engine.dispose()

#         self._engine = None
#         self._sessionmaker = None

#     @contextlib.asynccontextmanager
#     async def connect(self) -> AsyncIterator[AsyncConnection]:
#         if self._engine is None:
#             raise Exception("DatabaseSessionManager is not initialized")

#         async with self._engine.begin() as connection:
#             try:
#                 yield connection
#             except Exception:
#                 await connection.rollback()
#                 raise

#     @contextlib.asynccontextmanager
#     async def session(self) -> AsyncIterator[AsyncSession]:
#         if self._sessionmaker is None:
#             raise Exception("DatabaseSessionManager is not initialized")

#         session = self._sessionmaker()
#         try:
#             yield session
#         except Exception:
#             await session.rollback()
#             raise
#         finally:
#             await session.close()


# print(settings.DATABASE_URL)
# sessionmanager = DatabaseSessionManager(
#     settings.DATABASE_URL, {"echo": settings.echo_sql}
# )


# async def get_db_session():
#     async with sessionmanager.session() as session:
#         yield session


# ==============================================================================
#                                   SYNCHRONOUS
# ==============================================================================


class DatabaseSessionManager:
    def __init__(self, host: str, engine_kwargs: dict[str, Any] = {}):
        self._engine = create_engine(host, **engine_kwargs)
        self._sessionmaker = sessionmaker(autocommit=False, bind=self._engine)

    def close(self):
        if self._engine is None:
            raise Exception("DatabaseSessionManager is not initialized")
        self._engine.dispose()

        self._engine = None
        self._sessionmaker = None

    @contextlib.contextmanager
    def connect(self) -> Iterator[Session]:
        if self._engine is None:
            raise Exception("DatabaseSessionManager is not initialized")

        with self._engine.begin() as connection:
            try:
                yield connection
            except Exception:
                connection.rollback()
                raise

    @contextlib.contextmanager
    def session(self) -> Iterator[Session]:
        if self._sessionmaker is None:
            raise Exception("DatabaseSessionManager is not initialized")

        session = self._sessionmaker()
        try:
            yield session
        except Exception:
            session.rollback()
            raise
        finally:
            session.close()

    def check_tables(self):
        inspector = inspect(self._engine)
        tables = inspector.get_table_names()
        if len(tables) <= 0:
            Base.metadata.create_all(self._engine)

    def create_tables(self):
        Base.metadata.create_all(self._engine)

    def drop_tables(self):
        Base.metadata.drop_all(self._engine)


print(settings.DATABASE_URL)
sessionmanager = DatabaseSessionManager(
    settings.DATABASE_URL, {"echo": settings.echo_sql}
)


def get_db_session():
    with sessionmanager.session() as session:
        yield session
