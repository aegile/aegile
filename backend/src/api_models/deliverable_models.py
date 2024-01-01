from flask_restx import fields
from ..extensions import api
from .user_models import user_fetch_output


deliverable_creation_input = api.model(
    "DeliverableCreationInput",
    {
        "name": fields.String(required=True),
        "deliverable_type": fields.String(required=True),
        "limit": fields.String(required=True),
        "weighting": fields.Integer(required=True),
        "deadline": fields.String(required=True),
        "description": fields.String(required=True),
    },
    strict=True,
)

deliverable_fetch_all_output = api.model(
    "DeliverableFetchAllOutput",
    {
        "id": fields.Integer,
        "name": fields.String,
        "deliverable_type": fields.String,
        "weighting": fields.Integer,
        "deadline": fields.String,
        "limit": fields.String,
    },
)

deliverable_fetch_one_output = api.model(
    "DeliverableFetchOneOutput",
    {
        "id": fields.Integer,
        "name": fields.String,
        "deliverable_type": fields.String,
        "weighting": fields.Integer,
        "deadline": fields.String,
        "limit": fields.String,
        "description": fields.String,
    },
)

deliverable_instance_fetch_all_output = api.model(
    "DeliverableInstanceFetchAllOutput",
    {
        "id": fields.Integer,
        "name": fields.String,
        "deliverable_type": fields.String,
        "weighting": fields.Integer,
        "deadline": fields.String,
        "limit": fields.String,
        "description": fields.String,
        "member_count": fields.Integer,
        "count_type": fields.String,
    },
)
