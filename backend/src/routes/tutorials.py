from flask_restx import Resource, Namespace
from flask_jwt_extended import jwt_required, get_jwt_identity, current_user
from sqlalchemy.exc import IntegrityError
from ..error import InputError
from ..extensions import db

from ..models.course import Course, UserCourseStatus
from ..models.tutorial import Tutorial
from ..models.deliverable import DeliverableInstance
from ..models.user import User
from ..api_models.tutorial_models import (
    tutorial_fetch_output,
    tutorial_creation_input,
    tutorial_members_fetch_output,
    tutorial_members_input,
    tutorial_edit_input,
)
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
    check_is_member,
    check_in_other_tuts,
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
        # Create deliverable instances from existing deliverables for this new tut
        for deliverable in course.deliverables:
            new_instance = DeliverableInstance(
                course_id=course_id,
                tutorial_id=new_tut.id,
                deliverable_id=deliverable.id,
            )
            deliverable.deliverable_instances.append(new_instance)
            new_tut.deliverable_instances.append(new_instance)
            add_db_object(DeliverableInstance, new_instance, new_instance.__repr__())
        return {"id": new_tut.id}, 201


@tuts_ns.route("")
class TutorialGeneral(Resource):
    method_decorators = [jwt_required()]

    @tuts_ns.marshal_list_with(tutorial_fetch_output)
    def get(self):
        # auth_user: User = get_jwt_identity()
        tuts: list[Tutorial] = fetch_all(Tutorial)
        return [tut for tut in tuts if current_user in tut.members]

    # @tuts_ns.expect(tutorial_creation_input)
    # def post(self):
    #     course: Course = fetch_one(Course, {"code": tuts_ns.payload["course_code"]})
    #     new_tut = Tutorial(
    #         course_code=course.code,
    #         name=tuts_ns.payload["name"],
    #         userset=[
    #             fetch_one(User, {"handle": handle})
    #             for handle in tuts_ns.payload["userset"]
    #         ],
    #     )
    #     add_db_object(Tutorial, new_tut, new_tut.name)
    #     return {"id": new_tut.id}, 201


@tuts_ns.route("/<string:tutorial_id>")
class TutorialSpecific(Resource):
    method_decorators = [jwt_required()]

    @tuts_ns.marshal_with(tutorial_fetch_output)
    def get(self, tutorial_id: str):
        tutorial: Tutorial = fetch_one(Tutorial, {"id": tutorial_id})
        check_is_member(Tutorial, tutorial, current_user)
        return tutorial

    @tuts_ns.expect(tutorial_edit_input)
    def put(self, tutorial_id: str):
        tutorial: Tutorial = fetch_one(Tutorial, {"id": tutorial_id})
        check_authorization(tutorial, current_user, "can_manage_tutorials")
        # todo: check if user has manage course permission
        tutorial.update(tutorial_data=tuts_ns.payload)
        return update_db_object(Tutorial, tutorial.name)

    def delete(self, tutorial_id: str):
        tutorial: Tutorial = fetch_one(Tutorial, {"id": tutorial_id})
        check_authorization(tutorial, current_user, "can_manage_tutorials")
        db.session.delete(tutorial)
        db.session.commit()
        return {}, 200


@tuts_ns.route("/<string:tutorial_id>/members")
class TutorialMembers(Resource):
    method_decorators = [jwt_required()]

    @tuts_ns.marshal_with(tutorial_members_fetch_output)
    def get(self, tutorial_id: str):
        tutorial: Tutorial = fetch_one(Tutorial, {"id": tutorial_id})
        check_is_member(Tutorial, tutorial, current_user)
        return tutorial


@tuts_ns.route("/<string:tutorial_id>/enroll")
class TutorialEnroll(Resource):
    method_decorators = [jwt_required()]

    @tuts_ns.expect(tutorial_members_input)
    def post(self, tutorial_id: str):
        tutorial: Tutorial = fetch_one(Tutorial, {"id": tutorial_id})
        course: Course = fetch_one(Course, {"id": tutorial.course_id})
        check_authorization(tutorial, current_user, "can_manage_tutorials")
        # Check users are enrolled in the tutorial's course
        users = [
            fetch_one(User, {"handle": handle}) for handle in tuts_ns.payload["members"]
        ]
        for user in users:
            check_in_other_tuts(course, tutorial, user)
            check_is_member(Course, course, user, is_auth_user=False)

        tutorial.enroll(users=users)
        return {}, 201


@tuts_ns.route("/<string:tutorial_id>/kick")
class TutorialKick(Resource):
    method_decorators = [jwt_required()]

    @tuts_ns.expect(tutorial_members_input)
    def delete(self, tutorial_id: str):
        tutorial: Tutorial = fetch_one(Tutorial, {"id": tutorial_id})
        check_authorization(tutorial, current_user, "can_manage_tutorials")
        tutorial.kick(
            users=[
                fetch_one(User, {"handle": handle})
                for handle in tuts_ns.payload["members"]
            ]
        )
        return {}, 200
