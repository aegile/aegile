from flask_restx import fields
from ..extensions import api
from .user_models import user_fetch_output

tutorial_fetch_output = api.model(
    "TutorialFetchOutput",
    {
        "id": fields.Integer,
        "course_id": fields.Integer,
        "name": fields.String,
        "capacity": fields.Integer,
        "datetime": fields.String,
        "location": fields.String,
    },
)

tutorial_creation_input = api.model(
    "TutorialCreationInput",
    {
        "name": fields.String(required=True),
        "capacity": fields.Integer(required=True),
        "datetime": fields.String(required=True),
        "location": fields.String(required=True),
    },
    strict=True,
)

tutorial_edit_input = api.model(
    "TutorialEditInput",
    {
        "name": fields.String,
        "capacity": fields.Integer,
        "datetime": fields.String,
        "location": fields.String,
    },
    strict=True,
)

tutorial_members_fetch_output = api.model(
    "TutorialMembersFetchOutput",
    {
        "members": fields.List(fields.Nested(user_fetch_output)),
    },
)

tutorial_members_input = api.model(
    "TutorialMembersInput",
    {
        "members": fields.List(fields.String(required=True)),
    },
    strict=True,
)
