from flask_restx import Resource, Namespace
from flask_jwt_extended import jwt_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from datetime import datetime, timedelta

from ..error import AuthError
from ..extensions import db
from ..models.user import User
from ..api_models.user_models import (
    user_creation_input,
    user_login_input,
    user_fetch_output,
)
from ..handlers.events import trigger_event
from .helpers import fetch_one, add_db_object

auth_ns = Namespace("api/v1/auth", description="Authorization related operations")


@auth_ns.route("/test")
class Test(Resource):
    def get(self):
        new_user = User(
            email="alex@email.com",
            password="AlexXu123!",
            first_name="Alex",
            last_name="Xu",
        )
        add_db_object(User, new_user, new_user.email)
        return "<p>Happy New Year!</p>"


@auth_ns.route("/users")
class Users(Resource):
    @auth_ns.marshal_list_with(user_fetch_output)
    def get(self):
        users = db.session.scalars(db.select(User)).all()
        return users


@auth_ns.route("/register")
class Register(Resource):
    @auth_ns.expect(user_creation_input)
    def post(self):
        new_user = User(
            email=auth_ns.payload["email"],
            password=generate_password_hash(auth_ns.payload["password"]),
            first_name=auth_ns.payload["first_name"],
            last_name=auth_ns.payload["last_name"],
        )
        res = add_db_object(User, new_user, new_user.email)
        return res


@auth_ns.route("/login")
class Login(Resource):
    @auth_ns.expect(user_login_input)
    def post(self):
        user: User = fetch_one(User, {"email": auth_ns.payload["email"]})
        if not check_password_hash(user.password, auth_ns.payload["password"]):
            trigger_event("event_user_login_fail", user)
            raise AuthError("Incorrect password.")
        trigger_event("event_user_login_success", user)

        user.last_login = datetime.utcnow().isoformat()
        db.session.commit()
        return {"access_token": create_access_token(user)}


@auth_ns.route("/check")
class Login(Resource):
    method_decorators = [jwt_required()]

    def get(self):
        # raises error if token is invalid
        user: User = fetch_one(User, {"id": current_user.id})
        last_login = datetime.fromisoformat(user.last_login)
        print(last_login, datetime.utcnow() - last_login)
        if (datetime.utcnow() - last_login) > timedelta(days=3):
            raise AuthError("Token expired.")
        return {}, 200
