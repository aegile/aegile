import os
import logging

# from dotenv import load_dotenv
from sqlalchemy import event
from sqlalchemy.engine import Engine
from sqlite3 import Connection as SQLite3Connection
from json import dumps, load
from flask import Flask, jsonify
from flask_cors import CORS
from jwt.exceptions import ExpiredSignatureError, DecodeError
from flask_jwt_extended.exceptions import UserLookupError

from .error import AuthError
from .extensions import api, db, jwt
from .models.user import User
from .routes.auth import auth_ns
from .routes.courses import courses_ns
from .routes.deliverables import deliverables_ns
from .routes.roles import roles_ns
from .routes.users import users_ns
from .routes.tutorials import tuts_ns
from .routes.groups import groups_ns
from .routes.projects import projects, projects_ns
from .routes.tasks import tasks
from .handlers.log_handler import setup_log_handlers

log = logging.getLogger("werkzeug")
log.setLevel(logging.INFO)
# file_handler = logging.FileHandler("test.log")
# stream_handler = logging.StreamHandler()
# if not log.handlers:
#     log.addHandler(file_handler)
#     log.addHandler(stream_handler)

# load_dotenv(".env.local")


def defaultHandler(err):
    response = err.get_response()
    response.data = dumps(
        {
            "code": err.code,
            "name": "System Error",
            "message": err.get_description(),
        }
    )
    response.content_type = "application/json"
    return response


@event.listens_for(Engine, "connect")
def _set_sqlite_pragma(dbapi_connection, connection_record):
    if isinstance(dbapi_connection, SQLite3Connection):
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON;")
        cursor.close()


def create_app():
    setup_log_handlers()

    app = Flask(__name__)
    app.logger.handlers.clear()
    # app = Flask(__name__, static_url_path="/static/")
    CORS(app)

    # app.config["TRAP_HTTP_EXCEPTIONS"] = True
    app.register_error_handler(Exception, defaultHandler)
    # app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///test.db"
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("POSTGRES_URL").replace(
        "postgres://", "postgresql://", 1
    )

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.environ.get("SECRET_KEY")
    app.config["PROPAGATE_EXCEPTIONS"] = True

    api.init_app(app)
    db.init_app(app)
    jwt.init_app(app)

    api.add_namespace(auth_ns)
    api.add_namespace(users_ns)
    api.add_namespace(roles_ns)
    api.add_namespace(courses_ns)
    api.add_namespace(deliverables_ns)
    api.add_namespace(tuts_ns)
    api.add_namespace(groups_ns)
    api.add_namespace(projects_ns)

    @jwt.user_identity_loader
    def user_identity_lookup(user):
        try:
            return user.id
        except UserLookupError:
            raise AuthError("Access token of unknown user. Please login again.")

    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        try:
            identity = jwt_data["sub"]
            return User.query.filter_by(id=identity).first()
        except ExpiredSignatureError:
            raise AuthError("Access token has expired. Please login again.")
        except DecodeError:
            raise AuthError("Access token is invalid. Please login again.")
        except UserLookupError:
            raise AuthError("Access token of unknown user. Please login again.")

    @jwt.expired_token_loader
    def my_expired_token_callback(jwt_header, jwt_data):
        token_type = jwt_data["type"]
        return (
            jsonify(
                {
                    "status": 401,
                    "sub_status": 42,
                    "msg": "The token has expired".format(token_type),
                }
            ),
            401,
        )

    # @jwt.user_loader_error_loader
    # def my_invalid_user_token_callback(token):
    #     return (
    #         jsonify(
    #             {
    #                 "status": 401,
    #                 "sub_status": 42,
    #                 "msg": "Unknown user associated with this token.",
    #             }
    #         ),
    #         401,
    #     )

    # @jwt.invalid_token_loader()
    # def my_invalid_token_callback(token):
    #     return (
    #         jsonify(
    #             {
    #                 "status": 401,
    #                 "sub_status": 42,
    #                 "msg": "Token is of invalid format.",
    #             }
    #         ),
    #         401,
    #     )

    return app
