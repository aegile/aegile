import pytest


# GET Requests - course specific
def test_get_course_with_valid_course_id(auth_client, courses_fetch):
    comp1511 = courses_fetch["23T2COMP1511"]
    response = auth_client.get(f"v1/courses/{comp1511['id']}")
    assert response.status_code == 200
    assert response.json["term"] == "23T2"
    assert response.json["code"] == "COMP1511"
    assert response.json["name"] == "Programming Fundamentals"
    assert response.json["description"] == "The intro course for Computer Science"


def test_get_course_with_invalid_course_id(auth_client):
    response = auth_client.get("v1/courses/3hg4nb5j67")
    assert response.status_code == 400


def test_get_course_without_authentication(client, courses_fetch):
    # user not logged in
    comp1511 = courses_fetch["23T2COMP1511"]
    response = client.get(f"v1/courses/{comp1511['id']}")
    assert response.status_code == 401


def test_get_course_with_unauthorized_user(non_creator_client, courses_fetch):
    # user not in course
    comp1511 = courses_fetch["23T2COMP1511"]
    response = non_creator_client.get(f"v1/courses/{comp1511['id']}")
    assert response.status_code == 403


def test_get_course_with_empty_course_id(auth_client):
    response = auth_client.get("v1/courses/")
    assert response.status_code == 404


# GET Requests - course all
def test_get_all_courses_with_valid_request(auth_client):
    response = auth_client.get("v1/courses")
    assert response.status_code == 200
    # John Smith is the creator of all 3 courses
    assert len(response.json) == 3
    assert any(course["code"] == "COMP1511" for course in response.json)
    assert any(course["code"] == "COMP2511" for course in response.json)
    assert any(course["code"] == "COMP6080" for course in response.json)


def test_get_all_courses_with_unenrolled_user(non_creator_client):
    response = non_creator_client.get("v1/courses")
    assert response.status_code == 200
    # John Smith is the creator of all 3 courses
    assert len(response.json) == 0


def test_get_all_courses_without_authentication(client):
    response = client.get("v1/courses")
    assert response.status_code == 401


# POST Requests - course creation
def test_create_course_with_valid_request(auth_client):
    response = auth_client.post(
        "v1/courses",
        json={
            "term": "23T3",
            "code": "COMP1511",
            "name": "Advanced Programming",
            "description": "For advanced programmers",
        },
    )
    print(response.json)
    assert response.status_code == 201


def test_create_course_without_payload_data(auth_client):
    response = auth_client.post("v1/courses", json={})
    assert response.status_code == 400


def test_create_course_without_authentication(client):
    response = client.post(
        "v1/courses",
        json={
            "term": "23T3",
            "code": "COMP1511",
            "name": "Programming Fundamentals",
            "description": "",
        },
    )
    assert response.status_code == 401


def test_create_course_with_existing_course_offering(auth_client):
    # Creation of course with a duplicate term and code
    response = auth_client.post(
        "v1/courses",
        json={
            "term": "23T2",
            "code": "COMP1511",
            "name": "Programming Fundamentals",
            "description": "",
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
            "term": "23T3",
            "code": "",
            "name": "Programming Fundamentals",
            "description": "",
        },
    )
    assert response.status_code == 400


def test_create_course_without_term(auth_client):
    response = auth_client.post(
        "v1/courses",
        json={
            "term": "",
            "code": "COMP1511",
            "name": "Programming Fundamentals",
            "description": "",
        },
    )
    assert response.status_code == 400


def test_create_course_with_extra_payload_fields(auth_client):
    response = auth_client.post(
        "v1/courses",
        json={
            "term": "23T3",
            "code": "COMP1511",
            "name": "Programming Fundamentals",
            "description": "",
            "extra_field": "extra_value",
        },
    )
    assert response.status_code == 400


def test_create_course_with_missing_payload_fields(auth_client):
    response = auth_client.post(
        "v1/courses",
        json={
            "term": "23T3",
            "code": "COMP1511",
            "description": "",
        },
    )
    assert response.status_code == 400


# POST Requests - course enrollments and unenrollments
def test_course_enroll_users_to_course_with_unauthenticated_user(
    client, users_fetch, courses_fetch
):
    comp1511 = courses_fetch["23T2COMP1511"]
    userAlex = users_fetch["alex@email.com"]
    response = client.post(
        f"v1/courses/{comp1511['id']}/enroll",
        json={"members": [userAlex["handle"]]},
    )
    assert response.status_code == 401


