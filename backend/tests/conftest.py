import pytest
from flask import Flask
from src import create_app
from src.extensions import db


# @pytest.fixture(scope="module")
# def test_app():
#     app = Flask(__name__)
#     app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
#     app.config["TESTING"] = True
#     db.init_app(app)
#     return app


@pytest.fixture(scope="module")
def test_app():
    app = create_app()
    from src.models.user import User, UserSet

    app.config.update({"TESTING": True})
    app.config.update({"SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:"})
    return app


@pytest.fixture(scope="function")
def client(test_app):
    with test_app.app_context():
        db.create_all()
        yield test_app.test_client()
        db.session.remove()
        db.drop_all()


@pytest.fixture(scope="function")
def test_db(test_app):
    with test_app.app_context():
        db.create_all()
        yield db
        db.session.remove()
        db.drop_all()


@pytest.fixture()
def users_setup(client):
    user_registration_data = [
        {
            "first_name": "Alex",
            "last_name": "Xu",
            "email": "alex@email.com",
            "password": "AlexXu123!",
        },
        {
            "first_name": "Sam",
            "last_name": "Yu",
            "email": "sam@email.com",
            "password": "SamYu123!",
        },
        {
            "first_name": "Philip",
            "last_name": "Tran",
            "email": "philip@email.com",
            "password": "PhilipTran123!",
        },
    ]
    for user_form in user_registration_data:
        client.post("v1/auth/register", json=user_form)
    response = client.post(
        "v1/auth/login",
        json={"email": "alex@email.com", "password": "AlexXu123!"},
    )
    headers = {"Authorization": f"Bearer {response.json["access_token"]}"}
    response = client.get("v1/users", headers=headers)
    return [user for user in response.json]

@pytest.fixture
def auth_headers(client):
    # NOTE: any fixture that returns from v1/users will have John Smith included
    client.post("v1/auth/register", json={
        "first_name": "John",
        "last_name": "Smith",
        "email": "john@email.com",
        "password": "JohnSmith123!",
    })
    response = client.post(
        "v1/auth/login",
        json={"email": "john@email.com", "password": "JohnSmith123!"},
    )

    token = response.json['access_token']

    return {'Authorization': f'Bearer {token}'}


@pytest.fixture
def auth_client(client, auth_headers):
    class AuthClient:
        def __init__(self, client, headers):
            self._client = client
            self._headers = headers

        def get(self, url, **kwargs):
            return self._client.get(url, headers=self._headers, **kwargs)

        def post(self, url, **kwargs):
            return self._client.post(url, headers=self._headers, **kwargs)

        def put(self, url, **kwargs):
            return self._client.put(url, headers=self._headers, **kwargs)

        def delete(self, url, **kwargs):
            return self._client.delete(url, headers=self._headers, **kwargs)

    return AuthClient(client, auth_headers)
