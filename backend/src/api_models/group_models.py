from flask_restx import fields
from ..extensions import api
from .user_models import userset_list_output

group_fetch_output = api.model(
    "GroupFetchOutput",
    {
        "id": fields.Integer,
        "course_code": fields.String,
        "Group_id": fields.String,
        "name": fields.String,
        "userset": fields.Nested(userset_list_output),
    },
)

group_creation_input = api.model(
    "GroupCreationInput",
    {
        "course_code": fields.String,
        "tutorial_id": fields.String,
        "name": fields.String,
        "members": fields.List(fields.String),
    },
)
