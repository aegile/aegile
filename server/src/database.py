import os
import math
import random

import contextlib
from sqlite3 import Connection as SQLite3Connection
from typing import Any, AsyncIterator, Iterator
from pydantic import BaseModel

# from sqlalchemy import create_engine, Column, Integer, String, select
from sqlalchemy import event, create_engine, inspect, MetaData
from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker, Session
from sqlalchemy.pool import NullPool

from sqlalchemy.ext.asyncio import (
    AsyncConnection,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)
from werkzeug.security import generate_password_hash

from src.config import settings


class Base(DeclarativeBase):
    def update(self, data: BaseModel):
        for field, value in data.model_dump().items():
            if isinstance(value, bool) and value == False:
                setattr(self, field, value)
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

    # def check_tables(self):
    #     inspector = inspect(self._engine)
    #     tables = inspector.get_table_names()
    #     if len(tables) <= 0:
    #         Base.metadata.create_all(self._engine)

    def seed_data(self):
        # Local import to avoid circular import issues
        from src.models.user import User

        users_data = [
            {
                "first_name": "John",
                "last_name": "Doe",
                "email": "john.doe@email.com",
                "password": "password123",
            },
            {
                "first_name": "Jane",
                "last_name": "Doe",
                "email": "jane.doe@email.com",
                "password": "password456",
            },
            {
                "first_name": "Jim",
                "last_name": "Beam",
                "email": "jim.beam@email.com",
                "password": "password789",
            },
            {
                "first_name": "Alex",
                "last_name": "Xu",
                "email": "alex@email.com",
                "password": "AlexXu123!",
            },
            {
                "first_name": "Sam",
                "last_name": "Yu",
                "email": "sam@email.com",
                "password": "SamYu123!",
            },
        ]

        with self.session() as session:
            # Check if the table is empty to avoid re-seeding
            if session.query(User).first() is not None:
                print("Database already seeded.")
                return

            for user_data in users_data:
                user = User(
                    first_name=user_data["first_name"],
                    last_name=user_data["last_name"],
                    email=user_data["email"],
                    handle=f"{user_data['first_name']}{user_data['last_name']}{math.floor(random.random()*10000)}",
                    hashed_password=generate_password_hash(user_data["password"]),
                )
                session.add(user)
            session.commit()
            print("Seed data added.")

    def sync_tables(self):
        metadata_reflected = MetaData()
        metadata_reflected.reflect(bind=self._engine)
        metadata_declared = Base.metadata

        has_mismatch: bool = False

        for table_name in metadata_declared.tables:
            if table_name not in metadata_reflected.tables:
                print(f"Table '{table_name}' is missing in the database.")
                has_mismatch = True
                continue

            declared_table = metadata_declared.tables[table_name]
            reflected_table = metadata_reflected.tables[table_name]

            declared_columns = set(declared_table.columns.keys())
            reflected_columns = set(reflected_table.columns.keys())

            if declared_columns != reflected_columns:
                has_mismatch = True
                print(f"Mismatch in table: '{table_name}'")
                missing = declared_columns - reflected_columns
                extra = reflected_columns - declared_columns
                print("          Missing:", missing if missing else "N/A")
                print("            Extra:", extra if extra else "N/A")
                print("")

        if has_mismatch:
            print("Resetting tables")
            self.drop_tables()
            self.create_tables()

    def create_tables(self):
        Base.metadata.create_all(self._engine)
        self.seed_data()

    def drop_tables(self):
        Base.metadata.drop_all(self._engine)


print(settings.DATABASE_URL)
sessionmanager = DatabaseSessionManager(
    settings.DATABASE_URL, {"echo": settings.echo_sql}
)


def get_db_session():
    with sessionmanager.session() as session:
        yield session
