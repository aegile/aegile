from flask_restx import Resource, Namespace
from flask_jwt_extended import jwt_required, get_jwt_identity, current_user
from sqlalchemy.exc import IntegrityError
from ..error import InputError
from ..extensions import db

from ..models.course import Course, UserCourseStatus
from ..models.tutorial import Tutorial
from ..models.user import User
from ..api_models.tutorial_models import tutorial_fetch_output, tutorial_creation_input
from ..api_models.user_models import userset_list_input

from .helpers import fetch_one, fetch_all, add_db_object, update_db_object
from .access_checks import query_in_userset, query_course_creator, check_role_permission

tuts_ns = Namespace("v1/tutorials", description="Tutorial related operations")


@tuts_ns.route("/course/<string:course_code>")
class TutorialAuth(Resource):
    method_decorators = [jwt_required()]

    def get(self, course_code: str):
        fetch_one(Course, {"code": course_code})
        ucs: UserCourseStatus = fetch_one(
            UserCourseStatus,
            {"user_handle": current_user.handle, "course_code": course_code},
        )
        check_role_permission(ucs.role, "view_tutorials")
        return fetch_all(Tutorial)


@tuts_ns.route("")
class TutorialCore(Resource):
    method_decorators = [jwt_required()]

    @tuts_ns.marshal_list_with(tutorial_fetch_output)
    def get(self):
        auth_user: User = get_jwt_identity()
        tuts: list(Tutorial) = fetch_all(Tutorial)
        return [tut for tut in tuts if auth_user in tut.userset.members]

    @tuts_ns.expect(tutorial_creation_input)
    def post(self):
        course: Course = fetch_one(Course, {"code": tuts_ns.payload["course_code"]})
        new_tut = Tutorial(
            course_code=course.code,
            name=tuts_ns.payload["name"],
            userset=[
                fetch_one(User, {"handle": handle})
                for handle in tuts_ns.payload["userset"]
            ],
        )
        return add_db_object(Tutorial, new_tut, new_tut.name)


@tuts_ns.route("/<string:tutorial_id>")
class TutorialSpecific(Resource):
    method_decorators = [jwt_required()]

    @tuts_ns.marshal_with(tutorial_fetch_output)
    def get(self, tutorial_id: str):
        pass

    @tuts_ns.expect(tutorial_creation_input)
    def put(self, tutorial_id: str):
        pass

    def delete(self, tutorial_id: str):
        pass
