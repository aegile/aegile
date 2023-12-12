from sqlalchemy.exc import IntegrityError
from ..error import InputError
from flask import Blueprint, request
from flask_restx import Resource, Namespace
from src.extensions import db
from src.models.user import (
    User,
    UserSet,
    user_fetch_output,
    user_creation_input,
    user_update_input,
)
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


users_api = Namespace("v1/users", description="User related operations")


@users_api.route("")
class UserCoreAPI(Resource):
    @users_api.marshal_list_with(user_fetch_output)
    def get(self):
        return User.query.all()

    @users_api.expect(user_creation_input)
    def post(self):
        new_user = User(
            first_name=users_api.payload["first_name"],
            last_name=users_api.payload["last_name"],
            email=users_api.payload["email"],
            password=users_api.payload["password"],
        )
        try:
            db.session.add(new_user)
            db.session.commit()
            return {"handle": new_user.handle}, 201
        except IntegrityError as exc:
            db.session.rollback()
            raise InputError("ERROR: Email already in use.") from exc


@users_api.route("/<string:user_handle>")
class CourseWithCodeAPI(Resource):
    @users_api.marshal_with(user_fetch_output)
    def get(self, user_handle: str):
        return User.query.filter_by(handle=user_handle).first()

    @users_api.expect(user_update_input)
    def put(self, user_handle: str):
        user: User = User.query.filter_by(handle=user_handle).first()
        if not user:
            raise InputError(f"ERROR: User {user_handle} not found")
        user.update(profile_data=users_api.payload)

        try:
            db.session.commit()
            return {}, 200
        except IntegrityError as exc:
            db.session.rollback()
            raise InputError("ERROR: Email already in use.") from exc

    def delete(self, user_handle: str):
        user: User = User.query.filter_by(handle=user_handle).first()
        if not user:
            raise InputError(f"ERROR: User {user_handle} not found")
        db.session.delete(user)
        db.session.commit()
        return {}, 200
