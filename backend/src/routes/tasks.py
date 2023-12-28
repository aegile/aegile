from flask import Blueprint, request
from flask_restx import Resource, Namespace
from flask_jwt_extended import jwt_required, current_user

from src.extensions import db
from src.models.project import Project
from src.models.task import Task
from src.models.user import User, UserSet

from .helpers import (
    fetch_one_by_id,
    fetch_one,
    fetch_all,
    update_db_object,
    add_db_object,
)
from .access_checks import check_is_member

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
        # Change get_assignees() to become an @property
        return [tsk for tsk in tasks if current_user in tsk.get_assignees()]

    @tasks_ns.expect(task_creation_input)
    def post(self):
        new_task = Task(
            name=tasks_ns.payload["name"],
            project_id=tasks_ns.payload["project_id"],
            creator=current_user,
            status=tasks_ns.payload["status"],
            description=tasks_ns.payload["description"],
            deadline=tasks_ns.payload["deadline"],
            weighting=tasks_ns.payload["weighting"],
            priority=tasks_ns.payload["priority"],
            attachment=tasks_ns.payload["attachment"],
        )
        add_db_object(Task, new_task, new_task.name)
        new_task.add_assignees(assignees=[current_user])
        return {}, 201


@tasks_ns.route("/<string:task_id>")
class TaskSpecific(Resource):
    method_decorators = [jwt_required()]

    @tasks_ns.marshal_with(task_fetch_one_output)
    def get(self, task_id: str):
        task: Task = fetch_one(Task, {"id": task_id})
        project: Project = fetch_one(Project, {"id": task.project_id})
        # Should user be a member of project or be assigned the task to be able
        # to fetch the task?
        check_is_member(Project, project, current_user)
        return task

    @tasks_ns.expect(task_creation_input)
    def put(self, task_id: str):
        task: Task = fetch_one(Task, {"id": task_id})
        # Will restrict editing tasks to the task creator and assigned members
        # check_can_edit_task()...
        task.update(task_data=tasks_ns.payload)
        return update_db_object(Task, task)

    def delete(self, task_id: str):
        task: Task = fetch_one(Task, {"id": task_id})
        # Check if user is task creator or assigned member to delete
        # check_can_edit_task()
        db.session.delete(task)
        db.session.commit()
        return {}, 200


@tasks_ns.route("/<string:task_id>/assignees")
class TaskAssignees(Resource):
    method_decorators = [jwt_required()]

    @tasks_ns.marshal_with(task_assignees_fetch_output)
    def get(self, task_id: str):
        task: Task = fetch_one(Task, {"id": task_id})
        # Check if user is in the group/project
        # check_can_edit_task()
        return task

    @tasks_ns.expect(task_assignees_input)
    def post(self, task_id: str):
        task: Task = fetch_one(Task, {"id": task_id})
        # Check if user is in project/group
        # check_can_edit_task()
        # Assuming payload contains a list of Users
        task.add_assignees(assignees=tasks_ns.payload["assignees"])
        return {}, 201
