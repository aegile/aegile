from datetime import datetime, timedelta, timezone
from typing import List, Optional
from pydantic import BaseModel


class DeliverableBase(BaseModel):
    assignment_id: str
    name: str = "Milestone 1"
    weighting: int = 0
    description: str = "Enter short description here."
    deadline: str = (datetime.now(timezone.utc) + timedelta(days=7)).replace(
        tzinfo=None
    ).isoformat() + "Z"

    # TODO - validate that the deadline is in the future


class DeliverableInfo(BaseModel):
    id: str
    name: str
    weighting: int
    description: str = " Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maxime doloribus rem beatae dignissimos ipsa ea provident ad exercitationem nemo aut. Commodi temporibus illum iusto atque praesentium, vitae nihil. Sint, libero."
    deadline: datetime
    status: str = "active"
    files: List[str] = []


class DeliverableEdit(BaseModel):
    name: str
    weighting: int
    description: Optional[str]
    deadline: str


class SubmissionBase(BaseModel):
    file: str
    submission_time: datetime = datetime.now()


class SubmissionInfo(SubmissionBase):
    deliverable_id: str
    project_id: str
