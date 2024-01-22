import pytest

pytestmark = [pytest.mark.no_deliverables_setup, pytest.mark.no_projects_setup]


def test_create_deliverable_with_invalid_course_id(auth_client):
    res = auth_client.post(
        "api/v1/deliverables/crs/invalid_course_id",
        json={
            "name": "Sandbox Group Assignment",
            "deliverable_type": "Group",
            "limit": "10 Minutes",
            "weighting": 20,
            "deadline": "Monday 30 April 11:59pm",
            "description": "lorem ipsum dolor amet sit.",
        },
    )
    assert res.status_code == 400


def test_create_deliverable_with_unautorized_user(non_creator_client, courses_fetch):
    comp1511 = courses_fetch["23T2COMP1511"]
    res = non_creator_client.post(
        f"api/v1/deliverables/crs/{comp1511['id']}",
        json={
            "name": "Sandbox Group Assignment",
            "deliverable_type": "Group",
            "limit": "10 Minutes",
            "weighting": 20,
            "deadline": "Monday 30 April 11:59pm",
            "description": "lorem ipsum dolor amet sit.",
        },
    )
    assert res.status_code == 403


def test_create_deliverable_with_extra_fields(auth_client, courses_fetch):
    comp1511 = courses_fetch["23T2COMP1511"]
    res = auth_client.post(
        f"api/v1/deliverables/crs/{comp1511['id']}",
        json={
            "name": "Sandbox Group Assignment",
            "deliverable_type": "Group",
            "limit": "10 Minutes",
            "weighting": 20,
            "deadline": "Monday 30 April 11:59pm",
            "description": "lorem ipsum dolor amet sit.",
            "extra_field": "extra",
        },
    )
    assert res.status_code == 400


def test_create_deliverable_with_missing_fields(auth_client, courses_fetch):
    comp1511 = courses_fetch["23T2COMP1511"]
    res = auth_client.post(
        f"api/v1/deliverables/crs/{comp1511['id']}",
        json={
            "name": "Sandbox Group Assignment",
            "deliverable_type": "Group",
            "limit": "10 Minutes",
            "weighting": 20,
            "description": "lorem ipsum dolor amet sit.",
        },
    )
    assert res.status_code == 400


def test_create_deliverable_with_empty_fields(auth_client, courses_fetch):
    comp1511 = courses_fetch["23T2COMP1511"]
    res = auth_client.post(
        f"api/v1/deliverables/crs/{comp1511['id']}",
        json={
            "name": "",
            "deliverable_type": "",
            "limit": "",
            "weighting": 20,
            "deadline": "",
            "description": "lorem ipsum dolor amet sit.",
        },
    )
    assert res.status_code == 400


def test_create_deliverable_with_valid_input(auth_client, courses_fetch):
    comp1511 = courses_fetch["23T2COMP1511"]
    res = auth_client.post(
        f"api/v1/deliverables/crs/{comp1511['id']}",
        json={
            "name": "Sandbox Group Assignment",
            "deliverable_type": "Group",
            "limit": "10 Minutes",
            "weighting": 20,
            "deadline": "Monday 30 April 11:59pm",
            "description": "lorem ipsum dolor amet sit.",
        },
    )
    assert res.status_code == 201


@pytest.mark.parametrize("course", ["23T2COMP1511"])
def test_fetch_deliverable_instances_auto_create(auth_client, get_tut):
    for tut_code in ["H14A23T2COMP1511", "W11B23T2COMP1511"]:
        tut = get_tut[tut_code]
        res = auth_client.get(f"api/v1/deliverables/tut/{tut['id']}")
        assert len(res.json) == 1
        assert res.json[0]["name"] == "Sandbox Group Assignment"
        assert res.json[0]["deliverable_type"] == "Group"
        assert res.json[0]["limit"] == "10 Minutes"
        assert res.json[0]["weighting"] == 20
        assert res.json[0]["deadline"] == "Monday 30 April 11:59pm"
        assert res.json[0]["member_count"] == 0
        # assert res.json["description"] = "lorem ipsum dolor amet sit."


