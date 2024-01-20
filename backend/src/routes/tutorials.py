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

from .helpers import (
    fetch_one,
    fetch_all,
    add_db_object,
    update_db_object,
)
from .access_checks import (
    check_in_userset,
    check_authorization,
    has_manage_authorization,
)

tuts_ns = Namespace("api/v1/tutorials", description="Tutorial related operations")


@tuts_ns.route("/crs/<string:course_id>")
class TutorialAuth(Resource):
    method_decorators = [jwt_required()]

    @tuts_ns.marshal_list_with(tutorial_fetch_output)
    def get(self, course_id: str):
        course: Course = fetch_one(Course, {"id": course_id})
        all_tuts: list[Tutorial] = fetch_all(Tutorial, {"course_id": course_id})
        if has_manage_authorization(course, current_user, "can_manage_course"):
            return all_tuts
        return [tut for tut in all_tuts if current_user in tut.userset.members]

    @tuts_ns.expect(tutorial_creation_input)
    def post(self, course_id: str):
        course: Course = fetch_one(Course, {"id": course_id})
        check_authorization(course, current_user, "can_manage_tutorials")
        new_tut = Tutorial(course_id=course_id, creator=current_user, **tuts_ns.payload)
        add_db_object(Tutorial, new_tut, new_tut.name)
        return {"id": new_tut.id}, 201


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
        add_db_object(Tutorial, new_tut, new_tut.name)
        return {"id": new_tut.id}, 201


@tuts_ns.route("/<string:tutorial_id>")
class TutorialSpecific(Resource):
    method_decorators = [jwt_required()]

    @tuts_ns.marshal_with(tutorial_fetch_output)
    def get(self, tutorial_id: str):
        pass

    @tuts_ns.expect(tutorial_creation_input)
    def put(self, tutorial_id: str):
        tutorial: Tutorial = fetch_one(Tutorial, {"id": tutorial_id})
        check_authorization(tutorial.course, current_user, "can_manage_tutorials")
        tutorial.update(tuts_ns.payload)
        return update_db_object(Tutorial, tutorial.__repr__())

    def delete(self, tutorial_id: str):
        tutorial: Tutorial = fetch_one(Tutorial, {"id": tutorial_id})
        check_authorization(tutorial.course, current_user, "can_manage_tutorials")
        db.session.delete(tutorial)
        db.session.commit()
        return {}, 200
