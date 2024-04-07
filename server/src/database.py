import os
from pydantic import BaseModel

# from sqlalchemy import create_engine, Column, Integer, String, select
from sqlalchemy import event
from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

# """Toggle comment block to test Postgres connection"""
# from dotenv import load_dotenv
# load_dotenv(".env.local")

"""Toggle comment block to switch between local and production databases"""
engine = create_async_engine(
    os.environ.get("POSTGRES_URL").replace("postgres://", "postgresql+asyncpg://", 1),
    # connect_args={"check_same_thread": False},
)

# """Toggle comment block to test local SQLite connection"""
# engine = create_async_engine(
#     "sqlite+aiosqlite:///db.sqlite3", connect_args={"check_same_thread": False}
# )
# @event.listens_for(Engine, "connect")
# def set_sqlite_pragma(dbapi_connection, connection_record):
#     cursor = dbapi_connection.cursor()
#     cursor.execute("PRAGMA foreign_keys=ON")
#     cursor.close()

SessionLocal = async_sessionmaker(engine)


async def get_db_session():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    db = SessionLocal()
    try:
        yield db
    finally:
        await db.close()


class Base(DeclarativeBase):
    def update(self, data: BaseModel):
        for field, value in data.model_dump().items():
            if value:
                setattr(self, field, value)
