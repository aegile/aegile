from enum import Enum
from pydantic import BaseModel


class AssignmentType(str, Enum):
    INDIV = "individual"
    GROUP = "group"
    HOMEWORK = "homework"


class AssignmentBase(BaseModel):
    course_id: str
    name: str = "Capstone Project"
    deadline: str = "2022-12-31"
    weighting: float = 0.3
    variant: AssignmentType = AssignmentType.INDIV
    description: str = "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Repellendus architecto recusandae iusto ex vero necessitatibus, possimus numquam minima dolorum vitae laboriosam nulla. Excepturi aperiam similique necessitatibus ratione aspernatur reiciendis eaque?"
    file: str = ""
    archived: bool = False


class AssignmentInfo(AssignmentBase):
    id: str
    labels: list[str] = []


class AssignmentEdit(BaseModel):
    name: str
    deadline: str
    weighting: float
    variant: AssignmentType
    description: str
    labels: list[str]
    archived: bool


class AssignmentSelector(BaseModel):
    id: str
    name: str
