from pydantic import BaseModel
from .assignment import AssignmentInfo
from .tutorial import TutorialInfo
from .user import UserProfile


class ProjectBase(BaseModel):
    assignment_id: str
    tutorial_id: str
    name: str = "Dragonfruit"
    description: str = "lorem ipsum"


class ProjectInfo(ProjectBase):
    id: str
    tutorial: TutorialInfo
    assignment: AssignmentInfo
    member_count: int


class ProjectOverview(BaseModel):
    id: str
    name: str = "Dragonfruit"
    description: str = "lorem ipsum"
    next_deadline: str = "N/A"
    next_deliverable: str = "N/A"
    member_count: int
    members: list[UserProfile] = []
