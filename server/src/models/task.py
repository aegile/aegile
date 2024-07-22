from typing import Optional
from nanoid import generate
from fastapi import HTTPException
from sqlalchemy import (
    ForeignKey,
    PrimaryKeyConstraint,
    UniqueConstraint,
    String,
    Enum,
    event,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship, synonym, Session
from . import Base
from .user import User, UserSet, UserSetManager
from .project import Project
from .membership import ProjectMembership


class Task(Base):
    __tablename__ = "tasks"
    id: Mapped[str] = mapped_column(
        String(20),
        primary_key=True,
        # default=lambda: "tsk_" + str(uuid4().hex[:16]),
        default=lambda: "task_" + generate("1234567890abcdef", 15),
        index=True,
    )

    # creator_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    project_id: Mapped[str] = mapped_column(ForeignKey("projects.id"))
    project: Mapped[Project] = relationship("Project", uselist=False, lazy="selectin")
    parent = synonym("project")

    name: Mapped[str]
    document: Mapped[Optional[str]]
    status: Mapped[str] = mapped_column(
        Enum(
            "todo",
            "backlog",
            "done",
            "in_progress",
            "in_review",
            "cancelled",
            name="task_status",
        ),
        nullable=False,
        default="backlog",
    )
    priority: Mapped[str] = mapped_column(
        Enum(
            "none",
            "low",
            "medium",
            "high",
            "urgent",
            name="task_priority",
        ),
        nullable=False,
        default="none",
    )

    assignee_id = mapped_column(ForeignKey("users.id"), nullable=True)
    assignee: Mapped[User] = relationship("User", uselist=False, lazy="selectin")
    estimate: Mapped[int] = mapped_column(default=1)
    deadline: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    # TODO - milestones and subtasks

    # members = relationship("User", secondary="project_memberships")

    # userset_id: Mapped[str] = mapped_column(ForeignKey("usersets.id"))
    # userset: Mapped[UserSet] = relationship("UserSet", uselist=False, lazy="selectin")

    __table_args__ = (UniqueConstraint("project_id", "name"),)

    # def __init__(self, **kwargs):
    #     super().__init__(**kwargs)

    #     self.userset = UserSet()
    #     # self.member_add_creator(self.creator_id)

    def __repr__(self) -> str:
        return f"Task(id={self.id}, name={self.name}, assignee={self.assignee!r})"


class TaskLabel(Base):
    __tablename__ = "task_labels"
    project_id: Mapped[str] = mapped_column(ForeignKey("projects.id"))
    # project: Mapped[Project] = relationship("Project", uselist=False, lazy="selectin")

    task_id: Mapped[str] = mapped_column(ForeignKey("tasks.id"))
    # task: Mapped[Task] = relationship("Task", uselist=False, lazy="selectin")

    label: Mapped[str]
    color: Mapped[str]

    __table_args__ = (PrimaryKeyConstraint("project_id", "task_id", "label"),)

    def __repr__(self) -> str:
        return f"TaskLabel(label={self.label}, project_id={self.project_id} task_id={self.task_id})"


@event.listens_for(Task, "before_insert")
@event.listens_for(Task, "before_update")
def validate_project_membership(mapper, connection, target):
    session = Session(bind=connection)

    exists = (
        session.query(ProjectMembership)
        .filter(
            ProjectMembership.project_id == target.project_id,
            ProjectMembership.user_id == target.assignee_id,
        )
        .first()
        is not None
    )

    if not exists:
        raise HTTPException(
            status_code=400, detail="Assignee is not a member of the given project."
        )
