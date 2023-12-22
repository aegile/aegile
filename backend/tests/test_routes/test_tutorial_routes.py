from tests.constants import (
    COURSE_A_CODE,
    COURSE_B_CODE,
    COURSE_C_CODE,
    TUT_A_NAME,
    TUT_B_NAME,
)


def test_valid_tutorial_creation(auth_client, courses_setup):
    response = auth_client.post(
        "v1/tutorials",
        json={
            "name": TUT_A_NAME,
            "course_code": COURSE_A_CODE,
            "userset": [],
        },
    )
    assert response.status_code == 201


def test_valid_tutorial_fetchall(auth_client, tutorials_setup):
    # Since all the users are only enrolled in 2 tutorials, COMP6080 lacks users
    # this fetchall should only contain 2 tutorials

    response = auth_client.get("v1/tutorials")
    assert response.status_code == 200
    assert len(response.json) == 2

    assert any(tut["name"] == TUT_A_NAME for tut in response.json)
    assert any(tut["course_code"] == COURSE_A_CODE for tut in response.json)
    assert any(tut["course_code"] == COURSE_B_CODE for tut in response.json)


def test_invalid_tutorial_creation_user_in_another_tut(auth_client, tutorials_setup):
    tut = next(
        (tut for tut in tutorials_setup if tut["course_code"] == COURSE_A_CODE),
        None,
    )
    response = auth_client.post(
        "v1/tutorials",
        json={
            "name": TUT_B_NAME,
            "course_code": COURSE_A_CODE,
            "userset": [user["handle"] for user in tut["userset"]],
        },
    )
    assert response.status_code == 400


def test_invalid_tutorial_creation_duplicate_name(auth_client, tutorials_setup):
    response = auth_client.post(
        "v1/tutorials",
        json={"name": TUT_A_NAME, "course_code": COURSE_A_CODE, "userset": []},
    )
    assert response.status_code == 400


def test_invalid_tutorial_creation_bad_course_code(auth_client, tutorials_setup):
    response = auth_client.post(
        "v1/tutorials",
        json={
            "name": TUT_A_NAME,
            "course_code": "ABCD1234",
            "userset": [],
        },
    )
    assert response.status_code == 400


def test_invalid_tutorial_creation_no_name(auth_client, tutorials_setup):
    response = auth_client.post(
        "v1/tutorials",
        json={"course_code": COURSE_A_CODE, "userset": []},
    )
    assert response.status_code == 400


def test_invalid_tutorial_creation_no_course_code(auth_client, tutorials_setup):
    response = auth_client.post(
        "v1/tutorials",
        json={"name": TUT_A_NAME, "userset": []},
    )
    assert response.status_code == 400


def test_invalid_tutorial_creation_no_userset(auth_client, tutorials_setup):
    response = auth_client.post(
        "v1/tutorials",
        json={"name": TUT_A_NAME, "course_code": COURSE_A_CODE},
    )
    assert response.status_code == 400


def test_invalid_tutorial_fetch_bad_tut_id(auth_client, tutorials_setup):
    response = auth_client.get("v1/tutorials/9999")
    assert response.status_code == 400


def test_valid_tutorial_update(auth_client, tutorials_setup):
    response = auth_client.get("v1/tutorials")
    tut = next(
        (tut for tut in tutorials_setup if tut["course_code"] == COURSE_A_CODE),
        None,
    )
    response = auth_client.put(
        f"v1/tutorials/{tut['id']}",
        json={"name": TUT_B_NAME, "userset": []},
    )
    assert response.status_code == 200
    response = auth_client.get(f"v1/tutorials/{tut['id']}")
    assert response.json["name"] == TUT_B_NAME
    assert response.json["course_code"] == COURSE_A_CODE


def test_invalid_tutorial_update_bad_tut_id(auth_client, tutorials_setup):
    response = auth_client.put(
        "v1/tutorials/9999",
        json={"name": TUT_B_NAME, "course_code": COURSE_A_CODE, "userset": []},
    )
    assert response.status_code == 400


def test_valid_tutorial_join(auth_client, courses_setup):
    auth_client.post(
        "v1/tutorials",
        json={"name": TUT_A_NAME, "course_code": COURSE_A_CODE, "userset": []},
    )
    tut_id = auth_client.get("v1/tutorials").json[0]["id"]
    course = next(
        (course for course in courses_setup if course["code"] == COURSE_A_CODE),
        None,
    )
    response = auth_client.put(
        f"v1/tutorials/{tut_id}/join",
        json={"userset": [user["handle"] for user in course["userset"]]},
    )
    assert response.status_code == 200
    response = auth_client.get(f"v1/tutorials/{tut_id}")
    assert len(response.json["userset"]) == 4


def test_invalid_tutorial_join_bad_tut_id(auth_client, tutorials_setup):
    response = auth_client.put(
        "v1/tutorials/9999/join",
        json={"userset": []},
    )
    assert response.status_code == 400


def test_invalid_tutorial_join_nonexistent_user(auth_client, tutorials_setup):
    tut = next(
        (tut for tut in tutorials_setup if tut["course_code"] == COURSE_A_CODE),
        None,
    )
    response = auth_client.put(
        f"v1/tutorials/{tut['id']}/join",
        json={"userset": ["nonexistent_user"]},  # user isn't in the database
    )
    assert response.status_code == 400


def test_invalid_tutorial_join_unenrolled_user(auth_client, tutorials_setup):
    tutA = next(
        (tut for tut in tutorials_setup if tut["course_code"] == COURSE_A_CODE),
        None,
    )
    tutC = next(
        (tut for tut in tutorials_setup if tut["course_code"] == COURSE_C_CODE),
        None,
    )
    response = auth_client.put(
        f"v1/tutorials/{tutC['id']}/join",
        json={"userset": [user["handle"] for user in tutA["userset"]]},
    )
    # Users in tutA aren't enrolled in tutC's course
    assert response.status_code == 400


def test_invalid_tutorial_join_duplicate_user(auth_client, tutorials_setup):
    tut = next(
        (tut for tut in tutorials_setup if tut["course_code"] == COURSE_A_CODE),
        None,
    )
    response = auth_client.put(
        f"v1/tutorials/{tut['id']}/join",
        json={"userset": [user["handle"] for user in tut["userset"]]},
    )
    assert response.status_code == 400


def test_invalid_tutorial_join_user_in_another_tut(auth_client, tutorials_setup):
    tutA = next(
        (tut for tut in tutorials_setup if tut["course_code"] == COURSE_A_CODE),
        None,
    )
    auth_client.post(
        "v1/tutorials",
        json={
            "name": TUT_B_NAME,
            "course_code": COURSE_A_CODE,
            "userset": [],
        },
    )
    tutB = next(
        (
            tut
            for tut in tutorials_setup
            if (tut["course_code"] == COURSE_A_CODE and tut["name"] == TUT_B_NAME)
        ),
        None,
    )
    response = auth_client.put(
        f"v1/tutorials/{tutB['id']}/join",
        json={"userset": [user["handle"] for user in tutA["userset"]]},
    )
    # Students already in a tutorial for a course
    # cannot join another tutorial for the same course
    assert response.status_code == 400


def test_valid_delete_tutorial(auth_client, tutorials_setup):
    tut = next(
        (tut for tut in tutorials_setup if tut["course_code"] == COURSE_A_CODE),
        None,
    )
    assert len(auth_client.get("v1/tutorials").json) == 3
    response = auth_client.delete(f"v1/tutorials/{tut['id']}")
    assert response.status_code == 200
    assert len(auth_client.get("v1/tutorials").json) == 2
