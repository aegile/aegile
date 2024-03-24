from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr


class CourseBase(BaseModel):
    # model_config = ConfigDict(from_attributes=True)
    term: str
    code: str
    name: str
    description: str = ""


class CourseInfo(CourseBase):
    id: str
    member_count: int = 0