def test_course_enroll_users_to_course_with_unauthorized_user(
    non_creator_client, users_fetch, courses_fetch
):
    comp1511 = courses_fetch["23T2COMP1511"]
    userAlex = users_fetch["alex@email.com"]
    response = non_creator_client.post(
        f"v1/courses/{comp1511['id']}/enroll",
        json={"members": [userAlex["handle"]]},
    )
    assert response.status_code == 403


def test_course_enroll_users_to_course_with_nonexistent_user(
    auth_client, courses_fetch
):
    comp1511 = courses_fetch["23T2COMP1511"]
    response = auth_client.post(
        f"v1/courses/{comp1511['id']}/enroll",
        json={"members": ["Non Such User"]},
    )
    assert response.status_code == 400


def test_course_enroll_already_enrolled_users_to_course(
    auth_client, users_fetch, courses_fetch
):
    comp1511 = courses_fetch["23T2COMP1511"]
    # John Smith is the coruse creator and hence already enrolled
    response = auth_client.post(
        f"v1/courses/{comp1511['id']}/enroll",
        json={"members": [users_fetch["john@email.com"]]},
    )
    assert response.status_code == 400


def test_course_enroll_users_to_course_with_valid_input(
    auth_client, users_fetch, courses_fetch
):
    comp1511 = courses_fetch["23T2COMP1511"]
    userAlex = users_fetch["alex@email.com"]
    response = auth_client.post(
        f"v1/courses/{comp1511['id']}/enroll",
        json={"members": [userAlex["handle"]]},
    )
    assert response.status_code == 201
    updated_course = auth_client.get(f"v1/courses/{comp1511['id']}/members")
    assert updated_course.status_code == 200
    assert len(updated_course.json["members"]) == 2


def test_course_kick_with_valid_input(auth_client, users_fetch, courses_fetch):
    # user Alex is enrolled via the previous test
    comp1511 = courses_fetch["23T2COMP1511"]
    userAlex = users_fetch["alex@email.com"]
    creator = users_fetch["john@email.com"]
    response = auth_client.delete(
        f"v1/courses/{comp1511['id']}/kick",
        json={"members": [userAlex["handle"]]},
    )
    assert response.status_code == 200

    updated_course = auth_client.get(f"v1/courses/{comp1511['id']}/members")
    assert updated_course.status_code == 200

    members = updated_course.json["members"]
    assert len(members) == 1
    assert any(user["handle"] != userAlex["handle"] for user in members)
    assert any(user["handle"] == creator["handle"] for user in members)


def test_course_kick_unenrolled_user(auth_client, users_fetch, courses_fetch):
    comp1511 = courses_fetch["23T2COMP1511"]
    userAlex = users_fetch["alex@email.com"]
    response = auth_client.delete(
        f"v1/courses/{comp1511['id']}/kick",
        json={
            "members": [userAlex["handle"]],
        },
    )
    # The missing enrollment won't even be found, so this is okay
    assert response.status_code == 200


def test_course_kick_creator(auth_client, users_fetch, courses_fetch):
    comp1511 = courses_fetch["23T2COMP1511"]
    creator = users_fetch["john@email.com"]
    response = auth_client.post(
        f"v1/courses/{comp1511['id']}/enroll",
        json={
            "members": [creator["handle"]],
        },
    )
    assert response.status_code == 400


# PUT Requests - course update
def test_update_course_with_valid_request(auth_client, courses_fetch):
    comp1511 = courses_fetch["23T2COMP1511"]
    print(comp1511)
    response = auth_client.put(
        f"v1/courses/{comp1511['id']}",
        json={
            "term": "24T1",  # We created a 23T3 COMP1511 above
            "code": "COMP1511",
            "name": "Programming Fundamentals",
            "description": "",
        },
    )
    assert response.status_code == 200
    updated_course = auth_client.get(f"v1/courses/{comp1511['id']}")
    assert updated_course.status_code == 200
    assert updated_course.json["term"] == "24T1"
    assert updated_course.json["code"] == "COMP1511"
    assert updated_course.json["name"] == "Programming Fundamentals"
    # because the update is an empty string, the description should not be updated
    assert updated_course.json["description"] == "The intro course for Computer Science"


def test_update_course_without_authentication(client, courses_fetch):
    comp1511 = courses_fetch["23T3COMP1511"]
    response = client.put(
        f"v1/courses/{comp1511['id']}",
        json={
            "term": "23T3",
            "code": "COMP1511",
            "name": "Programming Fundamentals Plus",
            "description": "",
        },
    )
    assert response.status_code == 401


def test_update_course_with_unauthorized_user(non_creator_client, courses_fetch):
    comp1511 = courses_fetch["23T3COMP1511"]
    response = non_creator_client.put(
        f"v1/courses/{comp1511['id']}",
        json={
            "term": "23T3",
            "code": "COMP1511",
            "name": "Programming Fundamentals",
            "description": "",
        },
    )
    assert response.status_code == 403


