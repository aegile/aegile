import pytest


pytestmark = [
    pytest.mark.no_deliverables_setup,
    pytest.mark.no_projects_setup,
]


# GET request to /v1/tutorials/<tutorial_id> - tutorial specific
def test_fetch_all_tutorials_as_authorized_manager(auth_client, courses_fetch):
    comp1511 = courses_fetch["23T2COMP1511"]
    res = auth_client.get(f"api/v1/tutorials/crs/{comp1511['id']}")
    assert res.status_code == 200
    assert len(res.json) == 2
    assert any(tut["name"] == "H14A" for tut in res.json)
    assert any(tut["name"] == "W11B" for tut in res.json)


def test_fetch_all_tutorials_as_unenrolled_user(non_creator_client, courses_fetch):
    comp1511 = courses_fetch["23T2COMP1511"]
    res = non_creator_client.get(f"api/v1/tutorials/crs/{comp1511['id']}")
    assert res.status_code == 200
    assert len(res.json) == 0


@pytest.mark.parametrize("course", ["23T2COMP1511"])
def test_get_tutorial_with_valid_tutorial_id(auth_client, get_tut):
    tut = get_tut["H14A23T2COMP1511"]
    response = auth_client.get(f"api/v1/tutorials/{tut['id']}")
    assert response.status_code == 200


def test_get_tutorial_with_invalid_tutorial_id(auth_client):
    response = auth_client.get("api/v1/tutorials/9999")
    assert response.status_code == 400


@pytest.mark.parametrize("course", ["23T2COMP1511"])
def test_get_tutorial_without_authentication(client, get_tut):
    tut = get_tut["H14A23T2COMP1511"]
    response = client.get(f"api/v1/tutorials/{tut['id']}")
    assert response.status_code == 401


# @pytest.mark.parametrize("course", ["23T2COMP6080"])
# def test_get_tutorial_with_unauthorized_user(auth_client, get_tut):
#     # User is not in the COMP6080 tutorial
#     tut = get_tut["H14A23T2COMP6080"]
#     response = auth_client.get(f"api/v1/tutorials/{tut['id']}")
#     assert response.status_code == 401


def test_get_tutorial_with_empty_tutorial_id(auth_client):
    response = auth_client.get("api/v1/tutorials/")
    assert response.status_code == 404


@pytest.mark.parametrize("course", ["23T2COMP1511"])
def test_get_tutorial_check_content_type(auth_client, get_tut):
    tut = get_tut["H14A23T2COMP1511"]
    response = auth_client.get(f"api/v1/tutorials/{tut['id']}")
    assert response.status_code == 200
    assert response.headers["Content-Type"] == "application/json"


@pytest.mark.parametrize("course", ["23T2COMP1511"])
def test_get_tutorial_check_response_structure(auth_client, get_tut):
    tut = get_tut["H14A23T2COMP1511"]
    response = auth_client.get(f"api/v1/tutorials/{tut['id']}")
    assert response.status_code == 200
    data = response.json
    assert "id" in data
    assert "name" in data
    assert "capacity" in data
    assert "datetime" in data
    assert "location" in data


@pytest.mark.parametrize("course", ["23T2COMP1511"])
def test_get_tutorial_check_response_data(auth_client, get_tut):
    tut = get_tut["H14A23T2COMP1511"]
    response = auth_client.get(f"api/v1/tutorials/{tut['id']}")
    assert response.status_code == 200
    data = response.json
    assert data["id"] == tut["id"]
    assert data["name"] == tut["name"]
    assert data["capacity"] == tut["capacity"]
    assert data["datetime"] == tut["datetime"]
    assert data["location"] == tut["location"]


# GET request to /v1/tutorials
def test_get_all_tutorials_with_valid_tutorial_id(auth_client):
    response = auth_client.get("api/v1/tutorials")
    assert response.status_code == 200


def test_get_all_tutorials_without_authentication(client):
    response = client.get("api/v1/tutorials")
    assert response.status_code == 401


def test_get_all_tutorials_check_content_type(auth_client):
    response = auth_client.get("api/v1/tutorials")
    assert response.status_code == 200
    assert response.headers["Content-Type"] == "application/json"


def test_get_all_tutorials_check_response_structure(auth_client):
    response = auth_client.get("api/v1/tutorials")
    assert response.status_code == 200
    assert isinstance(response.json, list)
    for tutorial in response.json:
        assert "id" in tutorial
        assert "name" in tutorial
        assert "capacity" in tutorial
        assert "datetime" in tutorial
        assert "location" in tutorial
        # Add more assertions for other fields in the response


