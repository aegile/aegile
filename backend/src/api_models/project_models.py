from flask_restx import fields
from src.extensions import api

project_fetch_all_output = api.model(
    "ProjectFetchAllOutput",
    {
        "id": fields.Integer,
        "course_code": fields.String,
        "group_id": fields.Integer,
        "creator": fields.String,
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
        "course_code": fields.String,
        "group_id": fields.Integer,
        "creator": fields.String,
        "name": fields.String,
        "subheading": fields.String,
        "description": fields.String,
        "end_date": fields.String,
    },
)

project_creation_input = api.model(
    "ProjectCreationInput",
    {
        "code": fields.String(required=True),
        "group_id": fields.Integer(required=True),
        "name": fields.String(required=True),
        # maybe want to set this to User type
        "creator": fields.String(required=True),
        "subheading": fields.String,
        "description": fields.String,
        "end_date": fields.String,
    },
    strict=True,
)
