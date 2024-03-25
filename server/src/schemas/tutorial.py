from typing import List, Optional
from pydantic import BaseModel


class TutorialBase(BaseModel):
    course_id: str
    name: str = "H11A"
    capacity: int = 25
    location: str = "Quad 1043"
    # datetimes: List[str]


class TutorialInfo(TutorialBase):
    id: str
    member_count: int
