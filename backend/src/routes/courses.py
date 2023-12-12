from flask import Blueprint
from flask_restx import Resource, Namespace
from ..extensions import db
from ..models.course import Course, course_fetch_model, course_new_model

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


courses_api = Namespace("v1/courses", description="Courses related operations")


@courses_api.route("")
class CourseAPI(Resource):
    @courses_api.marshal_list_with(course_fetch_model)
    def get(self):
        return Course.query.all()

    @courses_api.expect(course_new_model)
    def post(self):
        new_course = Course(
            code=courses_api.payload["code"], name=courses_api.payload["name"]
        )
        db.session.add(new_course)
        db.session.commit()

        return {}, 201


@courses_api.route("/<string:course_code>")
class CourseWithCodeAPI(Resource):
    @courses_api.marshal_with(course_fetch_model)
    def get(self, course_code: str):
        # return Course.query.filter_by().first()
        return Course.query.filter_by(code=course_code).first()


@courses_api.route("/<string:course_code>/enroll")
class CourseEnrollAPI(Resource):
    @courses_api.marshal_list_with(course_fetch_model)
    def put(self, course_code: str):
        pass

    def post(self, course_code: str):
        pass
