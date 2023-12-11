from flask import Blueprint

from ..extensions import db
from ..models.course import Course

courses = Blueprint("courses", __name__)


@courses.route("/c/<course_code>/new", methods=["POST"])
def create_new_course(course_code: str):
    """Creates a new course object.

    Args:
        course_code (str): the course code of the new course
    """
    new_course = Course(code=course_code, name="new course")
    db.session.add(new_course)
    db.session.commit()

    return "Created new course!"
