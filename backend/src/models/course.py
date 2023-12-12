from flask_restx import fields
from ..extensions import api, db
from .user import UserSet


class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(8), nullable=False, unique=True)
    name = db.Column(db.String(100), nullable=False)
    userset_id = db.Column(db.Integer, db.ForeignKey("user_set.id"), unique=True)
    userset = db.relationship("UserSet", backref="courses", uselist=False)

    def __init__(self, code: str, name: str):
        self.code = code
        self.name = name
        self.userset = UserSet()

    def __repr__(self):
        return f"<Course {self.code=} {self.name=}>"


class CourseOffering(db.Model):
    code = db.Column(db.String(8), db.ForeignKey("course.code"), primary_key=True)
    term = db.Column(db.String(4), primary_key=True)


course_fetch_model = api.model(
    "Course", {"id": fields.Integer, "code": fields.String, "name": fields.String}
)

course_new_model = api.model(
    "NewCourseInput", {"code": fields.String, "name": fields.String}
)
