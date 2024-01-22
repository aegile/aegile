import pytest


pytestmark = pytest.mark.no_projects_setup


def test_create_project_with_invalid_instance_id(auth_client):
    res = auth_client.post(
        "api/v1/projects",
        json={
            "deliverable_instance_id": None,
            "name": "Group Assignment 1",
        },
    )
    assert res.status_code == 400


def test_create_project_without_payload_data(auth_client):
    response = auth_client.post("api/v1/projects", json={})
    assert response.status_code == 400


def test_create_project_with_unauthorized_user(
    non_creator_client,
    courses_fetch,
    tutorials_fetch,
    deliverable_instances_fetch,
):
    comp1511 = courses_fetch["23T2COMP1511"]
    tut = tutorials_fetch["H14ACOMP1511"]
    instance = deliverable_instances_fetch["Sandbox Group AssignmentH14ACOMP1511"]
    res = non_creator_client.post(
        f"api/v1/projects",
        json={
            "course_id": comp1511["id"],
            "tutorial_id": tut["id"],
            "deliverable_instance_id": instance["id"],
            "name": "Group Assignment 1",
        },
    )
    assert res.status_code == 403


def test_create_projects_with_extra_fields(
    auth_client, courses_fetch, tutorials_fetch, deliverable_instances_fetch
):
    comp1511 = courses_fetch["23T2COMP1511"]
    tut = tutorials_fetch["H14ACOMP1511"]
    instance = deliverable_instances_fetch["Sandbox Group AssignmentH14ACOMP1511"]
    res = auth_client.post(
        "api/v1/projects",
        json={
            "course_id": comp1511["id"],
            "tutorial_id": tut["id"],
            "deliverable_instance_id": instance["id"],
            "name": "Group Assignment 1",
            "extra_field": "Hello hello",
        },
    )
    assert res.status_code == 400


def test_create_projects_with_missing_required_fields(
    auth_client, courses_fetch, tutorials_fetch, deliverable_instances_fetch
):
    comp1511 = courses_fetch["23T2COMP1511"]
    tut = tutorials_fetch["H14ACOMP1511"]
    instance = deliverable_instances_fetch["Sandbox Group AssignmentH14ACOMP1511"]
    res = auth_client.post(
        "api/v1/projects",
        json={
            "course_id": comp1511["id"],
            "tutorial_id": tut["id"],
            "deliverable_instance_id": instance["id"],
        },
    )
    assert res.status_code == 400


def test_create_projects_with_incorrect_field_types(
    auth_client, courses_fetch, tutorials_fetch, deliverable_instances_fetch
):
    comp1511 = courses_fetch["23T2COMP1511"]
    tut = tutorials_fetch["H14ACOMP1511"]
    instance = deliverable_instances_fetch["Sandbox Group AssignmentH14ACOMP1511"]
    res = auth_client.post(
        "api/v1/projects",
        json={
            "course_id": f"{comp1511['id']}",
            "tutorial_id": f"{tut['id']}",
            "deliverable_instance_id": f"{instance['id']}",
            "name": 1234,
        },
    )
    assert res.status_code == 400


def test_create_project_with_valid_fields(
    auth_client, courses_fetch, tutorials_fetch, deliverable_instances_fetch
):
    comp1511 = courses_fetch["23T2COMP1511"]
    tut = tutorials_fetch["H14ACOMP1511"]
    instance = deliverable_instances_fetch["Sandbox Group AssignmentH14ACOMP1511"]
    res = auth_client.post(
        "api/v1/projects",
        json={
            "course_id": comp1511["id"],
            "tutorial_id": tut["id"],
            "deliverable_instance_id": instance["id"],
            "name": "Group Assignment 1",
        },
    )
    assert res.status_code == 201


def test_create_project_with_optional_fields(
    auth_client, courses_fetch, tutorials_fetch, deliverable_instances_fetch
):
    comp1511 = courses_fetch["23T2COMP1511"]
    tut = tutorials_fetch["H14ACOMP1511"]
    instance = deliverable_instances_fetch["Sandbox Group AssignmentH14ACOMP1511"]
    res = auth_client.post(
        "api/v1/projects",
        json={
            "course_id": comp1511["id"],
            "tutorial_id": tut["id"],
            "deliverable_instance_id": instance["id"],
            "name": "Group Assignment 2",
            "subheading": "Assignment 2 for COMP1511",
            "description": "This is an assignment in groups of 5 students",
            "end_date": "31/04/2024",
        },
    )
    assert res.status_code == 201


