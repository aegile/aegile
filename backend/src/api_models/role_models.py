from flask_restx import fields
from ..extensions import api
from .user_models import user_fetch_output

permission_mapping = api.model(
    "PermissionMapping",
    {
        "can_manage_roles": fields.Integer,
        "can_manage_course": fields.Integer,
        "can_access_tutorials": fields.Integer,
    },
)

role_fetch_all_output = api.model(
    "RoleFetchAllOutput",
    {
        "id": fields.String,
        "name": fields.String,
        "color": fields.String,
        "member_count": fields.Integer,
    },
)

role_fetch_one_output = api.model(
    "RoleFetchOneOutput",
    {
        "id": fields.String,
        "name": fields.String,
        "color": fields.String,
        "permissions": fields.Nested(permission_mapping),
        "members": fields.List(fields.Nested(user_fetch_output)),
    },
)

role_creation_input = api.model(
    "RoleCreationInput",
    {"name": fields.String(required=True)},
    strict=True,
)


role_members_input = api.model(
    "RoleMembersInput",
    {"member": fields.String(required=True)},
    strict=True,
)


role_update_input = api.model(
    "RoleUpdateInput",
    {
        "name": fields.String(required=True),
        "color": fields.String(required=True),
        "permissions": fields.List(fields.String),
    },
    strict=True,
)


user_role_fetch_input = api.model(
    "UserRoleFetchInput",
    {"course_code": fields.String, "user_handle": fields.String},
)


role_members_fetch_output = api.model(
    "RoleMembersFetchOutput",
    {
        "members": fields.List(fields.Nested(user_fetch_output)),
    },
)
