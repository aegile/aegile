from uuid import uuid4
from sqlalchemy import ForeignKey, UniqueConstraint, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from . import Base
from .user import UserSet, UserSetManager
from .tutorial import Tutorial
from .assignment import Assignment


class Project(Base, UserSetManager):
    __tablename__ = "projects"
    id: Mapped[str] = mapped_column(
        String(20),
        primary_key=True,
        default=lambda: "prj_" + str(uuid4().hex[:16]),
        index=True,
    )
    # creator_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    tutorial_id: Mapped[str] = mapped_column(ForeignKey("tutorials.id"))
    assignment_id: Mapped[str] = mapped_column(ForeignKey("assignments.id"))
    tutorial: Mapped[Tutorial] = relationship(
        "Tutorial", uselist=False, lazy="selectin"
    )
    assignment: Mapped[Assignment] = relationship(
        "Assignment", uselist=False, lazy="selectin"
    )

    name: Mapped[str]
    description: Mapped[str]

    userset_id: Mapped[str] = mapped_column(ForeignKey("usersets.id"))
    userset: Mapped[UserSet] = relationship("UserSet", uselist=False, lazy="selectin")

    __table_args__ = (UniqueConstraint("tutorial_id", "name"),)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        self.userset = UserSet()
        # self.member_add_creator(self.creator_id)

    def __repr__(self) -> str:
        return f"Project(id={self.id!r}, name={self.name!r})"
