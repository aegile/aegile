import pytest


@pytest.fixture()
def _init_courses(auth_client):
    course_creation_data = [
        {
            "code": "COMP1511",
            "name": "Programming Fundamentals",
            "userset": [],
        },
        {
            "code": "COMP2511",
            "name": "Object-Oriented Design & Programming",
            "userset": [],
        },
        {
            "code": "COMP6080",
            "name": "Web Front-End Programming",
            "userset": [],
        },
    ]
    for course_form in course_creation_data:
        auth_client.post("v1/courses", json=course_form)

    response = auth_client.get("v1/courses")
    return response.json[0], response.json[1], response.json[2]


def test_valid_course_creation(auth_client, _init_courses):
    response = auth_client.post(
        "v1/courses",
        json={
            "code": "COMP1512",
            "name": "Advanced Programming",
            "userset": [],
        },
    )
    assert response.status_code == 201


def test_invalid_missing_fields_course_creation(auth_client, _init_courses):
    response = auth_client.post(
        "v1/courses",
        json={
            "code": "COMP1512",
        },
    )
    assert response.status_code == 400


def test_invalid_extra_fields_course_creation(auth_client, _init_courses):
    response = auth_client.post(
        "v1/courses",
        json={
            "code": "COMP1512",
            "name": "Advanced Programming",
            "userset": [],
            "extra_field": "extra_value",
        },
    )
    assert response.status_code == 400


def test_invalid_empty_code_course_creation(auth_client, _init_courses):
    response = auth_client.post(
        "v1/courses",
        json={
            "code": "",
            "name": "Advanced Programming",
            "userset": [],
        },
    )
    assert response.status_code == 400


def test_invalid_existing_course_creation(auth_client, _init_courses):
    response = auth_client.post(
        "v1/courses",
        json={
            "code": "COMP1511",
            "name": "Advanced Programming",
            "userset": [],
        },
    )
    assert response.status_code == 400


def test_invalid_no_data_course_creation(auth_client, _init_courses):
    response = auth_client.post("v1/courses", json={})
    assert response.status_code == 400


def test_valid_fetchall(auth_client, _init_courses):
    response = auth_client.get("v1/courses")
    assert response.status_code == 200
    assert len(response.json) == 3
    assert response.json[0]["code"] == "COMP1511"
    assert response.json[1]["code"] == "COMP2511"
    assert response.json[2]["code"] == "COMP6080"


def test_valid_course_code_fetch(auth_client, _init_courses):
    response = auth_client.get("v1/courses/COMP1511")
    assert response.status_code == 200
    assert response.json["code"] == "COMP1511"
    assert response.json["name"] == "Programming Fundamentals"


def test_valid_course_update(auth_client, _init_courses):
    response = auth_client.put(
        "v1/courses/COMP1511",
        json={
            "code": "COMP1512",
            "name": "Advanced Programming",
            "userset": [],
        },
    )
    assert response.status_code == 200
    response = auth_client.get("v1/courses/COMP1512")
    assert response.status_code == 200
    assert response.json["code"] == "COMP1512"
    assert response.json["name"] == "Advanced Programming"


def test_invalid_missing_fields_course_update(auth_client, _init_courses):
    response = auth_client.put(
        "v1/courses/COMP1511",
        json={"code": "COMP1512"},
    )
    assert response.status_code == 400


def test_invalid_extra_fields_course_update(auth_client, _init_courses):
    response = auth_client.put(
        "v1/courses/COMP1511",
        json={
            "code": "COMP1512",
            "name": "Advanced Programming",
            "userset": [],
            "extra_field": "extra_value",
        },
    )
    assert response.status_code == 400


def test_invalid_empty_fields_course_update(auth_client, _init_courses):
    response = auth_client.put(
        "v1/courses/COMP1511",
        json={
            "code": "",
            "name": "",
            "userset": [],
        },
    )

    # We expect that empty or null values means the field is not to be updated
    assert response.status_code == 200


def test_invalid_no_data_course_update(auth_client, _init_courses):
    response = auth_client.put("v1/courses/COMP1511", json={})
    assert response.status_code == 400


def test_invalid_nonexistent_course_update(auth_client, _init_courses):
    response = auth_client.put(
        "v1/courses/FINS1234",
        json={
            "code": "COMP1512",
            "name": "Advanced Programming",
            "userset": [],
        },
    )
    assert response.status_code == 400


def test_invalid_to_existing_code_course_update(auth_client, _init_courses):
    response = auth_client.put(
        "v1/courses/COMP1511",
        json={
            "code": "COMP6080",
            "name": "Advanced Programming",
            "userset": [],
        },
    )
    assert response.status_code == 400


def test_valid_course_delete(auth_client, _init_courses):
    response = auth_client.delete("v1/courses/COMP1511")
    assert response.status_code == 200
    response = auth_client.get("v1/courses")
    assert response.status_code == 200
    assert len(response.json) == 2


def test_invalid_course_code_delete(auth_client, _init_courses):
    response = auth_client.delete("v1/courses/COMP1234")
    assert response.status_code == 400


def test_valid_course_enroll(auth_client, users_setup, _init_courses):
    response = auth_client.put(
        "v1/courses/COMP1511/enroll",
        json={
            "userset": [user["handle"] for user in users_setup],
        },
    )
    assert response.status_code == 200
    response = auth_client.get("v1/courses/COMP1511")
    assert response.status_code == 200
    # Test Auth user John Smith is the additional member
    assert len(response.json["userset"]["members"]) == 4
