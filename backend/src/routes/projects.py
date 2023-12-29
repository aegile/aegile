from flask import Blueprint, request
from flask_restx import Resource, Namespace
from flask_jwt_extended import jwt_required, current_user

from src.extensions import db
from src.models.project import Project, project_new_model
from src.models.task import Task
from src.models.user import User, UserSet
from ..api_models.project_models import (
    project_fetch_all_output,
    project_fetch_one_output,
    project_creation_input,
)
from ..api_models.task_models import task_fetch_all_output

from .helpers import (
    fetch_one,
    fetch_all,
    update_db_object,
    add_db_object,
)
from .access_checks import check_is_member

# projects = Blueprint("projects", __name__)

projects_ns = Namespace("v1/projects", description="Projects related operations")


# @projects.route("/p/new/<project_name>", methods=["POST"])
# def create_new_project(project_name: str):
#     new_project: Project = Project(name=project_name)
#     db.session.add(new_project)

#     db.session.commit()

#     return "Created new project"


# @projects.route("/p/<project_id>/assign", methods=["PUT"])
# def add_project_members(project_id: str):
#     project: Project = fetch_one_by_id(Project, project_id, "Project not found")
#     userset: UserSet = project.userset

#     userset.members = [
#         fetch_one_by_id(User, user_id, f"User ID {user_id} not found")
#         for user_id in request.get_json()["user_ids"]
#     ]

#     db.session.commit()
#     return f"Added {', '.join([mem.first_name for mem in userset.members])} users to project"


# projects_ns = Namespace("v1/projects", description="Courses related operations")


# @projects_ns.route("")
# class ProjectAPI(Resource):
#     @projects_ns.expect(project_new_model)
#     def post(self):
#         new_project = Project(name=projects_ns.payload["name"])
#         db.session.add(new_project)
#         db.session.commit()

#         return {}, 201


@projects_ns.route("")
class ProjectGeneral(Resource):
    method_decorators = [jwt_required()]

    @projects_ns.marshal_list_with(project_fetch_all_output)
    def get(self):
        projects: list[Project] = fetch_all(Project)
        # Change get_members() to become an @property
        return [prj for prj in projects if current_user in prj.get_members()]

    @projects_ns.expect(project_creation_input)
    def post(self):
        new_project = Project(
            course_code=projects_ns.payload["code"],
            group_id=projects_ns.payload["group_id"],
            name=projects_ns.payload["name"],
            creator=current_user,
            subheading=projects_ns.payload["subheading"],
            description=projects_ns.payload["description"],
            end_date=projects_ns.payload["end_date"],
        )
        add_db_object(Project, new_project, new_project.name)
        new_project.add_members(members=[current_user])
        return {}, 201


@projects_ns.route("/<string:project_id>")
class ProjectSpecific(Resource):
    method_decorators = [jwt_required()]

    @projects_ns.marshal_with(project_fetch_one_output)
    def get(self, project_id: str):
        project: Project = fetch_one(Project, {"id": project_id})
        check_is_member(Project, project, current_user)
        return project

    @projects_ns.expect(project_creation_input)
    def put(self, project_id: str):
        project: Project = fetch_one(Project, {"id": project_id})
        # Or should be check_project_creator
        check_is_member(Project, project, current_user)
        # todo: check if user has manage course permission
        project.update(project_data=projects_ns.payload)
        return update_db_object(Project, project)

    def delete(self, project_id: str):
        project: Project = fetch_one(Project, {"id": project_id})
        check_is_member(Project, project, current_user)
        # check if user has permission to delete project
        db.session.delete(project)
        db.session.commit()
        return {}, 200


@projects_ns.route("/<string:project_id>/tasks")
class ProjectTasks(Resource):
    method_decorators = [jwt_required()]

    @projects_ns.marshal_list_with(task_fetch_all_output)
    def get(self, project_id: str):
        project: Project = fetch_one(Project, {"id": project_id})
        check_is_member(Project, project, current_user)
        tasks: list[Task] = fetch_all(Task)
        return [tsk for tsk in tasks if tsk.project_id == project_id]
