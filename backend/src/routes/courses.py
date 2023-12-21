from flask_restx import Resource, Namespace
from flask_jwt_extended import jwt_required
from ..extensions import db
from ..models.course import Course
from ..models.user import User
from ..api_models.course_models import course_fetch_output, course_creation_input
from ..api_models.user_models import userset_list_input

from .helpers import (
    authorizations,
    AUTH_NAME,
    fetch_one,
    fetch_all,
    add_db_object,
    update_db_object,
)

courses_ns = Namespace(
    "v1/courses",
    description="Courses related operations",
    authorizations=authorizations,
    security=AUTH_NAME,
)


@courses_ns.route("")
class CourseCore(Resource):
    method_decorators = [jwt_required()]

    @courses_ns.marshal_list_with(course_fetch_output)
    def get(self):
        return fetch_all(Course)

    @courses_ns.expect(course_creation_input)
    def post(self):
        new_course = Course(
            code=courses_ns.payload["code"], name=courses_ns.payload["name"]
        )
        return add_db_object(Course, new_course, new_course.code)


@courses_ns.route("/<string:course_code>")
class CourseSpecific(Resource):
    method_decorators = [jwt_required()]

    @courses_ns.marshal_with(course_fetch_output)
    def get(self, course_code: str):
        return fetch_one(Course, {"code": course_code})

    @courses_ns.expect(course_creation_input)
    def put(self, course_code: str):
        course: Course = fetch_one(Course, {"code": course_code})
        course.update(course_data=courses_ns.payload)
        return update_db_object(Course, course.code)

    def delete(self, course_code: str):
        course: Course = fetch_one(Course, {"code": course_code})
        db.session.delete(course)
        db.session.commit()
        return {}, 200


@courses_ns.route("/<string:course_code>/enroll")
class CourseEnroll(Resource):
    method_decorators = [jwt_required()]

    @courses_ns.expect(userset_list_input)
    def put(self, course_code: str):
        course: Course = fetch_one(Course, {"code": course_code})
        course.enroll_users(
            [
                fetch_one(User, {"handle": handle})
                for handle in courses_ns.payload["userset"]
            ]
        )
        return update_db_object(Course, course.code)

    def post(self, course_code: str):
        pass
