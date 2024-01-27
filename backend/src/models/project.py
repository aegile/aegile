from sqlalchemy.exc import IntegrityError
from flask_restx import fields
from ..extensions import api, db
from .user import User, UserSet
from ..error import InputError


class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey("course.id"), nullable=False)
    tutorial_id = db.Column(db.Integer, db.ForeignKey("tutorial.id"), nullable=False)
    deliverable_instance_id = db.Column(
        db.Integer, db.ForeignKey("deliverable_instance.id"), nullable=False
    )
    name = db.Column(db.String(100), nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    subheading = db.Column(db.String(100))
    description = db.Column(db.String(100))
    end_date = db.Column(db.String(10))
    userset_id = db.Column(db.Integer, db.ForeignKey("user_set.id"), unique=True)
    userset = db.relationship("UserSet", backref="project", uselist=False)
    tasks = db.relationship("Task", backref="project", cascade="all, delete-orphan")
    __table_args__ = (
        db.UniqueConstraint("deliverable_instance_id", "name", name="dlv_proj_name"),
    )

    def __init__(self, creator: User, **kwargs):
        if (
            not kwargs.get("course_id")
            or not kwargs.get("tutorial_id")
            or not kwargs.get("deliverable_instance_id")
            or not kwargs.get("name")
        ):
            raise InputError(
                "Course ID, tutorial ID, deliverable instance ID and name must be given."
            )

        self.creator_id = creator.id
        self.userset = UserSet()
        self.userset.members = [creator]
        super(Project, self).__init__(**kwargs)

    @property
    def members(self):
        return self.userset.members

    @property
    def member_count(self):
        return len(self.userset.members)

    def add_members(self, members: list[User]):
        self.userset.members = members

    def enroll(self, user: User):
        self.members.append(user)

    def leave(self, user: User):
        if user.id == self.creator_id:
            raise InputError("Creator cannot leave the project.")
        if user not in self.members:
            raise InputError(
                f"User {user.handle} is not enrolled in project {self.name}."
            )
        self.members.remove(user)

    # Assuming course_id, group_id and creator shouldn't be changed
    def update(self, project_data: dict):
        self.name = project_data.get("name", self.name)
        self.subheading = project_data.get("subheading", self.subheading)
        self.description = project_data.get("description", self.description)
        self.end_date = project_data.get("end_date", self.end_date)

    def __repr__(self):
        return f"<Project {self.id=}>"
