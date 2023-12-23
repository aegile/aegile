from flask_restx import fields
from src.extensions import api

user_fetch_output = api.model(
    "UserFetchOutput",
    {
        # "email": fields.String,
        "first_name": fields.String,
        "last_name": fields.String,
        "handle": fields.String,
        "image": fields.String,
    },
)

user_creation_input = api.model(
    "UserCreationInput",
    {
        "first_name": fields.String(required=True),
        "last_name": fields.String(required=True),
        "email": fields.String(required=True),
        "password": fields.String(required=True),
    },
    strict=True,
)

user_login_input = api.model(
    "UserLoginInput",
    {
        "email": fields.String,
        "password": fields.String,
    },
)

user_update_input = api.model(
    "UserUpdateInput",
    {
        "first_name": fields.String,
        "last_name": fields.String,
        "email": fields.String,
        "password": fields.String,
        "image": fields.String,
    },
)

userset_list_input = api.model(
    "UserSetListInput",
    {
        "userset": fields.List(fields.String, required=True),
    },
)

userset_list_output = api.model(
    "UserSetListOutput",
    {
        "id": fields.Integer,
        "members": fields.List(fields.Nested(user_fetch_output)),
    },
)
