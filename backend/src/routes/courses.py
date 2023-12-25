from flask_restx import Resource, Namespace
from flask_jwt_extended import jwt_required, current_user
from ..extensions import db
from ..models.course import Course, UserCourseStatus
from ..models.user import User
from ..api_models.course_models import course_fetch_output, course_creation_input
from ..api_models.user_models import userset_list_input

from .helpers import fetch_one, fetch_all, add_db_object, update_db_object
from .access_checks import query_in_userset, query_course_creator, check_role_permission

courses_ns = Namespace("v1/courses", description="Courses related operations")


@courses_ns.route("")
class CourseCore(Resource):
    method_decorators = [jwt_required()]

    @courses_ns.marshal_list_with(course_fetch_output)
    def get(self):
        pass
        # courses: list(Course) = fetch_all(Course)
        # return [crs for crs in courses if current_user in crs.userset.members]

    @courses_ns.expect(course_creation_input)
    def post(self):
        pass
        # users: list[User] = [
        #     fetch_one(User, {"handle": handle})
        #     for handle in courses_ns.payload["userset"]
        # ]

        # for user in users:
        #     new_ucs = UserCourseStatus(
        #         user_handle=user.handle,
        #         course_code=courses_ns.payload["code"],
        #         role_id=None,
        #     )
        #     add_db_object(UserCourseStatus, new_ucs, new_ucs.__repr__())

        # new_course = Course(
        #     code=courses_ns.payload["code"],
        #     name=courses_ns.payload["name"],
        #     creator=current_user,
        #     userset=users,
        # )
        # return add_db_object(Course, new_course, new_course.code)


@courses_ns.route("/<string:course_code>")
class CourseSpecific(Resource):
    method_decorators = [jwt_required()]

    @courses_ns.marshal_with(course_fetch_output)
    def get(self, course_code: str):
        pass
        # course: Course = fetch_one(Course, {"code": course_code})
        # return query_in_userset(Course, course, current_user)

    @courses_ns.expect(course_creation_input)
    def put(self, course_code: str):
        pass
        # course: Course = fetch_one(Course, {"code": course_code})
        # query_in_userset(Course, course, current_user)
        # course.update(course_data=courses_ns.payload)
        # return update_db_object(Course, course.code)

    def delete(self, course_code: str):
        pass
        # course: Course = fetch_one(Course, {"code": course_code})
        # query_in_userset(Course, course, current_user)
        # db.session.delete(course)
        # db.session.commit()
        # return {}, 200


@courses_ns.route("/<string:course_code>/enroll")
class CourseEnroll(Resource):
    method_decorators = [jwt_required()]

    @courses_ns.expect(userset_list_input)
    def put(self, course_code: str):
        pass
        # course: Course = fetch_one(Course, {"code": course_code})
        # query_in_userset(Course, course, current_user)
        # course.enroll_users(
        #     [
        #         fetch_one(User, {"handle": handle})
        #         for handle in courses_ns.payload["userset"]
        #     ]
        # )
        # return update_db_object(Course, course.code)

    def post(self, course_code: str):
        pass
