import pytest


# GET Requests - course specific
def test_get_course_with_valid_course_code(auth_client, courses_setup):
    response = auth_client.get("v1/courses/COMP1511")
    assert response.status_code == 200
    assert response.json["code"] == "COMP1511"
    assert response.json["name"] == "Programming Fundamentals"


def test_get_course_with_invalid_course_code(auth_client, courses_setup):
    response = auth_client.get("v1/courses/FINS1234")
    assert response.status_code == 400


def test_get_course_without_authentication(client, courses_setup):
    # user not logged in
    response = client.get("v1/courses/COMP1511")
    assert response.status_code == 401
    pass


def test_get_course_with_unauthorized_user(auth_client, courses_setup):
    # user not in course
    response = auth_client.get("v1/courses/COMP6080")
    assert response.status_code == 403


def test_get_course_with_empty_course_code(auth_client, courses_setup):
    response = auth_client.get("v1/courses/")
    assert response.status_code == 404


# GET Requests - course all
def test_get_all_courses_with_valid_request(auth_client, courses_setup):
    response = auth_client.get("v1/courses")
    assert response.status_code == 200
    assert len(response.json) == 2
    assert any(course["code"] == "COMP1511" for course in response.json)
    assert any(course["code"] == "COMP2511" for course in response.json)
    assert not any(course["code"] == "COMP6080" for course in response.json)


def test_get_all_courses_without_authentication(client, courses_setup):
    response = client.get("v1/courses")
    assert response.status_code == 401


# POST Requests - course creation
def test_create_course_with_valid_request(auth_client):
    response = auth_client.post(
        "v1/courses",
        json={
            "code": "COMP1512",
            "name": "Advanced Programming",
            "userset": [],
        },
    )
    assert response.status_code == 201


def test_create_course_without_payload_data(auth_client):
    response = auth_client.post("v1/courses", json={})
    assert response.status_code == 400


def test_create_course_without_authentication(client):
    response = client.post(
        "v1/courses",
        json={
            "code": "COMP1512",
            "name": "Advanced Programming",
            "userset": [],
        },
    )
    assert response.status_code == 401


def test_create_course_with_existing_course_code(auth_client, courses_setup):
    response = auth_client.post(
        "v1/courses",
        json={
            "code": "COMP1511",
            "name": "Advanced Programming",
            "userset": [],
        },
    )
    assert response.status_code == 400


@pytest.mark.xfail(reason="SQLite doesn't support character limits")
def test_create_course_with_invalid_course_code(auth_client):
    pass


def test_create_course_without_course_code(auth_client):
    response = auth_client.post(
        "v1/courses",
        json={
            "code": "",
            "name": "Advanced Programming",
            "userset": [],
        },
    )
    assert response.status_code == 400


def test_create_course_with_extra_payload_fields(auth_client):
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


def test_create_course_with_missing_payload_fields(auth_client):
    response = auth_client.post(
        "v1/courses",
        json={
            "code": "COMP1512",
            "userset": [],
        },
    )
    assert response.status_code == 400


# PUT Requests - course update
@pytest.mark.xfail(reason="Roles and permissions not yet implemented")
def test_update_course_with_valid_request(auth_client, courses_setup):
    response = auth_client.put(
        "v1/courses/COMP1511",
        json={
            "code": "COMP1512",
            "name": "Advanced Programming",
            "userset": [],
        },
    )
    assert response.status_code == 200
    updated_course = auth_client.get("v1/courses/COMP1512")
    assert updated_course.status_code == 200
    assert updated_course.json["code"] == "COMP1512"
    assert updated_course.json["name"] == "Advanced Programming"


def test_update_course_without_authentication(client, courses_setup):
    response = client.put(
        "v1/courses/COMP1511",
        json={
            "code": "COMP1512",
            "name": "Advanced Programming",
            "userset": [],
        },
    )
    assert response.status_code == 401


@pytest.mark.xfail(reason="Roles and permissions not yet implemented")
def test_update_course_with_unauthorized_user(client, courses_setup):
    # response = client.put(
    #     "v1/courses/COMP6080",
    #     json={
    #         "code": "COMP1512",
    #         "name": "Advanced Programming",
    #         "userset": [],
    #     },
    # )
    # assert response.status_code == 401
    pass


def test_update_course_with_nonexistent_course_code(auth_client):
    response = auth_client.put(
        "v1/courses/COMP9999",
        json={
            "code": "COMP1512",
            "name": "Advanced Programming",
            "userset": [],
        },
    )
    assert response.status_code == 400


@pytest.mark.xfail(reason="Roles and permissions not yet implemented")
def test_update_course_to_existing_course_code(auth_client):
    response = auth_client.put(
        "v1/courses/COMP1511",
        json={
            "code": "COMP6080",
            "name": "Advanced Programming",
            "userset": [],
        },
    )
    assert response.status_code == 400


@pytest.mark.xfail(reason="REGEX rules not yet implemented")
def test_update_course_with_invalid_course_code(auth_client, courses_setup):
    response = auth_client.put(
        "v1/courses/COMP1511",
        json={
            "code": "INVALID",
            "name": "Advanced Programming",
            "userset": [],
        },
    )
    assert response.status_code == 400


def test_update_course_with_missing_payload_fields(auth_client, courses_setup):
    response = auth_client.put(
        "v1/courses/COMP1511",
        json={
            "code": "COMP1512",
        },
    )
    assert response.status_code == 400


def test_update_course_with_extra_payload_fields(auth_client, courses_setup):
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


@pytest.mark.xfail(reason="Roles and permissions not yet implemented")
def test_update_course_with_empty_payload_fields(auth_client, courses_setup):
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


def test_update_course_without_payload_data(auth_client):
    response = auth_client.put("v1/courses/COMP1511", json={})
    assert response.status_code == 400


# DELETE Requests - course deletion
@pytest.mark.xfail(reason="Roles and permissions not yet implemented")
def test_delete_course_with_valid_request(auth_client, courses_setup):
    response = auth_client.get("v1/courses")
    assert response.status_code == 200
    assert len(response.json) == 2

    response = auth_client.delete("v1/courses/COMP1511")
    assert response.status_code == 200

    response = auth_client.get("v1/courses")
    assert response.status_code == 200
    assert len(response.json) == 1


def test_delete_course_with_invalid_course_code(auth_client):
    response = auth_client.delete("v1/courses/COMP9999")
    assert response.status_code == 400


def test_delete_course_without_authentication(client, courses_setup):
    response = client.delete("v1/courses/COMP1511")
    assert response.status_code == 401


@pytest.mark.xfail(reason="Roles and permissions not yet implemented")
def test_delete_course_with_unauthorized_user(client, courses_setup):
    # response = client.put(
    #     "v1/courses/COMP6080",
    #     json={
    #         "code": "COMP1512",
    #         "name": "Advanced Programming",
    #         "userset": [],
    #     },
    # )
    # assert response.status_code == 401
    pass


@pytest.mark.xfail(reason="Roles and permissions not yet implemented")
def test_enroll_with_valid_course(auth_client, users_setup, courses_setup):
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
