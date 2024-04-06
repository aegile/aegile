from uuid import uuid4
from sqlalchemy import ForeignKey, UniqueConstraint, String
from sqlalchemy.orm import Mapped, mapped_column, relationship, synonym
from . import Base
from .course import Course
from .user import UserSet, UserSetManager


class Tutorial(Base, UserSetManager):
    __tablename__ = "tutorials"
    id: Mapped[str] = mapped_column(
        String(20),
        primary_key=True,
        default=lambda: "tut_" + str(uuid4().hex[:16]),
        index=True,
    )
    # creator_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    course_id: Mapped[str] = mapped_column(ForeignKey("courses.id"))
    course: Mapped[Course] = relationship("Course", uselist=False, lazy="selectin")
    parent = synonym("course")
    name: Mapped[str]
    capacity: Mapped[int]
    location: Mapped[str]
    userset_id: Mapped[str] = mapped_column(ForeignKey("usersets.id"))
    userset: Mapped[UserSet] = relationship("UserSet", uselist=False, lazy="selectin")

    __table_args__ = (UniqueConstraint("course_id", "name"),)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        self.userset = UserSet()
        # self.member_add_creator(self.creator_id)

    def __repr__(self) -> str:
        return f"Tutorial(id={self.id!r}, course_id={self.course_id!r}, name={self.name!r})"
