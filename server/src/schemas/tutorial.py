from typing import List, Optional
from pydantic import BaseModel


class TutorialBase(BaseModel):
    name: str
    capacity: int
    location: str
    # datetimes: List[str]


class TutorialInfo(TutorialBase):
    id: str
    course_id: str
    member_count: int
