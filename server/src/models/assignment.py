from uuid import uuid4
from sqlalchemy import ForeignKey, UniqueConstraint, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from . import Base
from .course import Course


class Assignment(Base):
    __tablename__ = "assignments"
    id: Mapped[str] = mapped_column(
        String(20),
        primary_key=True,
        default=lambda: "ass_" + str(uuid4().hex[:16]),
        index=True,
    )
    course_id: Mapped[str] = mapped_column(ForeignKey("courses.id"))
    course: Mapped[Course] = relationship("Course", uselist=False)

    name: Mapped[str]
    description: Mapped[str]
    file: Mapped[str]
    deadline: Mapped[str]
    weighting: Mapped[float]
    variant: Mapped[str]
    __table_args__ = (UniqueConstraint("name", "course_id"),)

    def __repr__(self) -> str:
        return f"Assignment(id={self.id!r}, course_id={self.course_id!r}, name={self.name!r})"
