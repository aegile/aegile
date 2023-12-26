from flask_restx import Resource, Namespace
from flask_jwt_extended import jwt_required, current_user
from ..extensions import db

from ..models.user import User
from ..models.course import Course, UserCourseStatus
from ..models.role import Permission, Role
from ..api_models.role_models import (
    role_fetch_output,
    roles_fetch_output,
    role_creation_input,
    role_update_input,
)

from .helpers import fetch_one, fetch_all, add_db_object, update_db_object
from .access_checks import check_in_userset, check_course_creator, check_role_permission

roles_ns = Namespace("v1/roles", description="Course Role related operations")


@roles_ns.route("/course/<string:course_code>")
class RoleCore(Resource):
    method_decorators = [jwt_required()]

    @roles_ns.marshal_list_with(role_fetch_output)
    def get(self, course_code: str):
        pass
        # course: Course = fetch_one(Course, {"code": course_code})
        # # Check if user is course creator
        # check_course_creator(course, current_user)
        # # Check if user has role with manage_roles permission
        # check_in_userset(Course, course, current_user)
        # return fetch_all(Role, {"course_code": course_code})

    @roles_ns.expect(role_creation_input)
    def post(self, course_code: str):
        pass
        # course: Course = fetch_one(Course, {"code": course_code})

        # # Check if user is course creator
        # check_course_creator(course, current_user)
        # # Check if user has role with manage_roles permission
        # check_in_userset(Course, course, current_user)
        # new_role = Role(name=roles_ns.payload["name"], course_code=course_code)
        # return add_db_object(Role, new_role, new_role.name)


@roles_ns.route("/<string:role_id>")
class RoleSpecific(Resource):
    method_decorators = [jwt_required()]

    @roles_ns.marshal_with(role_fetch_output)
    def get(self, role_id: str):
        return fetch_one(Role, {"id": role_id})

    @roles_ns.expect(role_update_input)
    def put(self, role_id: str):
        pass
        # role: Role = fetch_one(Role, {"id": role_id})
        # course: Course = role.course
        # check_course_creator(course, current_user)
        # check_in_userset(Course, course, current_user)
        # print("ROLES_PAYLOAD", roles_ns.payload)
        # role.update(roles_ns.payload)  # only name and color

        # for name, value in roles_ns.payload["permissions"].items():
        #     role.set_permission(name, value)
        # db.session.commit()
        # for handle in roles_ns.payload["members"]:
        #     ucs: UserCourseStatus = fetch_one(UserCourseStatus, {"user_handle": handle})
        #     ucs.role_id = role.id
        #     db.session.commit()
        #     # user: User = fetch_one(User, {"handle": handle})
        #     # check_in_userset(Course, course, user)
        #     # new_ucs = UserCourseStatus(user.id, course.code, role.id)
        #     # add_db_object(UserCourseStatus, new_ucs, new_ucs.__repr__())
        # print(f"{role.members=}")
        # db.session.commit()
        # return {}, 200

    def delete(self, role_id: str):
        role: Role = fetch_one(Role, {"id": role_id})
        db.session.delete(role)
        db.session.commit()
        return {}, 200
