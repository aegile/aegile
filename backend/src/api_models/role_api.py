from flask_restx import fields
from src.extensions import api
from .user_api import user_fetch_output

role_fetch_output = api.model(
    "RoleFetchInput",
    {
        "id": fields.String,
        "name": fields.String,
        "color": fields.String,
        "permissions": fields.List(fields.String),
        "members": fields.List(fields.Nested(user_fetch_output)),
    },
)

role_creation_input = api.model(
    "RoleCreationInput",
    {"course_code": fields.String, "name": fields.String},
)

role_update_input = api.model(
    "RoleUpdateInput",
    {
        "course_code": fields.String,
        "name": fields.String,
        "color": fields.String,
        "permissions": fields.List(fields.String),
        "members": fields.List(fields.String),
    },
)

roles_fetch_input = api.model(
    "RolesFetchInput",
    {"course_code": fields.String},
)

roles_fetch_output = api.model(
    "RolesFetchOutput",
    {"roles": fields.List(fields.Nested(role_fetch_output))},
)

user_role_fetch_input = api.model(
    "UserRoleFetchInput",
    {"course_code": fields.String, "user_handle": fields.String},
)
