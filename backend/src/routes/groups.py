from flask_restx import Resource, Namespace
from sqlalchemy.exc import IntegrityError
from ..error import InputError
from ..extensions import db

from ..models.group import Group
from ..models.user import User
from ..api_models.group_models import group_fetch_output, group_creation_input
from ..api_models.user_models import userset_list_input

from .helpers import fetch_one, fetch_all, add_db_object, update_db_object

groups_ns = Namespace("v1/groups", description="Group related operations")


@groups_ns.route("")
class GroupCore(Resource):
    @groups_ns.marshal_list_with(group_fetch_output)
    def get(self):
        pass

    @groups_ns.expect(group_creation_input)
    def post(self):
        pass


@groups_ns.route("/<string:group_id>")
class TutorialSpecific(Resource):
    @groups_ns.marshal_with(group_fetch_output)
    def get(self, group_id: str):
        pass

    @groups_ns.expect(group_creation_input)
    def put(self, group_id: str):
        pass

    def delete(self, group_id: str):
        pass
