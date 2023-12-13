from sqlalchemy.exc import IntegrityError
from ..error import InputError
from flask_restx import Resource, Namespace
from flask_jwt_extended import jwt_required
from ..extensions import db
from ..models.user import User
from ..api_models.user_api import (
    user_fetch_output,
    user_creation_input,
    user_update_input,
)

from .helpers import (
    fetch_one,
    add_db_object,
    update_db_object,
    authorizations,
    AUTH_NAME,
)


users_api = Namespace(
    "v1/users",
    description="User related operations",
    authorizations=authorizations,
)


@users_api.route("")
class UserCoreAPI(Resource):
    method_decorators = [jwt_required()]

    @users_api.doc(security=AUTH_NAME)
    @users_api.marshal_list_with(user_fetch_output)
    def get(self):
        return User.query.all()

    @users_api.doc(security=AUTH_NAME)
    @users_api.expect(user_creation_input)
    def post(self):
        new_user = User(
            first_name=users_api.payload["first_name"],
            last_name=users_api.payload["last_name"],
            email=users_api.payload["email"],
            password=users_api.payload["password"],
        )
        return add_db_object(User, new_user, new_user.email)


@users_api.route("/<string:user_handle>")
class CourseWithCodeAPI(Resource):
    @users_api.marshal_with(user_fetch_output)
    def get(self, user_handle: str):
        return fetch_one(User, {"handle": user_handle})

    @users_api.expect(user_update_input)
    def put(self, user_handle: str):
        user: User = fetch_one(User, {"handle": user_handle})
        if not user:
            raise InputError(f"User {user_handle} not found")
        user.update(profile_data=users_api.payload)
        return update_db_object(User, user.email)

    def delete(self, user_handle: str):
        user: User = fetch_one(User, {"handle": user_handle})
        db.session.delete(user)
        db.session.commit()
        return {}, 200
