import logging
from json import dumps, load
from flask import Flask
from flask_cors import CORS
from .extensions import api, db
from .routes.courses import courses_api
from .routes.permissions import permissions
from .routes.users import users_api
from .routes.projects import projects, projects_api
from .routes.tasks import tasks

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

    api.init_app(app)
    db.init_app(app)

    # app.register_blueprint(permissions)
    # app.register_blueprint(projects)
    # app.register_blueprint(tasks)

    api.add_namespace(users_api)
    api.add_namespace(courses_api)
    api.add_namespace(projects_api)

    return app
