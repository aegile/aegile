from ..extensions import db
from .user import User, UserSet
from .helpers import get_with_default


class Group(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course_code = db.Column(db.String(8), db.ForeignKey("course.code"), nullable=False)
    tutorial_id = db.Column(db.Integer, db.ForeignKey("tutorial.id"), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    userset_id = db.Column(db.Integer, db.ForeignKey("user_set.id"), unique=True)
    userset = db.relationship("UserSet", backref="groups", uselist=False)

    def __init__(self, course_code: str, tutorial_id: int, name: str):
        self.course_code = course_code
        self.tutorial_id = tutorial_id
        self.name = name
        self.userset = UserSet()

    def update(self, course_data: dict):
        self.course_code = get_with_default(
            course_data, "course_code", self.course_code
        )
        self.tutorial_id = get_with_default(
            course_data, "tutorial_id", self.tutorial_id
        )
        self.name = get_with_default(course_data, "name", self.name)

    def enroll_users(self, users: list[User]):
        self.userset.members = users
