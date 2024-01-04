from flask_restx import fields
from src.extensions import api
from .user_models import user_fetch_output

task_fetch_all_output = api.model(
    "TaskFetchAllOutput",
    {
        "id": fields.Integer,
        "project_id": fields.Integer,
        "name": fields.String,
        "creator": fields.String,
        "status": fields.String,
        "description": fields.String,
        "deadline": fields.String,
        "weighting": fields.Integer,
        "priority": fields.String,
        "attachment": fields.String,
        "member_count": fields.Integer,
    },
)

task_fetch_one_output = api.model(
    "TaskFetchOneOutput",
    {
        "id": fields.Integer,
        "project_id": fields.Integer,
        "name": fields.String,
        "creator": fields.String,
        "status": fields.String,
        "description": fields.String,
        "deadline": fields.String,
        "weighting": fields.Integer,
        "priority": fields.String,
        "attachment": fields.String,
    },
)

task_members_fetch_output = api.model(
    "TaskMembersFetchOutput",
    {
        "members": fields.List(fields.Nested(user_fetch_output)),
    },
)

task_members_input = api.model(
    "TaskMembersInput",
    {
        "members": fields.List(fields.Nested(user_fetch_output)),
    },
    strict=True,
)

task_creation_input = api.model(
    "TaskCreationInput",
    {
        "name": fields.String(required=True),
        "project_id": fields.Integer(required=True),
        "creator": fields.String(required=True),
        "status": fields.String(required=True),
        "description": fields.String,
        "deadline": fields.String,
        "weighting": fields.Integer,
        "priority": fields.String,
        "attachment": fields.String,
    },
    strict=True,
)

task_edit_input = api.model(
    "TaskEditInput",
    {
        "name": fields.String,
        "status": fields.String,
        "description": fields.String,
        "deadline": fields.String,
        "weighting": fields.Integer,
        "priority": fields.String,
        "attachment": fields.String,
    },
    strict=True,
)
