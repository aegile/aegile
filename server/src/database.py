from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, select
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

# SQLALCHEMY
engine = create_async_engine(
    "sqlite+aiosqlite:///db.sqlite3", connect_args={"check_same_thread": False}
)
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
