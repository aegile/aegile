from flask_restx import Resource, Namespace
from flask_jwt_extended import jwt_required, current_user
from ..extensions import db, api

from ..models.user import User
from ..models.course import Course, UserCourseStatus
from ..models.role import Permission, Role
from ..api_models.role_models import (
    role_fetch_all_output,
    role_fetch_one_output,
    role_creation_input,
    role_update_input,
    role_members_input,
)

from .helpers import fetch_one, fetch_all, add_db_object, update_db_object
from .access_checks import check_in_userset, check_course_creator, check_authorization

roles_ns = Namespace("v1/roles", description="Course Role related operations")


@roles_ns.route("/course/<string:course_id>")
class RoleGeneral(Resource):
    method_decorators = [jwt_required()]

    @roles_ns.marshal_list_with(role_fetch_all_output)
    def get(self, course_id: str):
        course: Course = fetch_one(Course, {"id": course_id})
        # Todo: check if user has manage roles permission
        check_authorization(course, current_user, "can_manage_roles")
        return course.roles

    @roles_ns.expect(role_creation_input)
    def post(self, course_id: str):
        course: Course = fetch_one(Course, {"id": course_id})
        # Todo: check if user has manage roles permission
        check_authorization(course, current_user, "can_manage_roles")
        new_role = Role(name=roles_ns.payload["name"], course_id=course.id)
        return add_db_object(Role, new_role, new_role.name)


@roles_ns.route("/<string:role_id>")
class RoleSpecific(Resource):
    method_decorators = [jwt_required()]

    @roles_ns.marshal_with(role_fetch_one_output)
    def get(self, role_id: str):
        role: Role = fetch_one(Role, {"id": role_id})
        check_authorization(role.course, current_user, "can_manage_roles")
        return role

    @roles_ns.expect(role_update_input)
    def put(self, role_id: str):
        role: Role = fetch_one(Role, {"id": role_id})
        check_authorization(role.course, current_user, "can_manage_roles")
        role.update(roles_ns.payload)
        return update_db_object(role, role.__repr__())

    def delete(self, role_id: str):
        role: Role = fetch_one(Role, {"id": role_id})
        check_authorization(role.course, current_user, "can_manage_roles")
        db.session.delete(role)
        db.session.commit()
        return {}, 200


@roles_ns.route("/<string:role_id>/user/<string:user_id>/<string:state>")
@api.doc(params={"state": "'assign' or 'unassign'"})
class RoleMemberAssign(Resource):
    method_decorators = [jwt_required()]

    @roles_ns.doc(
        description="Assign or unassign a role to a user. The 'state' parameter should be either 'assign' or 'unassign'."
    )
    def put(self, role_id: str, user_id: str, state: str):
        # ! May be a better idea if the payload had the user id instead of the handle
        if state not in ["assign", "unassign"]:
            return {"message": "Invalid state"}, 400

        role: Role = fetch_one(Role, {"id": role_id})
        course: Course = role.course
        check_authorization(course, current_user, "can_manage_roles")
        ucs: UserCourseStatus = fetch_one(
            UserCourseStatus, {"user_id": user_id, "course_id": course.id}
        )
        if state == "assign":
            ucs.role_id = role.id
        else:
            ucs.role_id = None

        return update_db_object(ucs, ucs.__repr__())
