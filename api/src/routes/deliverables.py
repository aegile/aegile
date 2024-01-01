from flask_restx import Resource, Namespace
from flask_jwt_extended import jwt_required, current_user
from ..extensions import db
from ..models.course import Course
from ..models.deliverable import Deliverable, DeliverableInstance
from ..models.tutorial import Tutorial
from ..models.user import User

from ..api_models.deliverable_models import (
    deliverable_creation_input,
    deliverable_fetch_all_output,
    deliverable_fetch_one_output,
    deliverable_instance_fetch_all_output,
)

from .helpers import fetch_one, fetch_all, add_db_object, update_db_object
from .access_checks import check_is_member, check_access, check_authorization

deliverables_ns = Namespace(
    "v1/deliverables", description="Deliverable related operations"
)


@deliverables_ns.route("/crs/<string:course_id>")
class DeliverableCourseSpecific(Resource):
    method_decorators = [jwt_required()]

    @deliverables_ns.marshal_list_with(deliverable_fetch_all_output)
    def get(self, course_id: str):
        return fetch_all(Deliverable, {"course_id": course_id})

    @deliverables_ns.expect(deliverable_creation_input)
    def post(self, course_id: str):
        course: Course = fetch_one(Course, {"id": course_id})
        check_access(course, Course, course, current_user, "can_manage_course")
        payload = deliverables_ns.payload
        new_deliverable = Deliverable(
            course_id=course_id,
            name=payload["name"],
            deliverable_type=payload["deliverable_type"],
            limit=payload["limit"],
            weighting=payload["weighting"],
            deadline=payload["deadline"],
            description=payload["description"],
        )
        add_db_object(Deliverable, new_deliverable, new_deliverable.__repr__())
        # Create deliverable instances tied to this deliverable for all course tuts
        for tutorial in course.tutorials:
            new_instance = DeliverableInstance(
                course_id=course_id,
                tutorial_id=tutorial.id,
                deliverable_id=new_deliverable.id,
            )
            new_deliverable.deliverable_instances.append(new_instance)
            add_db_object(DeliverableInstance, new_instance, new_instance.__repr__())
        return {}, 201


@deliverables_ns.route("/tut/<string:tutorial_id>")
class DeliverableTutorialSpecific(Resource):
    method_decorators = [jwt_required()]

    @deliverables_ns.marshal_list_with(deliverable_instance_fetch_all_output)
    def get(self, tutorial_id: str):
        tutorial = fetch_one(Tutorial, {"id": tutorial_id})
        check_access(
            tutorial.course, Tutorial, tutorial, current_user, "can_manage_tutorial"
        )
        return tutorial.deliverable_instances

    @deliverables_ns.expect()
    def post(self, tutorial_id: str):
        # this route should be called right after a new tut is created
        tutorial: Tutorial = fetch_one(Tutorial, {"id": tutorial_id})
        # TODO - check if the tutorial creator is the current user
        check_access(
            tutorial.course, Tutorial, tutorial, current_user, "can_manage_tutorial"
        )
        # Create deliverable instances for each deliverable set for the course
        for deliverable in tutorial.course.deliverables:
            new_instance = DeliverableInstance(
                course_id=tutorial.course.id,
                tutorial_id=tutorial_id,
                deliverable_id=deliverable.id,
            )
            tutorial.deliverable_instances.append(new_instance)
        return {}, 201


@deliverables_ns.route("/<string:deliverable_id>")
class DeliverableSpecific(Resource):
    method_decorators = [jwt_required()]

    @deliverables_ns.marshal_with(deliverable_fetch_one_output)
    def get(self, deliverable_id: str):
        return fetch_one(Deliverable, {"id": deliverable_id})

    @deliverables_ns.expect(deliverable_creation_input)
    def put(self, deliverable_id: str):
        deliverable: Deliverable = fetch_one(Deliverable, {"id": deliverable_id})
        check_authorization(deliverable.course, current_user, "can_manage_course")
        deliverable.update(deliverables_ns.payload)
        return update_db_object(Deliverable, deliverable.__repr__())

    def delete(self, deliverable_id: str):
        deliverable = fetch_one(Deliverable, {"id": deliverable_id})
        check_authorization(deliverable.course, current_user, "can_manage_course")
        db.session.delete(deliverable)
        db.session.commit()
        return {}, 200


@deliverables_ns.route("/instance/<string:instance_id>")
class DeliverableInstanceSpecific(Resource):
    method_decorators = [jwt_required()]

    # @deliverables_ns.marshal_with()
    def get(self, instance_id: str):
        pass

    # @deliverables_ns.expect()
    def put(self, instance_id: str):
        pass

    def delete(self, instance_id: str):
        return {}, 200
