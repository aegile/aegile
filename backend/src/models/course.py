from ..extensions import db
from .user import User, UserSet
from .helpers import get_with_default


class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(8), nullable=False, unique=True)
    name = db.Column(db.String(100), nullable=False)
    userset_id = db.Column(db.Integer, db.ForeignKey("user_set.id"))
    userset = db.relationship("UserSet", backref="courses")
    tutorials = db.relationship(
        "Tutorial", backref="course", cascade="all, delete-orphan"
    )

    def __init__(self, code: str, name: str):
        self.code = code
        self.name = name
        self.userset = UserSet()

    def update(self, course_data: dict):
        self.code = get_with_default(course_data, "code", self.code)
        self.name = get_with_default(course_data, "name", self.name)

    def enroll_users(self, users: list[User]):
        self.userset.members = users

    def __repr__(self):
        return f"<Course {self.code=} {self.name=}>"


class CourseOffering(db.Model):
    code = db.Column(db.String(8), db.ForeignKey("course.code"), primary_key=True)
    term = db.Column(db.String(4), primary_key=True)
