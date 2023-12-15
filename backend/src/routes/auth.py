from flask_restx import Resource, Namespace
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

from ..error import InputError

from ..models.user import User
from ..api_models.user_models import user_creation_input, user_login_input

from .helpers import fetch_one, add_db_object

auth_ns = Namespace("v1/auth", description="Authorization related operations")


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
        return add_db_object(User, new_user, new_user.email)


@auth_ns.route("/login")
class Login(Resource):
    @auth_ns.expect(user_login_input)
    def post(self):
        user: User = fetch_one(User, {"email": auth_ns.payload["email"]})
        if not check_password_hash(user.password, auth_ns.payload["password"]):
            raise InputError("Incorrect password.")
        return {"access_token": create_access_token(user.handle)}
