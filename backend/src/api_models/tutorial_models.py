from flask_restx import fields
from src.extensions import api
from .user_models import userset_list_output

tutorial_fetch_output = api.model(
    "TutorialFetchOutput",
    {
        "id": fields.Integer,
        "course_code": fields.String,
        "name": fields.String,
        "userset": fields.Nested(userset_list_output),
    },
)

tutorial_creation_input = api.model(
    "TutorialCreationInput",
    {
        "course_code": fields.String(required=True),
        "name": fields.String(required=True),
        "userset": fields.List(fields.String, required=True),
    },
    strict=True,
)
