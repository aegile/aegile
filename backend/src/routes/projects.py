from flask_restx import Resource, Namespace
from flask_jwt_extended import jwt_required, current_user

from ..extensions import db
from ..models.tutorial import Tutorial
from ..models.deliverable import DeliverableInstance
from ..models.project import Project, project_new_model
from ..models.task import Task
from ..models.user import User, UserSet
from ..api_models.project_models import (
    project_fetch_all_output,
    project_fetch_one_output,
    project_creation_input,
    project_edit_input,
    project_members_fetch_output,
)
from ..api_models.task_models import task_fetch_all_output

from ..error import InputError

from .helpers import (
    fetch_one,
    fetch_all,
    update_db_object,
    add_db_object,
)
from .access_checks import (
    check_project_view_access,
    check_project_edit_access,
    check_is_in_a_project,
)


projects_ns = Namespace("api/v1/projects", description="Projects related operations")


@projects_ns.route("")
class ProjectGeneral(Resource):
    method_decorators = [jwt_required()]

    @projects_ns.marshal_list_with(project_fetch_all_output)
    def get(self):
        projects: list[Project] = fetch_all(Project)
        return [prj for prj in projects if current_user in prj.members]

    @projects_ns.expect(project_creation_input)
    def post(self):
        # Check user is a member of the tutorial or is a tutor (assuming groups
        # are now redundant)
        tutorial: Tutorial = fetch_one(
            Tutorial, {"id": projects_ns.payload["tutorial_id"]}
        )
        check_project_view_access(tutorial, current_user)
        new_project = Project(
            course_id=projects_ns.payload["course_id"],
            tutorial_id=projects_ns.payload["tutorial_id"],
            deliverable_instance_id=projects_ns.payload["deliverable_instance_id"],
            name=projects_ns.payload["name"],
            creator=current_user,
            subheading=projects_ns.payload.get("subheading"),
            description=projects_ns.payload.get("description"),
            end_date=projects_ns.payload.get("end_date"),
        )
        add_db_object(Project, new_project, new_project.name)
        return {}, 201


@projects_ns.route("/<string:project_id>")
class ProjectSpecific(Resource):
    method_decorators = [jwt_required()]

    @projects_ns.marshal_with(project_fetch_one_output)
    def get(self, project_id: str):
        project: Project = fetch_one(Project, {"id": project_id})
        tutorial: Tutorial = fetch_one(Tutorial, {"id": project.tutorial_id})
        # Project can be fetched by tutorial members and tutors
        # (can only see basic name, description of project nothing else)
        check_project_view_access(tutorial, current_user)
        return project

    @projects_ns.expect(project_edit_input)
    def put(self, project_id: str):
        project: Project = fetch_one(Project, {"id": project_id})
        # Check user is project creator or tutor
        check_project_edit_access(project, current_user, project.course_id)
        project.update(project_data=projects_ns.payload)
        return update_db_object(Project, project)

    def delete(self, project_id: str):
        project: Project = fetch_one(Project, {"id": project_id})
        check_project_edit_access(project, current_user, project.course_id)
        db.session.delete(project)
        db.session.commit()
        return {}, 200


@projects_ns.route("/<string:project_id>/members")
class ProjectMembers(Resource):
    method_decorators = [jwt_required()]

    @projects_ns.marshal_with(project_members_fetch_output)
    def get(self, project_id: str):
        project: Project = fetch_one(Project, {"id": project_id})
        tutorial: Tutorial = fetch_one(Tutorial, {"id": project.tutorial_id})
        # All tut members and tutors can fetch project members
        check_project_view_access(tutorial, current_user)
        return project

    # This is called by tutors/lic to set members within projects
    # @projects_ns.marshal_list_with()
    # def post(self, project_id: str):
    #     project: Project = fetch_one(Project, {"id": project_id})
    #     check_is_member(Project, project, current_user)
    #     project.add_members(projects_ns.payload["members"])
    #     return {}, 201


@projects_ns.route("/<string:project_id>/enroll")
class ProjectEnroll(Resource):
    method_decorators = [jwt_required()]

    # This is called by students in a tutorial so they can self-enrol into
    # projects (akin to groups in Moodle)
    def post(self, project_id: str):
        project: Project = fetch_one(Project, {"id": project_id})
        tutorial: Tutorial = fetch_one(Tutorial, {"id": project.tutorial_id})
        instance: DeliverableInstance = fetch_one(
            DeliverableInstance, {"id": project.deliverable_instance_id}
        )
        check_project_view_access(tutorial, current_user)
        # Check that user is not enrolled in a project in the same
        # deliverable already
        check_is_in_a_project(instance, current_user)
        project.enroll(user=current_user)
        return {}, 201


@projects_ns.route("/<string:project_id>/leave")
class ProjectLeave(Resource):
    method_decorators = [jwt_required()]

    # This is called by students in a tutorial so they can self-unenrol
    # themselves from a project
    def delete(self, project_id: str):
        project: Project = fetch_one(Project, {"id": project_id})
        project.leave(user=current_user)
        return {}, 200


@projects_ns.route("/instance/<string:instance_id>")
class ProjectInstance(Resource):
    method_decorators = [jwt_required()]

    @projects_ns.marshal_list_with(project_fetch_all_output)
    def get(self, instance_id: str):
        instance: DeliverableInstance = fetch_one(
            DeliverableInstance, {"id": instance_id}
        )
        tutorial: Tutorial = fetch_one(Tutorial, {"id": instance.tutorial_id})
        # Tutorial members and tutors can view all projects within an instance
        check_project_view_access(tutorial, current_user)
        projects: list[Project] = fetch_all(
            Project, {"deliverable_instance_id": instance_id}
        )
        return projects
