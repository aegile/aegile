from flask_restx import fields
from ..extensions import api
from .user_models import userset_list_output

tutorial_fetch_output = api.model(
    "TutorialFetchOutput",
    {
        "id": fields.Integer,
        "name": fields.String,
        "capacity": fields.Integer,
        "day": fields.String,
        "times": fields.String,
        "location": fields.String,
    },
)

tutorial_creation_input = api.model(
    "TutorialCreationInput",
    {
        "name": fields.String(required=True),
        "capacity": fields.Integer(required=True),
        "day": fields.String(required=True),
        "times": fields.String(required=True),
        "location": fields.String(required=True),
    },
    strict=True,
)
