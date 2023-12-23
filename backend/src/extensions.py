from flask_sqlalchemy import SQLAlchemy
from flask_restx import Api
from flask_jwt_extended import JWTManager

AUTH_NAME = "jsonWebToken"

authorizations = {
    AUTH_NAME: {
        "type": "apiKey",
        "in": "header",
        "name": "Authorization",
        "bearerFormat": "JWT",
    }
}
api = Api(validate=True, authorizations=authorizations, security=AUTH_NAME)
db = SQLAlchemy()
jwt = JWTManager()
