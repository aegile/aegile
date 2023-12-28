from flask_restx import fields
from src.extensions import api
from user_models import user_fetch_output

task_fetch_all_output = api.model(
    "TaskFetchAllOutput",
    {
        "id": fields.Integer,
        "name": fields.String,
        "project_id": fields.Integer,
        "creator": fields.String,
        "status": fields.String,
        "description": fields.String,
        "deadline": fields.String,
        "weighting": fields.Integer,
        "priority": fields.String,
        "attachment": fields.String,
        "assignee_count": fields.Integer,
    },
)
task_fetch_one_output = api.model(
    "TaskFetchOneOutput",
    {
        "id": fields.Integer,
        "name": fields.String,
        "project_id": fields.Integer,
        "creator": fields.String,
        "status": fields.String,
        "description": fields.String,
        "deadline": fields.String,
        "weighting": fields.Integer,
        "priority": fields.String,
        "attachment": fields.String,
    },
)
task_assignees_fetch_output = api.model(
    "TaskAssigneesFetchOutput",
    {
        "assignees": fields.List(fields.Nested(user_fetch_output)),
    },
)

task_assignees_input = api.model(
    "TaskAssigneesInput",
    {
        "assignees": fields.List(fields.Nested(user_fetch_output)),
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
