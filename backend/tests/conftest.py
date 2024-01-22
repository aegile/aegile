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
        db.session.remove()
        db.drop_all()
        db.create_all()
        yield db
        # db.session.remove()
        # db.drop_all()


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
        client.post("api/v1/auth/register", json=user_form)


@pytest.fixture(scope="function")
def users_fetch(auth_client):
    response = auth_client.get("api/v1/users")
    print(response.json)
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
        auth_client.post("api/v1/courses", json=course_form)


@pytest.fixture(scope="function")
def courses_fetch(auth_client):
    response = auth_client.get("api/v1/courses")
    return {f"{course['term']}{course['code']}": course for course in response.json}


@pytest.fixture(scope="module", autouse=True)
def roles_setup(auth_client):
    response = auth_client.get("api/v1/courses")
    # Creates a default role Student for all courses
    for course in response.json:
        auth_client.post(
            f"api/v1/roles/course/{course['id']}",
            json={"name": "Student"},
        )
        auth_client.post(
            f"api/v1/roles/course/{course['id']}",
            json={"name": "Tutor"},
        )
        auth_client.post(
            f"api/v1/roles/course/{course['id']}",
            json={"name": "Admin"},
        )

    return courses_setup


@pytest.fixture(scope="function")
def roles_fetch(auth_client, courses_fetch):
    comp1511 = courses_fetch["23T2COMP1511"]
    response = auth_client.get(f"api/v1/roles/course/{comp1511['id']}")
    return {f"{role['name']}": role for role in response.json}


@pytest.fixture(scope="module", autouse=True)
def tutorials_setup(auth_client, courses_setup, request):
    if "no_tutorials_setup" in request.keywords:
        return

    courses = auth_client.get("api/v1/courses").json
    for course in courses:
        auth_client.post(
            f"api/v1/tutorials/crs/{course['id']}",
            json={
                "name": "H14A",
                "capacity": 30,
                "datetime": "Thursday 2pm-4pm",
                "location": "Quadrangle G040",
            },
        )
        auth_client.post(
            f"api/v1/tutorials/crs/{course['id']}",
            json={
                "name": "W11B",
                "capacity": 20,
                "datetime": "Wednesday 11am-1pm",
                "location": "Quadrangle G040",
            },
        )


@pytest.fixture(scope="function")
def tutorials_fetch(auth_client, courses_fetch):
    comp1511 = courses_fetch["23T2COMP1511"]
    response = auth_client.get(f"api/v1/tutorials/crs/{comp1511['id']}")
    return {f"{tut['name']}COMP1511": tut for tut in response.json}


@pytest.fixture(scope="function")
def get_tut(auth_client, courses_fetch, course: str):
    course_obj = courses_fetch[course]
    response = auth_client.get(f"api/v1/tutorials/crs/{course_obj['id']}")
    return {f"{tut['name']}{course}": tut for tut in response.json}


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
        auth_client.post("api/v1/groups", json=group_form)
    response = auth_client.get("api/v1/groups")
    return response.json


@pytest.fixture(scope="module", autouse=True)
def deliverables_setup(auth_client, tutorials_setup, request):
    if "no_deliverables_setup" in request.keywords:
        return

    courses = auth_client.get("api/v1/courses").json

    for course in courses:
        auth_client.post(
            f"api/v1/deliverables/crs/{course['id']}",
            json={
                "name": "Sandbox Group Assignment",
                "deliverable_type": "Group",
                "limit": "10 Minutes",
                "weighting": 20,
                "deadline": "Monday 30 April 11:59pm",
                "description": "lorem ipsum dolor amet sit.",
            },
        )
        auth_client.post(
            f"api/v1/deliverables/crs/{course['id']}",
            json={
                "name": "Sandbox Group Assignment 2",
                "deliverable_type": "Group",
                "limit": "10 Minutes",
                "weighting": 20,
                "deadline": "Friday 30 May 11:59pm",
                "description": "lorem ipsum dolor amet sit.",
            },
        )


@pytest.fixture(scope="function")
def deliverable_instances_fetch(auth_client, tutorials_fetch):
    tut = tutorials_fetch["H14ACOMP1511"]
    response = auth_client.get(f"api/v1/deliverables/tut/{tut['id']}")
    return {f"{dlv['name']}H14ACOMP1511": dlv for dlv in response.json}


@pytest.fixture(scope="module", autouse=True)
def projects_setup(auth_client, deliverables_setup, request):
    if "no_projects_setup" in request.keywords:
        return

    tutorials = auth_client.get("api/v1/tutorials").json

    for tut in tutorials:
        instances = auth_client.get(f"api/v1/deliverables/tut/{tut['id']}").json

        for instance in instances:
            auth_client.post(
                "api/v1/projects",
                json={
                    "course_id": instance["course_id"],
                    "tutorial_id": instance["tutorial_id"],
                    "deliverable_instance_id": instance["id"],
                    "name": "Test Project 1",
                },
            )
            auth_client.post(
                "api/v1/projects",
                json={
                    "course_id": instance["course_id"],
                    "tutorial_id": instance["tutorial_id"],
                    "deliverable_instance_id": instance["id"],
                    "name": "Test Project 2",
                },
            )


@pytest.fixture(scope="function")
def projects_fetch(auth_client, deliverable_instances_fetch):
    instance = deliverable_instances_fetch["Sandbox Group AssignmentH14ACOMP1511"]
    response = auth_client.get(f"api/v1/projects/instance/{instance['id']}")
    return {f"{prj['name']}H14ACOMP1511": prj for prj in response.json}


@pytest.fixture(scope="function")
def tasks_fetch(auth_client, projects_fetch):
    project = projects_fetch["Test Project 1H14ACOMP1511"]
    response = auth_client.get(f"api/v1/tasks/prj/{project['id']}")
    return {f"{task['name']}H14ACOMP1511": task for task in response.json}


@pytest.fixture(scope="module")
def auth_headers(client, users_setup):
    response = client.post(
        "api/v1/auth/login",
        json={"email": "john@email.com", "password": "JohnSmith123!"},
    )
    print(response)

    token = response.json["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture(scope="module")
def non_creator_headers(client, users_setup):
    response = client.post(
        "api/v1/auth/login",
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
