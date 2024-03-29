from flask_restx import fields
from ..extensions import api
from .user_models import user_fetch_output

course_fetch_all_output = api.model(
    "CourseFetchAllOutput",
    {
        "id": fields.Integer,
        "term": fields.String,
        "code": fields.String,
        "name": fields.String,
        "description": fields.String,
        "member_count": fields.Integer,
    },
)
course_fetch_one_output = api.model(
    "CourseFetchOneOutput",
    {
        "id": fields.Integer,
        "term": fields.String,
        "code": fields.String,
        "name": fields.String,
        "description": fields.String,
        # "members": fields.List(fields.Nested(user_fetch_output)),
    },
)


course_members_fetch_output = api.model(
    "CourseMembersFetchOutput",
    {
        "id": fields.String(attribute="user.id"),
        "email": fields.String(attribute="user.email"),
        "first_name": fields.String(attribute="user.first_name"),
        "last_name": fields.String(attribute="user.last_name"),
        "handle": fields.String(attribute="user.handle"),
        "image": fields.String(attribute="user.image"),
        "role": fields.String(attribute="role.name"),
    },
)

course_members_input = api.model(
    "CourseMembersInput",
    {
        "members": fields.List(fields.String(required=True)),
    },
    strict=True,
)

course_creation_input = api.model(
    "CourseCreationInput",
    {
        "term": fields.String(required=True),
        "code": fields.String(required=True),
        "name": fields.String(required=True),
        "description": fields.String(required=True),
    },
    strict=True,
)
