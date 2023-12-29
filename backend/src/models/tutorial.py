from sqlalchemy import UniqueConstraint
from ..extensions import db
from .user import User, UserSet
from .helpers import get_with_default


class Tutorial(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.String, db.ForeignKey("course.id"), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    groups = db.relationship("Group", backref="tutorial", cascade="all, delete-orphan")
    userset_id = db.Column(db.Integer, db.ForeignKey("user_set.id"))
    userset = db.relationship("UserSet", backref="tutorial_userset", uselist=False)
    __table_args__ = (db.UniqueConstraint("course_id", "name", name="uix_course_name"),)

    def __init__(self, course_id: str, name: str, userset: list[User] = []):
        self.course_id = course_id
        self.name = name
        self.userset = UserSet()
        self.userset.members = userset

    def update(self, course_data: dict):
        self.course_id = get_with_default(course_data, "course_id", self.course_id)
        self.name = get_with_default(course_data, "name", self.name)

    def enroll_users(self, users: list[User]):
        self.userset.members = users

    def __repr__(self):
        return f"<Tutorial {self.id} {self.course_id}→{self.name}>"
