from typing import List, Optional
from pydantic import BaseModel


class TutorialBase(BaseModel):
    course_id: str
    name: str
    capacity: int
    start_time: str
    end_time: str
    day: str
    location: str = "Online"

    # datetimes: List[str]


class TutorialInfo(TutorialBase):
    id: str
    member_count: int
