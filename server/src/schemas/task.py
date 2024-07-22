from enum import Enum
from typing import List, Optional
from pydantic import BaseModel
from .user import UserInfo


class TaskStatusType(str, Enum):
    BACKLOG = "backlog"
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    IN_REVIEW = "in_review"
    DONE = "done"
    CANCELLED = "cancelled"


class TaskPriorityType(str, Enum):
    NONE = "none"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


class SchemaTaskCreation(BaseModel):
    project_id: str
    name: str
    document: Optional[str] = None
    status: TaskStatusType = "backlog"
    priority: TaskPriorityType = "none"
    assignee_id: Optional[str] = None
    estimate: int = 1
    deadline: Optional[str] = None


class SchemaTaskUpdate(BaseModel):
    name: Optional[str] = None
    document: Optional[str] = None
    status: Optional[TaskStatusType] = None
    priority: Optional[TaskPriorityType] = None
    assignee_id: Optional[str] = None
    estimate: Optional[int] = None
    deadline: Optional[str] = None


class SchemaTaskRead(BaseModel):
    id: str
    name: str
    document: Optional[str] = None
    status: TaskStatusType
    priority: TaskPriorityType
    estimate: int = 1
    assignee: Optional[UserInfo] = None
    deadline: Optional[str] = None

    class Config:
        from_attributes = True
