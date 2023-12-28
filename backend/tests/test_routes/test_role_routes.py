import pytest


# POST Requests - role creation
def test_create_role_with_valid_request(auth_client, courses_setup):
    comp1511 = next(crs for crs in courses_setup if crs["code"] == "COMP1511")
    response = auth_client.post(
        f"v1/roles/course/{comp1511['id']}",
        json={"name": "Student"},
    )
    assert response.status_code == 201


def test_create_role_with_invalid_course_code(auth_client, courses_setup):
    response = auth_client.post(
        "v1/roles/course/4g5b6bn7b54j",
        json={"name": "Student"},
    )
    assert response.status_code == 400


def test_create_role_with_unauthenticated_user(client, courses_setup):
    comp1511 = next(crs for crs in courses_setup if crs["code"] == "COMP1511")
    response = client.post(
        f"v1/roles/course/{comp1511['id']}",
        json={"name": "Student"},
    )
    assert response.status_code == 401


def test_create_role_with_non_course_creator(non_creator_client, courses_setup):
    comp1511 = next(crs for crs in courses_setup if crs["code"] == "COMP1511")
    response = non_creator_client.post(
        f"v1/roles/course/{comp1511['id']}",
        json={"name": "Student"},
    )
    assert response.status_code == 403


def test_create_role_with_existing_name(auth_client, courses_setup):
    comp1511 = next(crs for crs in courses_setup if crs["code"] == "COMP1511")
    auth_client.post(
        f"v1/roles/course/{comp1511['id']}",
        json={"name": "Student"},
    )
    response = auth_client.post(
        f"v1/roles/course/{comp1511['id']}",
        json={"name": "Student"},
    )
    assert response.status_code == 201  # duplicate names are allowed


def test_create_role_with_empty_name(auth_client, courses_setup):
    comp1511 = next(crs for crs in courses_setup if crs["code"] == "COMP1511")
    response = auth_client.post(
        f"v1/roles/course/{comp1511['id']}",
        json={"name": ""},
    )
    assert response.status_code == 201  # Empty names are allowed


def test_create_role_without_payload_data(auth_client, courses_setup):
    comp1511 = next(crs for crs in courses_setup if crs["code"] == "COMP1511")
    response = auth_client.post(
        f"v1/roles/course/{comp1511['id']}",
        json={},
    )
    assert response.status_code == 400


def test_create_role_with_non_string_name(auth_client, courses_setup):
    comp1511 = next(crs for crs in courses_setup if crs["code"] == "COMP1511")
    response = auth_client.post(
        f"v1/roles/course/{comp1511['id']}",
        json={"name": 123},
    )
    assert response.status_code == 400


# GET Requests - all roles within a course
def test_get_all_roles_with_valid_course_code(auth_client, roles_setup):
    comp1511 = next(crs for crs in roles_setup if crs["code"] == "COMP1511")
    response = auth_client.get(f"v1/roles/course/{comp1511['id']}")
    assert response.status_code == 200
    assert len(response.json) == 3
    assert any(role["name"] == "Student" for role in response.json)
    assert any(role["name"] == "Tutor" for role in response.json)
    assert any(role["name"] == "Admin" for role in response.json)


def test_get_all_roles_with_non_course_creator(non_creator_client, roles_setup):
    comp1511 = next(crs for crs in roles_setup if crs["code"] == "COMP1511")
    response = non_creator_client.get(f"v1/roles/course/{comp1511['id']}")
    assert response.status_code == 403


# GET Requests - single role within a course
def test_get_role_with_valid_role_id(auth_client, roles_setup):
    comp1511 = next(crs for crs in roles_setup if crs["code"] == "COMP1511")
    response = auth_client.get(f"v1/roles/course/{comp1511['id']}")
    assert response.status_code == 200
    tutor_role = next(
        (role for role in response.json if role["name"] == "Tutor"),
        None,
    )
    response = auth_client.get(f"v1/roles/{tutor_role['id']}")
    assert response.status_code == 200
    assert response.json["name"] == "Tutor"
    assert response.json["permissions"]["can_manage_roles"] == 0
    assert response.json["permissions"]["can_access_tutorials"] == 0


# PUT Requests - updating a role
def test_update_role_with_valid_role_id(auth_client, roles_setup):
    comp1511 = next(crs for crs in roles_setup if crs["code"] == "COMP1511")
    response = auth_client.get(f"v1/roles/course/{comp1511['id']}")
    tutor_role = next(
        (role for role in response.json if role["name"] == "Tutor"),
        None,
    )
    response = auth_client.put(
        f"v1/roles/{tutor_role['id']}",
        json={
            "name": "",
            "color": "#ffffff",
            "permissions": ["can_manage_roles"],
        },
    )

    response = auth_client.get(f"v1/roles/{tutor_role['id']}")

    assert response.status_code == 200
    assert response.json["name"] == "Tutor"
    assert response.json["color"] == "#ffffff"
    assert response.json["permissions"]["can_manage_roles"] == 1
    assert response.json["permissions"]["can_access_tutorials"] == 0
    assert response.json["permissions"]["can_manage_course"] == 0


def test_assign_role_to_enrolled_user(
    auth_client, non_creator_client, users_setup, roles_setup
):
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
    assert response.status_code == 200

    response = non_creator_client.get(f"v1/roles/{comp1511['id']}")
    assert response.status_code == 200


def test_assign_role_to_unenrolled_user(auth_client, users_setup, roles_setup):
    comp1511 = next(crs for crs in roles_setup if crs["code"] == "COMP1511")
    userAlex = next(user for user in users_setup if user["email"] == "alex@email.com")
    response = auth_client.get(f"v1/roles/course/{comp1511['id']}")
    tutor_role = next(
        (role for role in response.json if role["name"] == "Tutor"),
        None,
    )
    response = auth_client.put(
        f"v1/roles/{tutor_role['id']}/user/{userAlex['id']}/assign"
    )
    assert response.status_code == 400


def test_assign_role_with_unauthorized_user():
    pass


def test_unassign_role_from_enrolled_user(
    auth_client, non_creator_client, users_setup, roles_assignment
):
    comp1511 = next(crs for crs in roles_assignment if crs["code"] == "COMP1511")
    userAlex = next(user for user in users_setup if user["email"] == "alex@email.com")
    response = auth_client.get(f"v1/roles/course/{comp1511['id']}")
    tutor_role = next(
        (role for role in response.json if role["name"] == "Tutor"),
        None,
    )
    response = auth_client.put(
        f"v1/roles/{tutor_role['id']}/user/{userAlex['id']}/unassign"
    )
    assert response.status_code == 200
    response = non_creator_client.get(f"v1/roles/{comp1511['id']}")
    assert response.status_code == 403


def test_delete_role_with_valid_role_id(
    auth_client, non_creator_client, roles_assignment
):
    comp1511 = next(crs for crs in roles_assignment if crs["code"] == "COMP1511")
    response = auth_client.get(f"v1/roles/course/{comp1511['id']}")
    tutor_role = next(
        (role for role in response.json if role["name"] == "Tutor"),
        None,
    )
    response = auth_client.delete(f"v1/roles/{tutor_role['id']}")
    assert response.status_code == 200
    response = non_creator_client.get(f"v1/roles/course/{comp1511['id']}")
    # user should still be enrolled, but role should be deleted
    assert response.status_code == 403
