from uuid import uuid4
from sqlalchemy import ForeignKey, PrimaryKeyConstraint, UniqueConstraint, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from . import Base
from .user import User


class Course(Base):
    __tablename__ = "courses"
    id: Mapped[str] = mapped_column(
        String(20),
        primary_key=True,
        default=lambda: "crs_" + str(uuid4().hex[:16]),
        index=True,
    )
    term: Mapped[str] = mapped_column(String(4))
    code: Mapped[str] = mapped_column(String(8))
    name: Mapped[str]
    instructors: Mapped[str]
    status: Mapped[str]
    description: Mapped[str]
    enrolments: Mapped[list["CourseEnrolment"]] = relationship(
        "CourseEnrolment", back_populates="course", lazy="selectin"
    )

    __table_args__ = (UniqueConstraint("term", "code"),)

    @property
    def member_count(self):
        return len(self.enrolments)

    @property
    def members(self):
        return [enrolment.user for enrolment in self.enrolments]

    def __repr__(self) -> str:
        return f"Course(id={self.id!r}, term={self.term!r}, code={self.code!r}, name={self.name!r})"


class CourseEnrolment(Base):
    __tablename__ = "enrolments"
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    course_id: Mapped[str] = mapped_column(ForeignKey("courses.id"))
    user: Mapped[User] = relationship("User", uselist=False)
    course: Mapped[Course] = relationship("Course", uselist=False)
    role: Mapped[str] = mapped_column(String, default="student")
    # TODO - Add roles
    __table_args__ = (PrimaryKeyConstraint("user_id", "course_id"),)

    def __repr__(self) -> str:
        return f"CourseEnrolment(user={self.user!r}, course={self.course!r})"
