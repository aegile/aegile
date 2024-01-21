from flask_restx import Resource, Namespace
from flask_jwt_extended import jwt_required, current_user
from ..extensions import db
from ..models.course import Course, UserCourseStatus
from ..models.role import Role
from ..models.user import User
from ..api_models.course_models import (
    course_fetch_all_output,
    course_fetch_one_output,
    course_creation_input,
    course_members_input,
    course_members_fetch_output,
)
from ..api_models.user_models import user_fetch_output

from .helpers import fetch_one, fetch_all, add_db_object, update_db_object
from .access_checks import check_is_member, check_course_creator, check_authorization

courses_ns = Namespace("api/v1/courses", description="Courses related operations")


# TODO - create roles and assign a base role to the course.


@courses_ns.route("")
class CourseGeneral(Resource):
    method_decorators = [jwt_required()]

    @courses_ns.marshal_list_with(course_fetch_all_output)
    def get(self):
        courses: list[Course] = fetch_all(Course)
        return [crs for crs in courses if current_user in crs.members]

    @courses_ns.expect(course_creation_input)
    def post(self):
        new_course = Course(
            term=courses_ns.payload["term"],
            code=courses_ns.payload["code"],
            name=courses_ns.payload["name"],
            description=courses_ns.payload["description"],
            creator=current_user,
        )
        add_db_object(Course, new_course, new_course.code)

        student_role = Role(name="student", course_id=new_course.id)
        tutor_role = Role(name="tutor", course_id=new_course.id)
        admin_role = Role(name="admin", course_id=new_course.id)
        add_db_object(Role, student_role, student_role.name)
        add_db_object(Role, tutor_role, tutor_role.name)
        add_db_object(Role, admin_role, admin_role.name)

        new_course.enroll(users=[current_user], role_id=admin_role.id)
        return {}, 201


@courses_ns.route("/<string:course_id>")
class CourseSpecific(Resource):
    method_decorators = [jwt_required()]

    @courses_ns.marshal_with(course_fetch_one_output)
    def get(self, course_id: str):
        course: Course = fetch_one(Course, {"id": course_id})
        check_is_member(Course, course, current_user)
        return course

    @courses_ns.expect(course_creation_input)
    def put(self, course_id: str):
        course: Course = fetch_one(Course, {"id": course_id})
        check_authorization(course, current_user, "can_manage_course")
        # todo: check if user has manage course permission
        course.update(course_data=courses_ns.payload)
        return update_db_object(Course, course.code)

    def delete(self, course_id: str):
        course: Course = fetch_one(Course, {"id": course_id})
        check_authorization(course, current_user, "can_manage_course")
        db.session.delete(course)
        db.session.commit()
        return {}, 200


@courses_ns.route("/<string:course_id>/members")
class CourseMembers(Resource):
    method_decorators = [jwt_required()]

    @courses_ns.marshal_list_with(course_members_fetch_output)
    def get(self, course_id: str):
        course: Course = fetch_one(Course, {"id": course_id})
        check_is_member(Course, course, current_user)
        return course.user_course_statuses


@courses_ns.route("/<string:course_id>/enrollable-users")
class CourseEnrollableUsers(Resource):
    method_decorators = [jwt_required()]

    @courses_ns.marshal_list_with(user_fetch_output)
    def get(self, course_id: str):
        course: Course = fetch_one(Course, {"id": course_id})
        check_authorization(course, current_user, "can_manage_course")
        all_users_set: set(User) = set(fetch_all(User))
        return list(all_users_set - set(course.members))


@courses_ns.route("/<string:course_id>/enroll")
class CourseEnroll(Resource):
    method_decorators = [jwt_required()]

    @courses_ns.expect(course_members_input)
    def post(self, course_id: str):
        course: Course = fetch_one(Course, {"id": course_id})
        check_authorization(course, current_user, "can_manage_course")
        student_role: Role = fetch_one(
            Role, {"name": "student", "course_id": course.id}
        )
        course.enroll(
            users=[
                fetch_one(User, {"handle": handle})
                for handle in courses_ns.payload["members"]
            ],
            role_id=student_role.id,
        )
        return {}, 201


@courses_ns.route("/<string:course_id>/invite")
class CourseInvite(Resource):
    method_decorators = [jwt_required()]

    @courses_ns.expect(course_members_input)
    def post(self, course_id: str):
        course: Course = fetch_one(Course, {"id": course_id})
        check_authorization(course, current_user, "can_manage_course")


@courses_ns.route("/<string:course_id>/kick")
class CourseKick(Resource):
    method_decorators = [jwt_required()]

    @courses_ns.expect(course_members_input)
    def delete(self, course_id: str):
        course: Course = fetch_one(Course, {"id": course_id})
        check_authorization(course, current_user, "can_manage_course")
        course.kick(
            users=[
                fetch_one(User, {"handle": handle})
                for handle in courses_ns.payload["members"]
            ]
        )
        return {}, 200


@courses_ns.route("/<string:course_id>/kick/<string:handle>")
class CourseKickUser(Resource):
    method_decorators = [jwt_required()]

    @courses_ns.expect(course_members_input)
    def delete(self, course_id: str, handle: str):
        course: Course = fetch_one(Course, {"id": course_id})
        check_authorization(course, current_user, "can_manage_course")
        course.kick(users=[fetch_one(User, {"handle": handle})])
        return {}, 200
