from pydantic import BaseModel
from .assignment import AssignmentInfo
from .tutorial import TutorialInfo


class ProjectBase(BaseModel):
    name: str = "Dragonfruit"
    description: "lorem ipsum"
    assignment_id: str
    tutorial_id: str


class ProjectInfo(ProjectBase):
    id: str
    tutorial: TutorialInfo
    assignment: AssignmentInfo
    member_count: int
