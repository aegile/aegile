from flask_restx import fields
from ..extensions import api, db
from .user import User, UserSet


class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course_code = db.Column(db.String(8), db.ForeignKey("course.code"), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey("group.id"), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    userset_id = db.Column(db.Integer, db.ForeignKey("user_set.id"), unique=True)
    userset = db.relationship("UserSet", backref="projects", uselist=False)
    __table_args__ = (
        db.UniqueConstraint("course_code", "group_id", "name", name="grp_proj_name"),
    )

    def __init__(self, course_code: str, group_id: int, name: str):
        self.course_code = course_code
        self.group_id = group_id
        self.name = name
        self.userset = UserSet()

    def add_members(self, members: list[User]):
        self.userset.members = members

    def get_members(self):
        return self.userset.members

    def __repr__(self):
        return f"<Project {self.id=}>"


project_new_model = api.model("NewProjectInput", {"name": fields.String})
