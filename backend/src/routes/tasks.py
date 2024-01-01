from flask import Blueprint, request

from src.extensions import db
from src.models.task import Task
from src.models.user import User, UserSet

from .helpers import fetch_one_by_id

tasks = Blueprint("tasks", __name__)


@tasks.route("/p/<project_id>/t", methods=["POST"])
def create_new_task(project_id: str):
    data = request.get_json()
    new_task: Task = Task(name=data["task_name"], project_id=project_id)
    db.session.add(new_task)

    db.session.commit()

    return f"Created new task {new_task.name}"


@tasks.route("/t/<task_id>/assign", methods=["PUT"])
def add_task_assignees(task_id: str):
    data = request.get_json()
    project: Task = fetch_one_by_id(Task, task_id, f"Task ID {task_id} not found")
    userset: UserSet = project.userset

    userset.members = [
        fetch_one_by_id(User, user_id, f"User ID {user_id} not found")
        for user_id in data["user_ids"]
    ]

    db.session.commit()
    return f"Assigned {', '.join([mem.first_name for mem in userset.members])} to task"


@tasks.route("/p/<project_id>/t", methods=["GET"])
def fetch_all_tasks(project_id: str):
    tasks: list[Task] = db.session.execute(
        db.select(Task).filter_by(project_id=project_id)
    ).scalars()

    return f"Fetched {', '.join([t.name for t in tasks])}"
