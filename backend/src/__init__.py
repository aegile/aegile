import logging
from json import dumps, load
from flask import Flask
from flask_cors import CORS
from .extensions import db
from .api.courses import courses
from .api.permissions import permissions
from .api.users import users
from .api.projects import projects
from .api.tasks import tasks

log = logging.getLogger("werkzeug")
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

    app.config["TRAP_HTTP_EXCEPTIONS"] = True
    app.register_error_handler(Exception, defaultHandler)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///test.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    app.register_blueprint(courses)
    app.register_blueprint(permissions)
    app.register_blueprint(users)
    app.register_blueprint(projects)
    app.register_blueprint(tasks)

    return app
