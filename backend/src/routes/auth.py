from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from ..error import InputError
from flask_restx import Resource, Namespace
from ..extensions import db
from ..models.user import User, user_fetch_output, user_creation_input, user_login_input
from .helpers import fetch_one, add_db_object

auth_api = Namespace("v1/auth", description="Authorization related operations")


@auth_api.route("/register")
class Register(Resource):
    @auth_api.expect(user_creation_input)
    @auth_api.marshal_with(user_fetch_output)
    def post(self):
        new_user = User(
            email=auth_api.payload["email"],
            password=generate_password_hash(auth_api.payload["password"]),
            first_name=auth_api.payload["first_name"],
            last_name=auth_api.payload["last_name"],
        )
        return add_db_object(User, new_user, new_user.email)


@auth_api.route("/login")
class Login(Resource):
    @auth_api.expect(user_login_input)
    def post(self):
        user: User = fetch_one(User, {"email": auth_api.payload["email"]})
        if not check_password_hash(user.password, auth_api.payload["password"]):
            raise InputError("Incorrect password.")
        return {"access_token": create_access_token(user.handle)}
