from flask_restx import fields
from src.extensions import api
from .user_api import userset_list_output

course_fetch_output = api.model(
    "CourseFetchOutput",
    {
        "id": fields.Integer,
        "code": fields.String,
        "name": fields.String,
        "userset": fields.Nested(userset_list_output),
    },
)

course_creation_input = api.model(
    "CourseCreationInput", {"code": fields.String, "name": fields.String}
)