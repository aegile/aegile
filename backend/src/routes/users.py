from flask import Blueprint, request
from src.extensions import db
from src.models.user import User, UserSet
from .helpers import fetch_one_by_id

users = Blueprint("users", __name__)


@users.route("/u/new/<first_name>-<last_name>", methods=["POST"])
def create_new_user(first_name: str, last_name: str):
    new_user = User(first_name=first_name, last_name=last_name)
    db.session.add(new_user)
    db.session.commit()

    return f"Created new user {first_name} {last_name}"


@users.route("/us/new", methods=["POST"])
def create_new_user_set():
    new_user_set = UserSet()
    db.session.add(new_user_set)
    db.session.commit()

    return f"Created new UserSet {new_user_set.id}"


@users.route("/us/<userset_id>/add", methods=["PUT"])
def add_user_set_member(userset_id: str):
    userset: UserSet = fetch_one_by_id(UserSet, userset_id, "User set not found")
    if userset is None:
        return f"User set {userset_id} not found"

    userset.members = [
        fetch_one_by_id(User, user_id, f"User ID {user_id} not found")
        for user_id in request.get_json()["user_ids"]
    ]
    db.session.commit()

    return f"Added all users to UserSet {userset_id}"
