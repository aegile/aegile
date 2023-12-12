from flask import Blueprint
from src.extensions import db
from src.models.permission import Role, Permission

permissions = Blueprint("permissions", __name__)


@permissions.route("/c/<course_code>/roles/new", methods=["POST"])
def create_new_role(course_code: str):
    """Creates a new role object tied to a course.
    No permissions are initially set.

    Args:
        course_code (str): the course the role is to be active in
    """
    new_role = Role(name="new role", course=course_code)
    db.session.add(new_role)
    db.session.commit()

    return "Created new role!"


@permissions.route("/c/<course_code>/roles/rename/<role_id>/<name>", methods=["PUT"])
def rename_role(course_code: str, role_id: str, name: str):
    """Renames a role object.

    Args:
        course_code (str): the course the role is to be active in
        role_id (str): the id of the role to be renamed
    """

    role = db.session.execute(
        db.select(Role).filter_by(id=role_id, course=course_code)
    ).scalar_one()

    role.name = name
    db.session.commit()

    return "Renamed role!"


def enable_permission_on_role(role_id: str, permission_type: str):
    # insert directly into table
    pass
