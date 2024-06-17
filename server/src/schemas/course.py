import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr


class CourseBase(BaseModel):
    # model_config = ConfigDict(from_attributes=True)
    term: str = "23T3"
    code: str = "COMP1531"
    name: str = "Software Engineering Fundamentals"
    status: str = "active"
    instructors: str = "Richard Buckland"
    description: str = ""


class CourseInfo(CourseBase):
    id: str
    member_count: int = 0
    createdAt: str = datetime.datetime.utcnow().isoformat() + "Z"
