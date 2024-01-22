from flask_restx import fields
from src.extensions import api
from .user_models import user_fetch_output

project_fetch_all_output = api.model(
    "ProjectFetchAllOutput",
    {
        "id": fields.Integer,
        "course_id": fields.Integer,
        "tutorial_id": fields.Integer,
        "creator_id": fields.Integer,
        "name": fields.String,
        "subheading": fields.String,
        "description": fields.String,
        "end_date": fields.String,
        "member_count": fields.Integer,
    },
)

project_fetch_one_output = api.model(
    "ProjectFetchOneOutput",
    {
        "id": fields.Integer,
        "course_id": fields.Integer,
        "tutorial_id": fields.Integer,
        "creator_id": fields.Integer,
        "name": fields.String,
        "subheading": fields.String,
        "description": fields.String,
        "end_date": fields.String,
    },
)

project_creation_input = api.model(
    "ProjectCreationInput",
    {
        "course_id": fields.Integer(required=True),
        "tutorial_id": fields.Integer(required=True),
        "deliverable_instance_id": fields.Integer(required=True),
        "name": fields.String(required=True),
        "subheading": fields.String,
        "description": fields.String,
        "end_date": fields.String,
    },
    strict=True,
)

project_edit_input = api.model(
    "ProjectEditInput",
    {
        "name": fields.String,
        "subheading": fields.String,
        "description": fields.String,
        "end_date": fields.String,
    },
    strict=True,
)

project_members_fetch_output = api.model(
    "ProjectMembersFetchOutput",
    {
        "members": fields.List(fields.Nested(user_fetch_output)),
    },
)
