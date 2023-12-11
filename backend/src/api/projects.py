from flask import Blueprint, request

from src.extensions import db
from src.models.project import Project
from src.models.user import User, UserSet

from .helpers import fetch_one_by_id

projects = Blueprint("projects", __name__)


@projects.route("/p/new/<project_name>", methods=["POST"])
def create_new_project(project_name: str):
    new_project: Project = Project(name=project_name)
    db.session.add(new_project)

    db.session.commit()

    return "Created new project"


@projects.route("/p/<project_id>/assign", methods=["PUT"])
def add_project_members(project_id: str):
    project: Project = fetch_one_by_id(Project, project_id, "Project not found")
    userset: UserSet = project.userset

    userset.members = [
        fetch_one_by_id(User, user_id, f"User ID {user_id} not found")
        for user_id in request.get_json()["user_ids"]
    ]

    db.session.commit()
    return f"Added {', '.join([mem.first_name for mem in userset.members])} users to project"
