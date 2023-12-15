import logging
from json import dumps, load
from flask import Flask
from flask_cors import CORS
from .extensions import api, db, jwt
from .routes.auth import auth_ns
from .routes.courses import courses_ns
from .routes.roles import roles_ns
from .routes.users import users_ns
from .routes.tutorials import tuts_ns
from .routes.groups import groups_ns
from .routes.projects import projects, projects_ns
from .routes.tasks import tasks
from .config import SECRET_KEY

# log = logging.getLogger("werkzeug")
# log.setLevel(logging.ERROR)


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


def create_app():
    app = Flask(__name__)

    # app = Flask(__name__, static_url_path="/static/")
    CORS(app)

    # app.config["TRAP_HTTP_EXCEPTIONS"] = True
    app.register_error_handler(Exception, defaultHandler)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///test.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = SECRET_KEY

    api.init_app(app)
    db.init_app(app)
    jwt.init_app(app)

    # app.register_blueprint(permissions)
    # app.register_blueprint(projects)
    # app.register_blueprint(tasks)

    api.add_namespace(auth_ns)
    api.add_namespace(users_ns)
    api.add_namespace(roles_ns)
    api.add_namespace(courses_ns)
    api.add_namespace(tuts_ns)
    api.add_namespace(groups_ns)
    api.add_namespace(projects_ns)

    return app