def test_get_all_tutorials_check_response_data(auth_client, courses_fetch):
    # The user is currently enrolled in 6 tutorials, since these were created
    # in the setup.

    comp1511 = courses_fetch["23T2COMP1511"]
    comp2511 = courses_fetch["23T2COMP2511"]
    comp6080 = courses_fetch["23T2COMP6080"]
    response = auth_client.get("api/v1/tutorials")
    assert response.status_code == 200
    assert len(response.json) == 6
    for tut in response.json:
        assert tut["name"] == "H14A" or tut["name"] == "W11B"
        assert (
            tut["course_id"] == comp1511["id"]
            or tut["course_id"] == comp2511["id"]
            or tut["course_id"] == comp6080["id"]
        )


# POST request to /v1/tutorials/crs/ - course creation
def test_valid_tutorial_creation(auth_client, courses_fetch):
    comp1511 = courses_fetch["23T2COMP1511"]

    response = auth_client.post(
        f"api/v1/tutorials/crs/{comp1511['id']}",
        json={
            "name": "C10B",
            "capacity": 20,
            "datetime": "Friday 3pm-5pm",
            "location": "Physics Theatre K14",
        },
    )
    assert response.status_code == 201
    tuts = auth_client.get("api/v1/tutorials")
    assert len(tuts.json) == 7
    assert any(tut["name"] == "C10B" for tut in tuts.json)


def test_invalid_tutorial_creation_duplicate_name(auth_client, courses_fetch):
    comp1511 = courses_fetch["23T2COMP1511"]
    response = auth_client.post(
        f"api/v1/tutorials/crs/{comp1511['id']}",
        json={
            "name": "C10B",
            "capacity": 15,
            "datetime": "Monday 10am-12pm",
            "location": "Flute Lab J17",
        },
    )
    assert response.status_code == 400


def test_invalid_tutorial_creation_no_name(auth_client, courses_fetch):
    comp1511 = courses_fetch["23T2COMP1511"]
    response = auth_client.post(
        f"api/v1/tutorials/crs/{comp1511['id']}",
        json={
            "capacity": 30,
            "datetime": "Wednesday 2pm-4pm",
            "location": "Oboe Lab J17",
        },
    )
    assert response.status_code == 400


def test_invalid_tutorial_creation_no_capacity(auth_client, courses_fetch):
    comp1511 = courses_fetch["23T2COMP1511"]
    response = auth_client.post(
        f"api/v1/tutorials/crs/{comp1511['id']}",
        json={
            "name": "A01B",
            "datetime": "Wednesday 2pm-4pm",
            "location": "Oboe Lab J17",
        },
    )
    assert response.status_code == 400


def test_invalid_tutorial_creation_no_datetime(auth_client, courses_fetch):
    comp1511 = courses_fetch["23T2COMP1511"]
    response = auth_client.post(
        f"api/v1/tutorials/crs/{comp1511['id']}",
        json={
            "name": "A01B",
            "capacity": 30,
            "location": "Oboe Lab J17",
        },
    )
    assert response.status_code == 400


def test_invalid_tutorial_creation_no_location(auth_client, courses_fetch):
    comp1511 = courses_fetch["23T2COMP1511"]
    response = auth_client.post(
        f"api/v1/tutorials/crs/{comp1511['id']}",
        json={
            "name": "A01B",
            "capacity": 30,
            "datetime": "Wednesday 2pm-4pm",
        },
    )
    assert response.status_code == 400


def test_invalid_tutorial_fetch_bad_tut_id(auth_client):
    response = auth_client.get("api/v1/tutorials/9999")
    assert response.status_code == 400


def test_valid_tutorial_update(auth_client, tutorials_fetch):
    new_tut = tutorials_fetch["C10BCOMP1511"]

    response = auth_client.put(
        f"api/v1/tutorials/{new_tut['id']}",
        json={
            "name": "Y99Z",
            "capacity": 40,
        },
    )
    assert response.status_code == 200
    response = auth_client.get(f"api/v1/tutorials/{new_tut['id']}")
    # assert len(response.json) == 7
    # any(tut["name"] == "Y99Z" for tut in response.json)
    assert response.json["name"] == "Y99Z"
    assert response.json["capacity"] == 40
    assert response.json["datetime"] == "Friday 3pm-5pm"
    assert response.json["location"] == "Physics Theatre K14"


def test_invalid_tutorial_update_bad_tut_id(auth_client):
    response = auth_client.put(
        "api/v1/tutorials/9999",
        json={
            "name": "P10T",
            "capacity": 30,
            "datetime": "Monday 9am-11am",
            "location": "Sitar Lab J17",
        },
    )
    assert response.status_code == 400


