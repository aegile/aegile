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


@pytest.fixture(scope="module")
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


# TODO: The logic behind these setup fixtures is to provide convenience
# for the next tier of tests. For example:
# - users_setup → courses_tests
# - courses_setup → tutorials_tests
# - tutorials_setup → groups_tests
# - groups_setup → projects_tests
# etc...


@pytest.fixture(scope="module", autouse=True)
def users_setup(client):
    user_registration_data = [
        {
            "first_name": "John",
            "last_name": "Smith",
            "email": "john@email.com",
            "password": "JohnSmith123!",
        },
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


@pytest.fixture(scope="function")
def users_fetch(auth_client):
    response = auth_client.get("v1/users")
    return {user["email"]: user for user in response.json}


@pytest.fixture(scope="module", autouse=True)
def courses_setup(auth_client):
    course_creation_data = [
        {
            "term": "23T2",
            "code": "COMP1511",
            "name": "Programming Fundamentals",
            "description": "The intro course for Computer Science",
        },
        {
            "term": "23T2",
            "code": "COMP2511",
            "name": "Object-Oriented Design & Programming",
            "description": "",
        },
        {
            "term": "23T2",
            "code": "COMP6080",
            "name": "Web Front-End Programming",
            "description": "",
        },
    ]
    for course_form in course_creation_data:
        auth_client.post("v1/courses", json=course_form)


@pytest.fixture(scope="function")
def courses_fetch(auth_client):
    response = auth_client.get("v1/courses")
    return {f"{course['term']}{course['code']}": course for course in response.json}


@pytest.fixture(scope="module", autouse=True)
def roles_setup(auth_client):
    response = auth_client.get("v1/courses")
    # Creates a default role Student for all courses
    for course in response.json:
        auth_client.post(
            f"v1/roles/course/{course['id']}",
            json={"name": "Student"},
        )
        auth_client.post(
            f"v1/roles/course/{course['id']}",
            json={"name": "Tutor"},
        )
        auth_client.post(
            f"v1/roles/course/{course['id']}",
            json={"name": "Admin"},
        )

    return courses_setup


@pytest.fixture(scope="function")
def roles_fetch(auth_client, courses_fetch):
    comp1511 = courses_fetch["23T2COMP1511"]
    response = auth_client.get(f"v1/roles/course/{comp1511['id']}")
    return {f"{role['name']}": role for role in response.json}


@pytest.fixture()
def roles_assignment(auth_client, users_setup, roles_setup):
    comp1511 = next(crs for crs in roles_setup if crs["code"] == "COMP1511")
    userAlex = next(user for user in users_setup if user["email"] == "alex@email.com")
    auth_client.post(
        f"v1/courses/{comp1511['id']}/enroll",
        json={
            "members": [userAlex["handle"]],
        },
    )

    response = auth_client.get(f"v1/roles/course/{comp1511['id']}")
    tutor_role = next(
        (role for role in response.json if role["name"] == "Tutor"),
        None,
    )
    auth_client.put(
        f"v1/roles/{tutor_role['id']}",
        json={
            "name": "",
            "color": "#ffffff",
            "permissions": ["can_manage_roles"],
        },
    )

    response = auth_client.put(
        f"v1/roles/{tutor_role['id']}/user/{userAlex['id']}/assign"
    )

    return roles_setup


@pytest.fixture()
def tutorials_setup(auth_client, roles_setup):
    # Creates a default tutorial H14A for all courses
    # all users have joined the H14A tutorial for COMP1511 and COMP2511
    tutorial_creation_data = [
        {
            "name": "H14A",
            "course_code": course["code"],
            "userset": [user["handle"] for user in course["userset"]["members"]],
        }
        for course in roles_setup
    ]
    for tutorial_form in tutorial_creation_data:
        auth_client.post("v1/tutorials", json=tutorial_form)

    response = auth_client.get("v1/tutorials")
    return response.json


@pytest.fixture()
def groups_setup(auth_client, tutorial_setup):
    # Creates a default Group 1 for all tutorials
    # The group for COMP6080's H14A tutorial has no members
    group_creation_data = [
        {
            "name": "Group 1",
            "tutorial_id": tutorial["id"],
            "course_code": tutorial["course_code"],
            "userset": [user["handle"] for user in tutorial["userset"]["members"]],
        }
        for tutorial in tutorial_setup
    ]
    for group_form in group_creation_data:
        auth_client.post("v1/groups", json=group_form)
    response = auth_client.get("v1/groups")
    return response.json


@pytest.fixture(scope="module")
def auth_headers(client, users_setup):
    response = client.post(
        "v1/auth/login",
        json={"email": "john@email.com", "password": "JohnSmith123!"},
    )

    token = response.json["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="module")
def non_creator_headers(client, users_setup):
    response = client.post(
        "v1/auth/login",
        json={"email": "alex@email.com", "password": "AlexXu123!"},
    )

    token = response.json["access_token"]

    return {"Authorization": f"Bearer {token}"}


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


@pytest.fixture(scope="module")
def auth_client(client, auth_headers):
    return AuthClient(client, auth_headers)


@pytest.fixture(scope="module")
def non_creator_client(client, non_creator_headers):
    return AuthClient(client, non_creator_headers)
