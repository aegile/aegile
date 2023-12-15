from ..extensions import db
from .user import User, UserSet
from .helpers import get_with_default


class Tutorial(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course_code = db.Column(db.String(8), db.ForeignKey("course.code"), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    userset_id = db.Column(db.Integer, db.ForeignKey("user_set.id"), unique=True)
    userset = db.relationship("UserSet", backref="courses", uselist=False)

    def __init__(self, course_code: str, name: str):
        self.course_code = course_code
        self.name = name
        self.userset = UserSet()

    def update(self, course_data: dict):
        self.course_code = get_with_default(
            course_data, "course_code", self.course_code
        )
        self.name = get_with_default(course_data, "name", self.name)

    def enroll_users(self, users: list[User]):
        self.userset.members = users