def test_update_course_with_nonexistent_course_id(auth_client):
    response = auth_client.put(
        "v1/courses/4h5h6j7j8k",
        json={
            "term": "23T3",
            "code": "COMP1511",
            "name": "Programming Fundamentals",
            "description": "",
        },
    )
    assert response.status_code == 400


# @pytest.mark.xfail(reason="Roles and permissions not yet implemented")
def test_update_course_to_existing_course_offering(auth_client, courses_fetch):
    comp1511 = courses_fetch["23T3COMP1511"]
    response = auth_client.put(
        f"v1/courses/{comp1511['id']}",
        json={
            "term": "23T2",
            "code": "COMP6080",
            "name": "Programming Fundamentals",
            "description": "",
        },
    )
    assert response.status_code == 400


@pytest.mark.xfail(reason="REGEX rules not yet implemented")
def test_update_course_with_invalid_course_code_pattern(auth_client, courses_fetch):
    comp1511 = courses_fetch["23T3COMP1511"]
    response = auth_client.put(
        f"v1/courses/{comp1511['id']}",
        json={
            "code": "INVALID",
            "name": "Advanced Programming",
            "userset": [],
        },
    )
    assert response.status_code == 400


def test_update_course_with_missing_payload_fields(auth_client, courses_fetch):
    comp1511 = courses_fetch["23T3COMP1511"]
    response = auth_client.put(
        f"v1/courses/{comp1511['id']}",
        json={
            "code": "COMP1512",
        },
    )
    assert response.status_code == 400


def test_update_course_with_extra_payload_fields(auth_client, courses_fetch):
    comp1511 = courses_fetch["23T3COMP1511"]
    response = auth_client.put(
        f"v1/courses/{comp1511['id']}",
        json={
            "term": "23T2",
            "code": "COMP6080",
            "name": "Programming Fundamentals",
            "description": "",
            "extra_field": "extra_value",
        },
    )
    assert response.status_code == 400


def test_update_course_with_empty_payload_fields(auth_client, courses_fetch):
    comp1511 = courses_fetch["23T3COMP1511"]
    response = auth_client.put(
        f"v1/courses/{comp1511['id']}",
        json={
            "term": "",
            "code": "",
            "name": "",
            "description": "",
        },
    )
    assert response.status_code == 200
    updated_course = auth_client.get(f"v1/courses/{comp1511['id']}")

    # We expect that empty or null values means the field is not to be updated
    assert updated_course.status_code == 200
    assert updated_course.json["term"] == "23T3"
    assert updated_course.json["code"] == "COMP1511"
    assert updated_course.json["name"] == "Advanced Programming"
    assert updated_course.json["description"] == "For advanced programmers"


def test_update_course_without_payload_data(auth_client, courses_fetch):
    comp1511 = courses_fetch["23T3COMP1511"]
    response = auth_client.put(f"v1/courses/{comp1511['id']}", json={})
    assert response.status_code == 400


# DELETE Requests - course deletion
def test_delete_course_with_valid_request(auth_client, courses_fetch):
    comp1511 = courses_fetch["23T3COMP1511"]
    assert len(courses_fetch) == 4  # including 24T1COMP1511

    response = auth_client.delete(f"v1/courses/{comp1511['id']}")
    assert response.status_code == 200

    response = auth_client.get("v1/courses")
    assert response.status_code == 200
    assert len(response.json) == 3


def test_delete_already_deleted_course(auth_client, courses_fetch):
    # we have to delete it twice in the same test
    comp2511 = courses_fetch["23T2COMP2511"]
    assert len(courses_fetch) == 3

    response = auth_client.delete(f"v1/courses/{comp2511['id']}")
    assert response.status_code == 200
    response = auth_client.delete(f"v1/courses/{comp2511['id']}")
    assert response.status_code == 400

    response = auth_client.get("v1/courses")
    assert response.status_code == 200
    assert len(response.json) == 2


def test_delete_course_with_invalid_course_id(auth_client):
    response = auth_client.delete("v1/courses/4h456j7j9jk")
    assert response.status_code == 400


def test_delete_course_without_authentication(client, courses_fetch):
    comp6080 = courses_fetch["23T2COMP6080"]
    response = client.delete(f"v1/courses/{comp6080['id']}")
    assert response.status_code == 401


def test_delete_course_with_unauthorized_user(non_creator_client, courses_fetch):
    comp6080 = courses_fetch["23T2COMP6080"]
    response = non_creator_client.delete(f"v1/courses/{comp6080['id']}")
    assert response.status_code == 403