def test_valid_tutorial_join(auth_client, users_fetch, courses_fetch, tutorials_fetch):
    # Need to make Alex join 23T2COMP1511 course first
    # Then auth_client can enrol Alex into the tutorial
    comp1511 = courses_fetch["23T2COMP1511"]
    tut = tutorials_fetch["Y99ZCOMP1511"]
    userAlex = users_fetch["alex@email.com"]

    response = auth_client.post(
        f"api/v1/courses/{comp1511['id']}/enroll",
        json={"members": [userAlex["handle"]]},
    )
    assert response.status_code == 201

    response = auth_client.post(
        f"api/v1/tutorials/{tut['id']}/enroll",
        json={"members": [userAlex["handle"]]},
    )
    assert response.status_code == 201

    response = auth_client.get(f"api/v1/tutorials/{tut['id']}/members")
    assert response.status_code == 200
    assert len(response.json["members"]) == 2
    assert any(user["email"] == "alex@email.com" for user in response.json["members"])


def test_invalid_tutorial_join_bad_tut_id(auth_client, users_fetch):
    userAlex = users_fetch["alex@email.com"]
    response = auth_client.post(
        "api/v1/tutorials/9999/enroll",
        json={"members": [userAlex["handle"]]},
    )
    assert response.status_code == 400


def test_invalid_tutorial_join_nonexistent_user(auth_client, tutorials_fetch):
    tut = tutorials_fetch["Y99ZCOMP1511"]
    response = auth_client.post(
        f"api/v1/tutorials/{tut['id']}/enroll",
        json={"members": ["nonexistent_user"]},  # user isn't in the database
    )
    assert response.status_code == 400


@pytest.mark.parametrize("course", ["23T2COMP2511"])
def test_invalid_tutorial_join_unenrolled_user(auth_client, users_fetch, get_tut):
    comp2511Tut = get_tut["H14A23T2COMP2511"]
    userAlex = users_fetch["alex@email.com"]

    response = auth_client.post(
        f"api/v1/tutorials/{comp2511Tut['id']}/enroll",
        json={"members": [userAlex["handle"]]},
    )
    # Alex in tut Y99ZCOMP1511 isn't enrolled in tut H14A's COMP2511 course
    assert response.status_code == 404


def test_invalid_tutorial_join_duplicate_user(
    auth_client, users_fetch, tutorials_fetch
):
    new_tut = tutorials_fetch["Y99ZCOMP1511"]
    userAlex = users_fetch["alex@email.com"]

    response = auth_client.post(
        f"api/v1/tutorials/{new_tut['id']}/enroll",
        json={"members": [userAlex["handle"]]},
    )
    # Alex joins the H14ACOMP1511 tutorial again
    assert response.status_code == 400


def test_invalid_tutorial_join_user_in_another_tut(
    auth_client, users_fetch, tutorials_fetch
):
    second_tut = tutorials_fetch["H14ACOMP1511"]
    userAlex = users_fetch["alex@email.com"]

    response = auth_client.post(
        f"api/v1/tutorials/{second_tut['id']}/enroll",
        json={"members": [userAlex["handle"]]},
    )
    # Students already in a tutorial for a course
    # cannot join another tutorial for the same course
    assert response.status_code == 400


def test_valid_tutorial_kick(auth_client, users_fetch, tutorials_fetch):
    new_tut = tutorials_fetch["Y99ZCOMP1511"]
    userAlex = users_fetch["alex@email.com"]

    response = auth_client.delete(
        f"api/v1/tutorials/{new_tut['id']}/kick",
        json={"members": [userAlex["handle"]]},
    )
    assert response.status_code == 200

    response = auth_client.get(f"api/v1/tutorials/{new_tut['id']}/members")
    assert response.status_code == 200
    assert len(response.json["members"]) == 1
    assert all(user["email"] != "alex@email.com" for user in response.json["members"])


def test_invalid_tutorial_kick_not_in_tutorial(
    auth_client, users_fetch, tutorials_fetch
):
    new_tut = tutorials_fetch["Y99ZCOMP1511"]
    userAlex = users_fetch["alex@email.com"]

    response = auth_client.delete(
        f"api/v1/tutorials/{new_tut['id']}/kick",
        json={"members": [userAlex["handle"]]},
    )
    # Error leaving since Alex is not in the tutorial anymore
    assert response.status_code == 400


def test_valid_delete_tutorial(auth_client, courses_fetch, tutorials_fetch):
    comp1511 = courses_fetch["23T2COMP1511"]
    new_tut = tutorials_fetch["Y99ZCOMP1511"]

    assert len(auth_client.get(f"api/v1/tutorials/crs/{comp1511['id']}").json) == 3
    response = auth_client.delete(f"api/v1/tutorials/{new_tut['id']}")
    assert response.status_code == 200
    response = auth_client.get(f"api/v1/tutorials/crs/{comp1511['id']}").json
    assert len(response) == 2
    assert all(tut["name"] != "Y99Z" for tut in response)
