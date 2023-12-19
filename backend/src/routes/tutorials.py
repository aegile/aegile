from flask_restx import Resource, Namespace
from sqlalchemy.exc import IntegrityError
from ..error import InputError
from ..extensions import db

from ..models.tutorial import Tutorial
from ..models.user import User
from ..api_models.tutorial_models import tutorial_fetch_output, tutorial_creation_input
from ..api_models.user_models import userset_list_input

from .helpers import fetch_one, fetch_all, add_db_object, update_db_object

tuts_ns = Namespace("v1/tuts", description="Tutorial related operations")


@tuts_ns.route("")
class TutorialCore(Resource):
    @tuts_ns.marshal_list_with(tutorial_fetch_output)
    def get(self):
        pass

    @tuts_ns.expect(tutorial_creation_input)
    def post(self):
        pass


@tuts_ns.route("/<string:tut_id>")
class TutorialSpecific(Resource):
    @tuts_ns.marshal_with(tutorial_fetch_output)
    def get(self, tut_id: str):
        pass

    @tuts_ns.expect(tutorial_creation_input)
    def put(self, tut_id: str):
        pass

    def delete(self, tut_id: str):
        pass
