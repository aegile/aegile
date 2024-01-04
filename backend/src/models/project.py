from flask_restx import fields
from ..extensions import api, db
from .user import User, UserSet
from ..error import InputError


class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey("course.id"), nullable=False)
    tutorial_id = db.Column(db.Integer, db.ForeignKey("tutorial.id"), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    subheading = db.Column(db.String(100))
    description = db.Column(db.String(100))
    end_date = db.Column(db.String(10))
    userset_id = db.Column(db.Integer, db.ForeignKey("user_set.id"), unique=True)
    userset = db.relationship("UserSet", backref="projects", uselist=False)
    __table_args__ = (
        db.UniqueConstraint("course_id", "group_id", "name", name="grp_proj_name"),
    )

    def __init__(self, creator: User, **kwargs):
        if (
            not kwargs.get("course_id")
            or not kwargs.get("tutorial_id")
            or not kwargs.get("name")
        ):
            raise InputError("Course ID, tutorial ID and name must be given.")

        self.creator_id = creator.id
        # self.course_id = kwargs.get("course_id")
        # self.tutorial_id = kwargs.get("tutorial_id")
        # self.name = kwargs.get("name")
        # self.subheading = kwargs.get("subheading")
        # self.description = kwargs.get("description")
        # self.end_date = kwargs.get("end_date")
        # self.userset = UserSet()
        super(Project, self).__init__(**kwargs)

    @property
    def members(self):
        return self.userset.members

    @members.setter
    def add_members(self, members: list[User]):
        self.userset.members = members

    # Assuming course_id, group_id and creator shouldn't be changed
    def update(self, project_data: dict):
        self.name = project_data.get("name", self.name)
        self.subheading = project_data.get("subheading", self.subheading)
        self.description = project_data.get("description", self.description)
        self.end_date = project_data.get("end_date", self.end_date)

    def __repr__(self):
        return f"<Project {self.id=}>"


project_new_model = api.model("NewProjectInput", {"name": fields.String})
