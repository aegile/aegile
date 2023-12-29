from flask import Blueprint, request
from flask_restx import Resource, Namespace
from flask_jwt_extended import jwt_required, current_user

from src.extensions import db
from src.models.group import Group
from src.models.project import Project, project_new_model
from src.models.task import Task
from src.models.user import User, UserSet
from ..api_models.project_models import (
    project_fetch_all_output,
    project_fetch_one_output,
    project_creation_input,
    project_edit_input,
    project_members_fetch_output,
)
from ..api_models.task_models import task_fetch_all_output

from .helpers import (
    fetch_one,
    fetch_all,
    update_db_object,
    add_db_object,
)
from .access_checks import check_is_member, check_project_creator

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
        return [prj for prj in projects if current_user in prj.members]

    @projects_ns.expect(project_creation_input)
    def post(self):
        # Check user is a member of group or is the tutorial's tutor
        group: Group = fetch_one(Group, {"id": projects_ns.payload["group_id"]})
        check_is_member(Group, group, current_user)
        new_project = Project(
            course_id=projects_ns.payload["course_id"],
            group_id=projects_ns.payload["group_id"],
            name=projects_ns.payload["name"],
            creator=current_user,
            subheading=projects_ns.payload.get("subheading"),
            description=projects_ns.payload.get("description"),
            end_date=projects_ns.payload.get("end_date"),
        )
        add_db_object(Project, new_project, new_project.name)
        new_project.add_members(members=group.members)
        return {}, 201


@projects_ns.route("/<string:project_id>")
class ProjectSpecific(Resource):
    method_decorators = [jwt_required()]

    @projects_ns.marshal_with(project_fetch_one_output)
    def get(self, project_id: str):
        project: Project = fetch_one(Project, {"id": project_id})
        check_is_member(Project, project, current_user)
        return project

    @projects_ns.expect(project_edit_input)
    def put(self, project_id: str):
        project: Project = fetch_one(Project, {"id": project_id})
        # Check user is project creator or tutorial tutor
        check_project_creator(project, current_user)
        project.update(project_data=projects_ns.payload)
        return update_db_object(Project, project)

    def delete(self, project_id: str):
        project: Project = fetch_one(Project, {"id": project_id})
        # Check user is project creator or tutorial tutor
        check_project_creator(project, current_user)
        db.session.delete(project)
        db.session.commit()
        return {}, 200


@projects_ns.route("/<string:project_id>/members")
class ProjectMembers(Resource):
    method_decorators = [jwt_required()]

    @projects_ns.expect(project_members_fetch_output)
    def get(self, project_id: str):
        project: Project = fetch_one(Project, {"id": project_id})
        check_is_member(Project, project, current_user)
        return project.members

    # Leave this commented out for now in case a route is needed, but joining a
    # group should automatically add the member into all the group's projects
    # @projects_ns.marshal_list_with()
    # def post(self, project_id: str):
    #     project: Project = fetch_one(Project, {"id": project_id})
    #     check_is_member(Project, project, current_user)
    #     project.add_members(projects_ns.payload["members"])
    #     return {}, 201


@projects_ns.route("/<string:project_id>/tasks")
class ProjectTasks(Resource):
    method_decorators = [jwt_required()]

    @projects_ns.marshal_list_with(task_fetch_all_output)
    def get(self, project_id: str):
        project: Project = fetch_one(Project, {"id": project_id})
        check_is_member(Project, project, current_user)
        tasks: list[Task] = fetch_all(Task)
        return [tsk for tsk in tasks if tsk.project_id == project_id]