def test_create_project_with_duplicate_name_in_same_deliverable_instance(
    auth_client, courses_fetch, tutorials_fetch, deliverable_instances_fetch
):
    comp1511 = courses_fetch["23T2COMP1511"]
    tut = tutorials_fetch["H14ACOMP1511"]
    instance = deliverable_instances_fetch["Sandbox Group AssignmentH14ACOMP1511"]
    res = auth_client.post(
        "api/v1/projects",
        json={
            "course_id": comp1511["id"],
            "tutorial_id": tut["id"],
            "deliverable_instance_id": instance["id"],
            "name": "Group Assignment 1",
            "subheading": "A duplicate of the original Group Assignment 1 Project",
        },
    )
    assert res.status_code == 400


def test_fetch_projects_with_unauthorized_user(non_creator_client):
    res = non_creator_client.get("api/v1/projects")
    assert len(res.json) == 0


def test_fetch_projects_with_authorised_user(
    auth_client, courses_fetch, tutorials_fetch
):
    comp1511 = courses_fetch["23T2COMP1511"]
    tut = tutorials_fetch["H14ACOMP1511"]
    res = auth_client.get("api/v1/projects")
    assert len(res.json) == 2
    # For first project
    assert res.json[0]["name"] == "Group Assignment 1"
    assert res.json[0]["course_id"] == comp1511["id"]
    assert res.json[0]["tutorial_id"] == tut["id"]
    assert res.json[0]["subheading"] is None
    # For second project
    assert res.json[1]["name"] == "Group Assignment 2"
    assert res.json[1]["course_id"] == comp1511["id"]
    assert res.json[1]["tutorial_id"] == tut["id"]
    assert res.json[1]["subheading"] == "Assignment 2 for COMP1511"
    assert res.json[1]["description"] == "This is an assignment in groups of 5 students"
    assert res.json[1]["end_date"] == "31/04/2024"


def test_fetch_projects_in_deliverable_instance_with_unauthorized_user(
    non_creator_client, deliverable_instances_fetch
):
    instance = deliverable_instances_fetch["Sandbox Group AssignmentH14ACOMP1511"]
    res = non_creator_client.get(f"api/v1/projects/instance/{instance['id']}")
    assert res.status_code == 403


def test_fetch_projects_in_deliverable_instance_with_authorized_user(
    auth_client, courses_fetch, tutorials_fetch, deliverable_instances_fetch
):
    comp1511 = courses_fetch["23T2COMP1511"]
    tut = tutorials_fetch["H14ACOMP1511"]
    instance = deliverable_instances_fetch["Sandbox Group AssignmentH14ACOMP1511"]
    res = auth_client.get(f"api/v1/projects/instance/{instance['id']}")
    assert res.status_code == 200
    assert len(res.json) == 2
    assert res.json[0]["name"] == "Group Assignment 1"
    assert res.json[0]["course_id"] == comp1511["id"]
    assert res.json[0]["tutorial_id"] == tut["id"]
    assert res.json[0]["subheading"] is None
    assert res.json[1]["name"] == "Group Assignment 2"
    assert res.json[1]["course_id"] == comp1511["id"]
    assert res.json[1]["tutorial_id"] == tut["id"]
    assert res.json[1]["subheading"] == "Assignment 2 for COMP1511"
    assert res.json[1]["description"] == "This is an assignment in groups of 5 students"
    assert res.json[1]["end_date"] == "31/04/2024"


def test_edit_existing_project_with_unauthorized_user(
    non_creator_client, projects_fetch
):
    project = projects_fetch["Group Assignment 1H14ACOMP1511"]
    res = non_creator_client.put(
        f"api/v1/projects/{project['id']}",
        json={
            "name": "Group Proj 1",
            "subheading": "This is our little project",
            "description": "5 member project",
            "end_date": "01/01/2024",
        },
    )
    assert res.status_code == 403


def test_edit_existing_project_with_extra_fields(auth_client, projects_fetch):
    project = projects_fetch["Group Assignment 1H14ACOMP1511"]
    res = auth_client.put(
        f"api/v1/projects/{project['id']}",
        json={
            "name": "Group Proj 1",
            "subheading": "This is our little project",
            "description": "5 member project",
            "end_date": "01/01/2024",
            "extra_field": "Hello world",
        },
    )
    assert res.status_code == 400


def test_edit_existing_project_with_valid_fields(auth_client, projects_fetch):
    project = projects_fetch["Group Assignment 1H14ACOMP1511"]
    res = auth_client.put(
        f"api/v1/projects/{project['id']}",
        json={
            "name": "Group Project 1",
            "subheading": "This is our little project",
            "description": "5 member project",
        },
    )
    assert res.status_code == 200


