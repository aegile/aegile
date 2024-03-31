from datetime import datetime, timedelta
from pydantic import BaseModel


class DeliverableBase(BaseModel):
    assignment_id: str
    name: str = "Milestone 1"
    description: str = "UML diagrams + model and API tests using pytest"
    deadline: datetime = datetime.now() + timedelta(days=7)

    # TODO - validate that the deadline is in the future


class DeliverableInfo(DeliverableBase):
    id: str


class SubmissionBase(BaseModel):
    file: str
    submission_time: datetime = datetime.now()


class SubmissionInfo(SubmissionBase):
    deliverable_id: str
    project_id: str
