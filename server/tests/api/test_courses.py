import pytest


@pytest.fixture
def new_course():
    return {
        "term": "23T3",
        "code": "COMP1531",
        "name": "Software Engineering Fundamentals",
        "description": "Introduction to software engineering.",
    }


@pytest.fixture
def updated_course():
    return {
        "term": "23T4",
        "code": "COMP1531",
        "name": "Advanced Software Engineering Fundamentals",
        "description": "Advanced concepts in software engineering.",
    }


BASE_ROUTE = "/api/courses"


def test_create_course(test_client, new_course):
    response = test_client.post(f"{BASE_ROUTE}", json=new_course)
    assert response.status_code == 200
    assert response.json() == {"message": "Success!! Course created."}


def test_get_all_courses(test_client):
    response = test_client.get(f"{BASE_ROUTE}")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_course_via_id(test_client, new_course):
    # First create a course to get its ID. Course ALREADY created above
    # create_response = test_client.post(f"{BASE_ROUTE}", json=new_course)
    # assert create_response.status_code == 200

    courses = test_client.get(f"{BASE_ROUTE}").json()
    course_id = courses[0]["id"]

    response = test_client.get(f"{BASE_ROUTE}/{course_id}")
    assert response.status_code == 200
    assert response.json()["id"] == course_id


def test_update_course_via_id(test_client, new_course, updated_course):
    # First create a course to get its ID
    # create_response = test_client.post(f"{BASE_ROUTE}", json=new_course)
    # assert create_response.status_code == 200

    courses = test_client.get(f"{BASE_ROUTE}").json()
    course_id = courses[0]["id"]

    response = test_client.put(f"{BASE_ROUTE}/{course_id}", json=updated_course)
    assert response.status_code == 200
    assert response.json() == {"message": "Success!! Course updated."}


def test_delete_course_via_id(test_client, new_course):
    # First create a course to get its ID
    # create_response = test_client.post(f"{BASE_ROUTE}", json=new_course)
    # assert create_response.status_code == 200

    courses = test_client.get(f"{BASE_ROUTE}").json()
    course_id = courses[0]["id"]

    response = test_client.delete(f"{BASE_ROUTE}/{course_id}")
    assert response.status_code == 200
    assert response.json() == {"message": "Success!! Course deleted."}


def test_enrol_a_user_to_a_course(test_client, new_course):
    # First create a course to get its ID
    create_response = test_client.post(f"{BASE_ROUTE}", json=new_course)
    assert create_response.status_code == 200

    courses = test_client.get(f"{BASE_ROUTE}").json()
    print("YAHALLO", courses)
    course_id = courses[0]["id"]

    # Get a user ID (assuming user registration fixture ran and created users)
    users = test_client.get(
        "/api/users"
    ).json()  # Replace with the actual route to get users
    user_id = users[0]["id"]
    response = test_client.post(f"{BASE_ROUTE}/{course_id}/enrolments/{user_id}")
    assert response.status_code == 200
    assert response.json() == {"message": "Success!! User has been enrolled."}
