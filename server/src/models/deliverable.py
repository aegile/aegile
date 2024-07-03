from datetime import datetime
from uuid import uuid4
from sqlalchemy import ForeignKey, PrimaryKeyConstraint, UniqueConstraint, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from . import Base

# from .assignment import Assignment


class Deliverable(Base):
    __tablename__ = "deliverables"
    id: Mapped[str] = mapped_column(
        String(20),
        primary_key=True,
        default=lambda: "del_" + str(uuid4().hex[:16]),
        index=True,
    )
    assignment_id: Mapped[str] = mapped_column(ForeignKey("assignments.id"))
    name: Mapped[str]
    description: Mapped[str]
    deadline: Mapped[str]
    weighting: Mapped[int]

    __table_args__ = (UniqueConstraint("assignment_id", "name"),)

    def __repr__(self) -> str:
        return f"Deliverable(id={self.id!r}, assignment_id={self.assignment_id!r}, name={self.name!r})"


class DeliverableSubmission(Base):
    __tablename__ = "deliverable_submissions"
    deliverable_id: Mapped[str] = mapped_column(ForeignKey("deliverables.id"))
    project_id: Mapped[str] = mapped_column(ForeignKey("projects.id"))
    file: Mapped[str]
    submission_time: Mapped[str]

    __table_args__ = (
        PrimaryKeyConstraint("deliverable_id", "project_id", "submission_time"),
    )

    def __repr__(self) -> str:
        return f"DeliverableSubmission(deliverable_id={self.deliverable_id!r})"
