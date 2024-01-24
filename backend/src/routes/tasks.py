from flask import Blueprint, request
from flask_restx import Resource, Namespace
from flask_jwt_extended import jwt_required, current_user

from ..extensions import db
from ..models.project import Project
from ..models.task import Task
from ..models.user import User, UserSet
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
    check_is_member,
)


tasks_ns = Namespace("api/v1/tasks", description="Tasks related operations")


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
        return {}, 201


@tasks_ns.route("/<string:task_id>")
class TaskSpecific(Resource):
    method_decorators = [jwt_required()]

    @tasks_ns.marshal_with(task_fetch_one_output)
    def get(self, task_id: str):
        task: Task = fetch_one(Task, {"id": task_id})
        check_task_view_access(task.project, current_user)
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
        # Check if user is in the project
        check_task_view_access(task.project, current_user)
        return task

    @tasks_ns.expect(task_members_input)
    def post(self, task_id: str):
        task: Task = fetch_one(Task, {"id": task_id})
        check_task_edit_access(task, current_user, task.project.course_id)
        # Assuming payload contains a list of User handles
        users = [
            fetch_one(User, {"handle": handle})
            for handle in tasks_ns.payload["members"]
        ]
        # Checking that all task assignees are members of the project
        for user in users:
            check_is_member(Project, task.project, user, is_auth_user=False)
        task.set_members(members=users)
        return {}, 201


@tasks_ns.route("/prj/<string:project_id>")
class TaskProjectSpecific(Resource):
    method_decorators = [jwt_required()]

    @tasks_ns.marshal_list_with(task_fetch_all_output)
    def get(self, project_id: str):
        project: Project = fetch_one(Project, {"id": project_id})
        # Only project members and tutors can view the project tasks
        check_task_view_access(project, current_user)
        return project.tasks
