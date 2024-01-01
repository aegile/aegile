import os
from sqlalchemy import event
from sqlalchemy.engine import Engine
from sqlite3 import Connection as SQLite3Connection
from json import dumps, load
from flask import Flask
from .extensions import api, db
from .models.user import User 
from .routes.auth import auth_ns

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

    app = Flask(__name__)
    # app = Flask(__name__, static_url_path="/static/")
    # CORS(app)

    # app.config["TRAP_HTTP_EXCEPTIONS"] = True
    app.register_error_handler(Exception, defaultHandler)
    # app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///test.db"
    app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    # app.config["JWT_SECRET_KEY"] = os.environ.get("SECRET_KEY")

    api.init_app(app)
    db.init_app(app)

    # app.register_blueprint(permissions)
    # app.register_blueprint(projects)
    # app.register_blueprint(tasks)

    api.add_namespace(auth_ns)

    return app
