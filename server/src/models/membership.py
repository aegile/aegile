from uuid import uuid4
from sqlalchemy import ForeignKey, PrimaryKeyConstraint, UniqueConstraint, String
from sqlalchemy.orm import Mapped, mapped_column, relationship, synonym
from . import Base
from .user import User
from .tutorial import Tutorial
from .project import Project


class TutorialMembership(Base):
    __tablename__ = "tutorial_memberships"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    tutorial_id: Mapped[str] = mapped_column(ForeignKey("tutorials.id"))
    course_id: Mapped[str] = mapped_column(ForeignKey("courses.id"))

    # user: Mapped[User] = relationship("User", uselist=False)
    # tutorial: Mapped[Tutorial] = relationship("Tutorial", uselist=False)

    __table_args__ = (PrimaryKeyConstraint("user_id", "course_id", "tutorial_id"),)

    def __repr__(self) -> str:
        return f"""\nTutorialMembership(
            \n\tuser={self.user!r},
            \n\ttutorial={self.tutorial!r}\n
        )"""


class TutorialProjectMembership(Base):
    __tablename__ = "tutorial_project_memberships"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    tutorial_id: Mapped[str] = mapped_column(ForeignKey("tutorials.id"))
    project_id: Mapped[str] = mapped_column(ForeignKey("projects.id"), nullable=True)

    user: Mapped[User] = relationship("User", uselist=False)
    tutorial: Mapped[Tutorial] = relationship("Tutorial", uselist=False)
    project: Mapped[Project] = relationship("Project", uselist=True)

    # TODO - Add roles
    __table_args__ = (PrimaryKeyConstraint("user_id", "tutorial_id"),)

    # def __repr__(self) -> str:
    #     return f"""TutorialProjectMembership(
    #         \n\tuser={self.user!r},
    #         \n\tutorial={self.tutorial!r},
    #         \n\tproject={self.project!r}\n
    #     )"""


class ProjectMembership(Base):
    __tablename__ = "project_memberships"

    user_id: Mapped[str] = mapped_column(ForeignKey("users.id"))
    project_id: Mapped[str] = mapped_column(ForeignKey("projects.id"))
    assignment_id: Mapped[str] = mapped_column(ForeignKey("assignments.id"))

    # user: Mapped[User] = relationship("User", back_populates="projects", uselist=False)
    # project: Mapped[Project] = relationship(
    #     "Project", back_populates="members", uselist=False
    # )

    __table_args__ = (PrimaryKeyConstraint("user_id", "assignment_id", "project_id"),)

    # def __repr__(self) -> str:
    #     return f"""ProjectGroupMembership(
    #         \n\tuser={self.user!r},
    #         \n\tproject={self.project!r},
    #         \n\tgroup={self.group!r}\n
    #     )"""
