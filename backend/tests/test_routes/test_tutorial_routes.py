from tests.constants import COURSE_CODE_A, INVALID_COURSE_CODE, TUT_NAME_A, TUT_NAME_B


def test_valid_tutorial_creation(auth_client, courses_setup, handles):
    response = auth_client.post(
        "v1/tutorials",
        json={
            "name": TUT_NAME_A,
            "course_code": COURSE_CODE_A,
            "userset": list(handles.values()),
        },
    )
    assert response.status_code == 201
    response = auth_client.get("v1/tutorials")
    assert response.json[0]["name"] == TUT_NAME_A
    assert response.json[0]["course_code"] == COURSE_CODE_A
    assert len(response.json[0]["userset"]) == len(handles)


def test_invalid_tutorial_creation_duplicate_name(auth_client, courses_setup):
    auth_client.post(
        "v1/tutorials",
        json={"name": TUT_NAME_A, "course_code": COURSE_CODE_A, "userset": []},
    )
    response = auth_client.post(
        "v1/tutorials",
        json={"name": TUT_NAME_A, "course_code": COURSE_CODE_A, "userset": []},
    )
    assert response.status_code == 400


def test_invalid_tutorial_creation_bad_course_code(auth_client, courses_setup):
    response = auth_client.post(
        "v1/tutorials",
        json={
            "name": TUT_NAME_A,
            "course_code": INVALID_COURSE_CODE,
            "userset": [],
        },
    )
    assert response.status_code == 400


def test_invalid_tutorial_creation_no_name(auth_client, courses_setup):
    response = auth_client.post(
        "v1/tutorials",
        json={"course_code": COURSE_CODE_A, "userset": []},
    )
    assert response.status_code == 400


def test_invalid_tutorial_creation_no_course_code(auth_client, courses_setup):
    response = auth_client.post(
        "v1/tutorials",
        json={"name": TUT_NAME_A, "userset": []},
    )
    assert response.status_code == 400


def test_invalid_tutorial_creation_no_userset(auth_client, courses_setup):
    response = auth_client.post(
        "v1/tutorials",
        json={"name": TUT_NAME_A, "course_code": COURSE_CODE_A},
    )
    assert response.status_code == 400


def test_valid_tutorial_fetchall(auth_client, courses_setup):
    auth_client.post(
        "v1/tutorials",
        json={"name": TUT_NAME_A, "course_code": COURSE_CODE_A, "userset": []},
    )
    response = auth_client.get("v1/tutorials")
    assert response.status_code == 200
    assert response.json[0]["name"] == TUT_NAME_A
    assert response.json[0]["course_code"] == COURSE_CODE_A


def test_invalid_tutorial_fetch_bad_tut_id(auth_client):
    response = auth_client.get("v1/tutorials/9999")
    assert response.status_code == 400


def test_valid_tutorial_update(auth_client, courses_setup):
    # todo
    auth_client.post(
        "v1/tutorials",
        json={"name": TUT_NAME_A, "course_code": COURSE_CODE_A, "userset": []},
    )
    response = auth_client.get("v1/tutorials")
    tut_id = response.json[0]["id"]
    response = auth_client.put(
        f"v1/tutorials/{tut_id}",
        json={"name": TUT_NAME_B, "course_code": COURSE_CODE_A, "userset": []},
    )
    assert response.status_code == 200
    response = auth_client.get(f"v1/tutorials/{tut_id}")
    assert response.json["name"] == TUT_NAME_B
    assert response.json["course_code"] == COURSE_CODE_A


def test_invalid_tutorial_update_bad_tut_id(auth_client, courses_setup):
    response = auth_client.put(
        "v1/tutorials/9999",
        json={"name": TUT_NAME_B, "course_code": COURSE_CODE_A, "userset": []},
    )
    assert response.status_code == 400


def test_valid_tutorial_join(auth_client, courses_setup, handles):
    auth_client.post(
        "v1/tutorials",
        json={"name": TUT_NAME_A, "course_code": COURSE_CODE_A, "userset": []},
    )
    tut_id = auth_client.get("v1/tutorials").json[0]["id"]
    response = auth_client.put(
        f"v1/tutorials/{tut_id}/join",
        json={"userset": list(handles.values())},
    )
    assert response.status_code == 200
    response = auth_client.get(f"v1/tutorials/{tut_id}")
    assert len(response.json["userset"]) == 4


def test_invalid_tutorial_join_bad_tut_id(auth_client, courses_setup, handles):
    response = auth_client.put(
        "v1/tutorials/9999/join",
        json={"userset": list(handles.values())},
    )
    assert response.status_code == 404


def test_invalid_tutorial_join_nonexistent_user(auth_client, courses_setup):
    auth_client.post(
        "v1/tutorials",
        json={"name": TUT_NAME_A, "course_code": COURSE_CODE_A, "userset": []},
    )
    tut_id = auth_client.get("v1/tutorials").json[0]["id"]
    response = auth_client.put(
        f"v1/tutorials/{tut_id}/join",
        json={"userset": ["nonexistent_user"]},
    )
    assert response.status_code == 400


def test_invalid_tutorial_join_duplicate_user(auth_client, courses_setup, handles):
    auth_client.post(
        "v1/tutorials",
        json={
            "name": TUT_NAME_A,
            "course_code": COURSE_CODE_A,
            "userset": list(handles.values()),
        },
    )
    tut_id = auth_client.get("v1/tutorials").json[0]["id"]
    response = auth_client.put(
        f"v1/tutorials/{tut_id}/join",
        json={"userset": list(handles.values())},
    )
    assert response.status_code == 400


def test_valid_delete_tutorial(auth_client, courses_setup):
    auth_client.post(
        "v1/tutorials",
        json={"name": TUT_NAME_A, "course_code": COURSE_CODE_A, "userset": []},
    )
    assert len(auth_client.get("v1/tutorials").json) == 1
    response = auth_client.delete("v1/tutorials/1")
    assert response.status_code == 200
    assert len(auth_client.get("v1/tutorials").json) == 0
