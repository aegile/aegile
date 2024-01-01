from flask_restx import Resource, Namespace
from ..error import AuthError
from ..extensions import db
from ..models.user import User
from ..api_models.user_models import user_fetch_output


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
        db.session.add(new_user)
        db.session.commit()
        return "<p>Happy New Year!</p>"

@auth_ns.route("/users")
class Test(Resource):
    @auth_ns.marshal_list_with(user_fetch_output)
    def get(self):
        users = db.session.scalars(db.select(User)).all()
        return users