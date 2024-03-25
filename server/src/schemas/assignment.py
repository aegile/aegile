from enum import Enum
from pydantic import BaseModel


class AssignmentType(str, Enum):
    INDIV = "individual"
    GROUP = "group"


class AssignmentBase(BaseModel):
    course_id: str
    name: str = "Capstone Project"
    deadline: str = "2022-12-31"
    weighting: float = 0.3
    variant: AssignmentType = AssignmentType.INDIV
    description: str = "lorem ipsum"
    file: str = ""


class AssignmentInfo(AssignmentBase):
    id: str
