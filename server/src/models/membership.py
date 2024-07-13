from uuid import uuid4
from sqlalchemy import ForeignKey, PrimaryKeyConstraint, UniqueConstraint, String
from sqlalchemy.orm import Mapped, mapped_column, relationship, synonym
from . import Base
from .user import User
from .tutorial import Tutorial
from .project import Project


class TutorialProjectMembership(Base):
    __tablename__ = "tutorial_project_memberships"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    tutorial_id: Mapped[str] = mapped_column(ForeignKey("tutorials.id"))
    project_id: Mapped[str] = mapped_column(ForeignKey("projects.id"), nullable=True)

    user: Mapped[User] = relationship("User", uselist=False)
    tutorial: Mapped[Tutorial] = relationship("Tutorial", uselist=False)
    project: Mapped[Project] = relationship("Project", uselist=False)

    # TODO - Add roles
    __table_args__ = (PrimaryKeyConstraint("user_id", "tutorial_id"),)

    def __repr__(self) -> str:
        return f"""TutorialProjectMembership(
            \n\tuser_id={self.user!r}, 
            \n\tutorial_id={self.tutorial!r}, 
            \n\tproject_id={self.project!r}\n
        )"""
