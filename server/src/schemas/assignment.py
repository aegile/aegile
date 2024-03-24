from enum import Enum
from pydantic import BaseModel


class AssignmentType(str, Enum):
    INDIV = "individual"
    GROUP = "group"


class AssignmentBase(BaseModel):
    name: str
    deadline: str
    weighting: float
    variant: AssignmentType = AssignmentType.INDIV
    description: str = ""
    file: str = ""


class AssignmentInfo(AssignmentBase):
    id: str
    course_id: str
