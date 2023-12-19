from flask_restx import Resource, Namespace

from ..extensions import db

from ..models.user import User
from ..models.course import Course
from ..models.role import Permission, Role
from ..api_models.role_models import (
    role_fetch_output,
    roles_fetch_output,
    role_creation_input,
    role_update_input,
)

from .helpers import fetch_one, fetch_all, add_db_object

roles_ns = Namespace("v1/roles", description="Course Role related operations")


@roles_ns.route("/c/<string:course_code>")
class RoleCore(Resource):
    @roles_ns.marshal_with(roles_fetch_output)
    def get(self, course_code: str):
        fetch_one(Course, {"code": course_code})
        return {"roles": fetch_all(Role, {"course_code": course_code})}

    @roles_ns.expect(role_creation_input)
    def post(self, course_code: str):
        course: Course = fetch_one(Course, {"code": course_code})
        new_role = Role(name=roles_ns.payload["name"], course=course)
        return add_db_object(Role, new_role, new_role.name)


@roles_ns.route("/<string:role_id>")
class RoleSpecific(Resource):
    @roles_ns.marshal_with(role_fetch_output)
    def get(self, role_id: str):
        return fetch_one(Role, {"id": role_id})

    @roles_ns.expect(role_update_input)
    def put(self, role_id: str):
        course: Course = fetch_one(Course, {"code": roles_ns.payload["course_code"]})
        role: Role = fetch_one(Role, {"id": role_id})

        new_assignees = []
        for handle in roles_ns.payload["members"]:
            user = fetch_one(User, {"handle": handle})
            if user in course.userset.members:
                new_assignees.append(user)

        role.assign_to_members(new_assignees)
        return {}, 200

    def delete(self, role_id: str):
        role: Role = fetch_one(Role, {"id": role_id})
        db.session.delete(role)
        db.session.commit()
        return {}, 200