def test_fetch_all_course_deliverables(auth_client, courses_fetch):
    comp1511 = courses_fetch["23T2COMP1511"]
    res = auth_client.get(f"api/v1/deliverables/crs/{comp1511['id']}")
    assert res.status_code == 200
    assert len(res.json) == 1
    assert res.json[0]["name"] == "Sandbox Group Assignment"
    assert res.json[0]["weighting"] == 20
    assert res.json[0]["deadline"] == "Monday 30 April 11:59pm"


def test_update_deliverable_without_authorization(non_creator_client, courses_fetch):
    comp1511 = courses_fetch["23T2COMP1511"]
    res = non_creator_client.get(f"api/v1/deliverables/crs/{comp1511['id']}")
    deliverable_id = res.json[0]["id"]
    res = non_creator_client.put(
        f"api/v1/deliverables/{deliverable_id}",
        json={
            "name": "Sandbox Group Assignment",
            "deliverable_type": "Group",
            "limit": "15 Minutes",
            "weighting": 35,
            "deadline": "Sunday 29 April 11:59pm",
            "description": "lorem ipsum dolor amet sit.",
        },
    )
    assert res.status_code == 403


def test_update_deliverable_with_valid_input(auth_client, courses_fetch):
    comp1511 = courses_fetch["23T2COMP1511"]
    res = auth_client.get(f"api/v1/deliverables/crs/{comp1511['id']}")
    deliverable_id = res.json[0]["id"]
    res = auth_client.put(
        f"api/v1/deliverables/{deliverable_id}",
        json={
            "name": "SANDBOX Group Assignment",
            "deliverable_type": "Group",
            "limit": "15 Minutes",
            "weighting": 35,
            "deadline": "Sunday 29 April 11:59pm",
            "description": "lorem ipsum dolor amet sit.",
        },
    )
    assert res.status_code == 200


@pytest.mark.parametrize("course", ["23T2COMP1511"])
def test_fetch_deliverable_instances_post_update(auth_client, get_tut):
    for tut_code in ["H14A23T2COMP1511", "W11B23T2COMP1511"]:
        tut = get_tut[tut_code]
        res = auth_client.get(f"api/v1/deliverables/tut/{tut['id']}")
        assert len(res.json) == 1
        assert res.json[0]["name"] == "SANDBOX Group Assignment"
        assert res.json[0]["deliverable_type"] == "Group"
        assert res.json[0]["limit"] == "15 Minutes"
        assert res.json[0]["weighting"] == 35
        assert res.json[0]["deadline"] == "Sunday 29 April 11:59pm"
        assert res.json[0]["member_count"] == 0
        # assert res.json["description"] = "lorem ipsum dolor amet sit."


def test_create_tutorial_with_existing_deliverables(auth_client, courses_fetch):
    comp1511 = courses_fetch["23T2COMP1511"]
    res = auth_client.post(
        f"api/v1/tutorials/crs/{comp1511['id']}",
        json={
            "name": "F09A",
            "capacity": 20,
            "datetime": "Friday 9am-11am",
            "location": "Quadrangle G041",
        },
    )
    # DON'T NEED TO CALL THIS ROUTE ANYMORE, THE TUTORIAL ROUTE HANDLES IT
    # tut_id = res.json["id"]
    # The following route must be called when a tutorial is created.
    # It syncs the course's current deliverables with the tutorial.
    # res = auth_client.post(f"api/v1/deliverables/tut/{tut_id}")
    assert res.status_code == 201


@pytest.mark.parametrize("course", ["23T2COMP1511"])
def test_fetch_deliverable_instances_auto_create_in_new_tut(auth_client, get_tut):
    for tut_code in ["H14A23T2COMP1511", "W11B23T2COMP1511", "F09A23T2COMP1511"]:
        tut = get_tut[tut_code]
        res = auth_client.get(f"api/v1/deliverables/tut/{tut['id']}")
        print(res.json)
        assert len(res.json) == 1
        assert res.json[0]["name"] == "SANDBOX Group Assignment"
        assert res.json[0]["deliverable_type"] == "Group"
        assert res.json[0]["limit"] == "15 Minutes"
        assert res.json[0]["weighting"] == 35
        assert res.json[0]["deadline"] == "Sunday 29 April 11:59pm"
        assert res.json[0]["member_count"] == 0
