from flask import Blueprint, request
from flask_restx import Resource, Namespace
from flask_jwt_extended import jwt_required, current_user

from src.extensions import db
from src.models.project import Project
from src.models.task import Task
from src.models.user import User, UserSet
from ..api_models.task_models import (
    task_fetch_all_output,
    task_fetch_one_output,
    task_creation_input,
    task_members_fetch_output,
    task_members_input,
    task_edit_input,
)

from .helpers import (
    fetch_one,
    fetch_all,
    update_db_object,
    add_db_object,
)
from .access_checks import (
    check_task_view_access,
    check_task_edit_access,
)

# tasks = Blueprint("tasks", __name__)

tasks_ns = Namespace("v1/tasks", description="Tasks related operations")


# @tasks.route("/p/<project_id>/t", methods=["POST"])
# def create_new_task(project_id: str):
#     data = request.get_json()
#     new_task: Task = Task(name=data["task_name"], project_id=project_id)
#     db.session.add(new_task)

#     db.session.commit()

#     return f"Created new task {new_task.name}"


# @tasks.route("/t/<task_id>/assign", methods=["PUT"])
# def add_task_assignees(task_id: str):
#     data = request.get_json()
#     project: Task = fetch_one_by_id(Task, task_id, f"Task ID {task_id} not found")
#     userset: UserSet = project.userset

#     userset.members = [
#         fetch_one_by_id(User, user_id, f"User ID {user_id} not found")
#         for user_id in data["user_ids"]
#     ]

#     db.session.commit()
#     return f"Assigned {", ".join([mem.first_name for mem in userset.members])} to task"


# @tasks.route("/p/<project_id>/t", methods=["GET"])
# def fetch_all_tasks(project_id: str):
#     tasks: list[Task] = db.session.execute(
#         db.select(Task).filter_by(project_id=project_id)
#     ).scalars()

#     return f"Fetched {', '.join([t.name for t in tasks])}"


@tasks_ns.route("")
class TaskGeneral(Resource):
    method_decorators = [jwt_required()]

    @tasks_ns.marshal_list_with(task_fetch_all_output)
    def get(self):
        tasks: list[Task] = fetch_all(Task)
        return [tsk for tsk in tasks if current_user in tsk.members]

    @tasks_ns.expect(task_creation_input)
    def post(self):
        project: Project = fetch_one(Project, {"id": tasks_ns.payload["project_id"]})
        # Only project members and tutors/lic can create new tasks in a project
        check_task_view_access(project, current_user)
        new_task = Task(
            name=tasks_ns.payload["name"],
            project_id=tasks_ns.payload["project_id"],
            creator=current_user,
            status=tasks_ns.payload["status"],
            description=tasks_ns.payload.get("description"),
            deadline=tasks_ns.payload.get("deadline"),
            weighting=tasks_ns.payload.get("weighting"),
            priority=tasks_ns.payload.get("priority"),
            attachment=tasks_ns.payload.get("attachment"),
        )
        add_db_object(Task, new_task, new_task.name)
        new_task.add_members(members=[current_user])
        return {}, 201


@tasks_ns.route("/<string:task_id>")
class TaskSpecific(Resource):
    method_decorators = [jwt_required()]

    @tasks_ns.marshal_with(task_fetch_one_output)
    def get(self, task_id: str):
        task: Task = fetch_one(Task, {"id": task_id})
        project: Project = fetch_one(Project, {"id": task.project_id})
        check_task_view_access(project, current_user)
        return task

    @tasks_ns.expect(task_edit_input)
    def put(self, task_id: str):
        task: Task = fetch_one(Task, {"id": task_id})
        # Checks if user is the task creator or has permissions to manage tasks
        check_task_edit_access(task, current_user, task.project.course_id)
        task.update(task_data=tasks_ns.payload)
        return update_db_object(Task, task)

    def delete(self, task_id: str):
        task: Task = fetch_one(Task, {"id": task_id})
        check_task_edit_access(task, current_user, task.project.course_id)
        db.session.delete(task)
        db.session.commit()
        return {}, 200


@tasks_ns.route("/<string:task_id>/members")
class TaskMembers(Resource):
    method_decorators = [jwt_required()]

    @tasks_ns.marshal_with(task_members_fetch_output)
    def get(self, task_id: str):
        task: Task = fetch_one(Task, {"id": task_id})
        project: Project = fetch_one(Project, {"id": task.project_id})
        # Check if user is in the project
        check_task_view_access(project, current_user)
        return task.members

    @tasks_ns.expect(task_members_input)
    def post(self, task_id: str):
        task: Task = fetch_one(Task, {"id": task_id})
        check_task_edit_access(task, current_user, task.project.course_id)
        # Assuming payload contains a list of Users
        task.add_members(members=tasks_ns.payload["members"])
        return {}, 201