def test_fetch_edited_project(auth_client, projects_fetch):
    project = projects_fetch["Group Project 1H14ACOMP1511"]
    res = auth_client.get(f"api/v1/projects/{project['id']}")
    assert res.status_code == 200
    assert res.json["name"] == "Group Project 1"
    assert res.json["subheading"] == "This is our little project"
    assert res.json["description"] == "5 member project"
    # end_date field was not updated
    assert res.json["end_date"] is None


def test_enrol_already_enrolled_member_to_project(auth_client, projects_fetch):
    project = projects_fetch["Group Project 1H14ACOMP1511"]
    res = auth_client.post(f"api/v1/projects/{project['id']}/enroll")
    assert res.status_code == 400


def test_self_enroll_user_to_project(
    auth_client,
    non_creator_client,
    users_fetch,
    courses_fetch,
    tutorials_fetch,
    projects_fetch,
):
    # User Alex needs to join the COMP1511 course and tutorial before he can
    # self-enrol into a project
    comp1511 = courses_fetch["23T2COMP1511"]
    tut = tutorials_fetch["H14ACOMP1511"]
    userAlex = users_fetch["alex@email.com"]
    project = projects_fetch["Group Project 1H14ACOMP1511"]

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

    # Using non_creator_client so Alex can self enrol into the project
    res = non_creator_client.post(f"api/v1/projects/{project['id']}/enroll")
    assert res.status_code == 201

    res = non_creator_client.get(f"api/v1/projects/{project['id']}/members")
    assert res.status_code == 200
    assert len(res.json["members"]) == 2
    assert any(user["email"] == "alex@email.com" for user in res.json["members"])


def test_self_enroll_in_another_project_in_same_deliverable(
    non_creator_client, projects_fetch
):
    diff_project = projects_fetch["Group Assignment 2H14ACOMP1511"]

    # Alex tries to enrol in another project in the same deliverable instance
    # even though he is already enrolled in a project
    res = non_creator_client.post(f"api/v1/projects/{diff_project['id']}/enroll")
    assert res.status_code == 400


def test_fetch_project_members(auth_client, projects_fetch):
    project = projects_fetch["Group Project 1H14ACOMP1511"]
    res = auth_client.get(f"api/v1/projects/{project['id']}/members")
    assert res.status_code == 200
    assert len(res.json["members"]) == 2
    assert res.json["members"][0]["first_name"] == "John"
    assert res.json["members"][0]["last_name"] == "Smith"
    assert res.json["members"][0]["handle"] == "JohnSmith"
    assert res.json["members"][0]["email"] == "john@email.com"
    assert res.json["members"][1]["first_name"] == "Alex"
    assert res.json["members"][1]["last_name"] == "Xu"
    assert res.json["members"][1]["handle"] == "AlexXu"
    assert res.json["members"][1]["email"] == "alex@email.com"


def test_creator_leave_project(auth_client, projects_fetch):
    project = projects_fetch["Group Project 1H14ACOMP1511"]
    res = auth_client.delete(f"api/v1/projects/{project['id']}/leave")
    assert res.status_code == 400


def test_self_leave_user_from_project(auth_client, non_creator_client, projects_fetch):
    # User Alex is now self leaving the project
    project = projects_fetch["Group Project 1H14ACOMP1511"]

    res = non_creator_client.delete(f"api/v1/projects/{project['id']}/leave")
    assert res.status_code == 200
    # Alex is no longer a member of the project
    res = auth_client.get(f"api/v1/projects/{project['id']}/members")
    assert res.status_code == 200
    assert len(res.json["members"]) == 1
    assert res.json["members"][0]["handle"] == "JohnSmith"


def test_invalid_leave_not_in_project(non_creator_client, projects_fetch):
    project = projects_fetch["Group Project 1H14ACOMP1511"]

    # Alex tries leaving the project even though he is no longer a member
    res = non_creator_client.delete(f"api/v1/projects/{project['id']}/leave")
    assert res.status_code == 400


def test_delete_project_by_unauthorized_user(non_creator_client, projects_fetch):
    project = projects_fetch["Group Project 1H14ACOMP1511"]
    res = non_creator_client.delete(f"api/v1/projects/{project['id']}")
    assert res.status_code == 403


def test_delete_project_by_creator(auth_client, projects_fetch):
    project = projects_fetch["Group Project 1H14ACOMP1511"]
    res = auth_client.delete(f"api/v1/projects/{project['id']}")
    assert res.status_code == 200

    rem_projects = auth_client.get("api/v1/projects").json
    assert len(rem_projects) == 1
    assert rem_projects[0]["name"] == "Group Assignment 2"
    assert rem_projects[0]["subheading"] == "Assignment 2 for COMP1511"
    assert (
        rem_projects[0]["description"]
        == "This is an assignment in groups of 5 students"
    )
    assert rem_projects[0]["end_date"] == "31/04/2024"
