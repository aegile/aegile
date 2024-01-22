import pytest


def test_create_task_with_null_project_id(auth_client):
    res = auth_client.post(
        "api/v1/tasks",
        json={
            "project_id": None,
            "name": "Task 1",
            "status": "Not Started",
        },
    )
    assert res.status_code == 400


def test_create_task_with_inexistent_project_id(auth_client):
    res = auth_client.post(
        "api/v1/tasks",
        json={
            "project_id": 9999,
            "name": "Task 1",
            "status": "Not Started",
        },
    )
    assert res.status_code == 400


def test_create_task_without_payload_data(auth_client):
    response = auth_client.post("api/v1/tasks", json={})
    assert response.status_code == 400


def test_create_task_with_unauthorized_user(
    non_creator_client,
    projects_fetch,
):
    project = projects_fetch["Test Project 1H14ACOMP1511"]
    res = non_creator_client.post(
        f"api/v1/tasks",
        json={
            "project_id": project["id"],
            "name": "Task 1",
            "status": "Not Started",
        },
    )
    assert res.status_code == 403


def test_create_task_with_extra_fields(auth_client, projects_fetch):
    project = projects_fetch["Test Project 1H14ACOMP1511"]
    res = auth_client.post(
        f"api/v1/tasks",
        json={
            "project_id": project["id"],
            "name": "Task 1",
            "status": "Not Started",
            "extra": "Hello world",
        },
    )
    assert res.status_code == 400


def test_create_task_with_missing_required_fields(auth_client, projects_fetch):
    project = projects_fetch["Test Project 1H14ACOMP1511"]
    res = auth_client.post(
        f"api/v1/tasks",
        json={
            "project_id": project["id"],
            "name": "Task 1",
        },
    )
    assert res.status_code == 400


def test_create_task_with_incorrect_field_types(auth_client, projects_fetch):
    project = projects_fetch["Test Project 1H14ACOMP1511"]
    res = auth_client.post(
        f"api/v1/tasks",
        json={
            "project_id": f"{project['id']}",
            "name": "Task 1",
            "status": "Not Started",
        },
    )
    assert res.status_code == 400


def test_create_task_with_invalid_status(auth_client, projects_fetch):
    project = projects_fetch["Test Project 1H14ACOMP1511"]
    res = auth_client.post(
        f"api/v1/tasks",
        json={
            "project_id": f"{project['id']}",
            "name": "Task 1",
            "status": "Almost Done",
        },
    )
    # "Almost Done" is an invalid status
    assert res.status_code == 400


def test_create_task_with_valid_fields(auth_client, projects_fetch):
    project = projects_fetch["Test Project 1H14ACOMP1511"]
    res = auth_client.post(
        f"api/v1/tasks",
        json={
            "project_id": project["id"],
            "name": "Task 1",
            "status": "Not Started",
        },
    )
    assert res.status_code == 201


def test_create_task_with_optional_fields(auth_client, projects_fetch):
    project = projects_fetch["Test Project 1H14ACOMP1511"]
    res = auth_client.post(
        f"api/v1/tasks",
        json={
            "project_id": project["id"],
            "name": "Task 2",
            "status": "In Progress",
            "description": "Write the executive summary",
            "deadline": "01/01/2024",
            "weighting": 3,
            "priority": "Medium",
            "attachment": "test.img",
        },
    )
    assert res.status_code == 201


def test_create_task_with_invalid_priority(auth_client, projects_fetch):
    project = projects_fetch["Test Project 1H14ACOMP1511"]
    res = auth_client.post(
        f"api/v1/tasks",
        json={
            "project_id": project["id"],
            "name": "Task 3",
            "status": "Not Started",
            "priority": "Urgent",
        },
    )
    # "Urgent" is an invalid priority
    assert res.status_code == 400


def test_fetch_tasks_with_unauthorized_user(non_creator_client):
    res = non_creator_client.get("api/v1/tasks")
    assert res.status_code == 200
    assert len(res.json) == 0


def test_fetch_tasks_with_authorised_user(auth_client, projects_fetch):
    project = projects_fetch["Test Project 1H14ACOMP1511"]
    res = auth_client.get("api/v1/tasks")
    assert res.status_code == 200
    assert len(res.json) == 2
    # For first task
    assert res.json[0]["name"] == "Task 1"
    assert res.json[0]["project_id"] == project["id"]
    assert res.json[0]["status"] == "Not Started"
    assert res.json[0]["description"] is None
    assert res.json[0]["deadline"] is None
    assert res.json[0]["weighting"] is None
    assert res.json[0]["priority"] is None
    assert res.json[0]["attachment"] is None
    # For second task
    assert res.json[1]["name"] == "Task 2"
    assert res.json[1]["project_id"] == project["id"]
    assert res.json[1]["status"] == "In Progress"
    assert res.json[1]["description"] == "Write the executive summary"
    assert res.json[1]["deadline"] == "01/01/2024"
    assert res.json[1]["weighting"] == 3
    assert res.json[1]["priority"] == "Medium"
    assert res.json[1]["attachment"] == "test.img"


def test_edit_existing_task_with_unauthorized_user(non_creator_client, tasks_fetch):
    task = tasks_fetch["Task 1H14ACOMP1511"]
    res = non_creator_client.put(
        f"api/v1/tasks/{task['id']}",
        json={
            "name": "Changed Task 1",
            "status": "In Progress",
            "description": "Create report template",
            "deadline": "01/01/2024",
            "weighting": 2,
            "priority": "Low",
            "attachment": "test.img",
        },
    )
    assert res.status_code == 403


def test_edit_existing_task_with_extra_fields(auth_client, tasks_fetch):
    task = tasks_fetch["Task 1H14ACOMP1511"]
    res = auth_client.put(
        f"api/v1/tasks/{task['id']}",
        json={
            "name": "Changed Task 1",
            "status": "In Progress",
            "description": "Create report template",
            "deadline": "01/01/2024",
            "weighting": 2,
            "priority": "Low",
            "attachment": "test.img",
            "extra_field": "Hello world",
        },
    )
    assert res.status_code == 400


def test_edit_existing_task_with_valid_fields(auth_client, tasks_fetch):
    task = tasks_fetch["Task 1H14ACOMP1511"]
    res = auth_client.put(
        f"api/v1/tasks/{task['id']}",
        json={
            "name": "Changed Task 1",
            "status": "In Progress",
            "description": "Create report template",
            "deadline": "01/01/2024",
            "weighting": 2,
            "priority": "Low",
            "attachment": "test.img",
        },
    )
    assert res.status_code == 200


def test_fetch_edited_task(auth_client, tasks_fetch):
    task = tasks_fetch["Changed Task 1H14ACOMP1511"]
    res = auth_client.get(f"api/v1/tasks/{task['id']}")
    assert res.status_code == 200
    assert res.json["name"] == "Changed Task 1"
    assert res.json["status"] == "In Progress"
    assert res.json["description"] == "Create report template"
    assert res.json["deadline"] == "01/01/2024"
    assert res.json["weighting"] == 2
    assert res.json["priority"] == "Low"
    assert res.json["attachment"] == "test.img"


def test_fetch_tasks_in_project(auth_client, projects_fetch):
    project = projects_fetch["Test Project 1H14ACOMP1511"]
    res = auth_client.get(f"api/v1/tasks/prj/{project['id']}")
    assert res.status_code == 200
    assert len(res.json) == 2
    # For first task
    assert res.json[0]["name"] == "Changed Task 1"
    assert res.json[0]["status"] == "In Progress"
    assert res.json[0]["description"] == "Create report template"
    assert res.json[0]["deadline"] == "01/01/2024"
    assert res.json[0]["weighting"] == 2
    assert res.json[0]["priority"] == "Low"
    assert res.json[0]["attachment"] == "test.img"
    # For second task
    assert res.json[1]["name"] == "Task 2"
    assert res.json[1]["status"] == "In Progress"
    assert res.json[1]["description"] == "Write the executive summary"
    assert res.json[1]["deadline"] == "01/01/2024"
    assert res.json[1]["weighting"] == 3
    assert res.json[1]["priority"] == "Medium"
    assert res.json[1]["attachment"] == "test.img"


def test_assign_task_to_non_project_member(auth_client, users_fetch, tasks_fetch):
    task = tasks_fetch["Changed Task 1H14ACOMP1511"]
    userAlex = users_fetch["alex@email.com"]
    userJohn = users_fetch["john@email.com"]

    res = auth_client.post(
        f"api/v1/tasks/{task['id']}/members",
        json={"members": [userJohn["handle"], userAlex["handle"]]},
    )
    # Assigning Alex to the task fails since he is not a project member
    assert res.status_code == 404


def test_fetch_task_info_by_project_member(
    auth_client,
    non_creator_client,
    users_fetch,
    courses_fetch,
    tutorials_fetch,
    projects_fetch,
    tasks_fetch,
):
    # User Alex needs to join the COMP1511 course, tutorial and project to gain
    # permission to view the project's task information (note: he doesn't need
    # to be the task's assignee to view its info)
    comp1511 = courses_fetch["23T2COMP1511"]
    tut = tutorials_fetch["H14ACOMP1511"]
    project = projects_fetch["Test Project 1H14ACOMP1511"]
    userAlex = users_fetch["alex@email.com"]
    task = tasks_fetch["Changed Task 1H14ACOMP1511"]

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

    # Now Alex is fetching the task info and its assignees
    res = non_creator_client.get(f"api/v1/tasks/{task['id']}")
    assert res.status_code == 200
    assert res.json["name"] == "Changed Task 1"
    assert res.json["status"] == "In Progress"
    assert res.json["description"] == "Create report template"
    assert res.json["deadline"] == "01/01/2024"
    assert res.json["weighting"] == 2
    assert res.json["priority"] == "Low"
    assert res.json["attachment"] == "test.img"

    res = non_creator_client.get(f"api/v1/tasks/{task['id']}/members")
    assert len(res.json["members"]) == 1
    assert res.json["members"][0]["first_name"] == "John"
    assert res.json["members"][0]["last_name"] == "Smith"
    assert res.json["members"][0]["handle"] == "JohnSmith"
    assert res.json["members"][0]["email"] == "john@email.com"


def test_set_task_assignees(auth_client, users_fetch, tasks_fetch):
    task = tasks_fetch["Changed Task 1H14ACOMP1511"]
    userAlex = users_fetch["alex@email.com"]
    userJohn = users_fetch["john@email.com"]

    # John (task creator) has permission to set himself and Alex as assignees
    res = auth_client.post(
        f"api/v1/tasks/{task['id']}/members",
        json={"members": [userJohn["handle"], userAlex["handle"]]},
    )
    assert res.status_code == 201


def test_fetch_new_task_assignees(auth_client, tasks_fetch):
    task = tasks_fetch["Changed Task 1H14ACOMP1511"]
    res = auth_client.get(f"api/v1/tasks/{task['id']}/members")
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


def test_delete_task_by_unauthorized_user(non_creator_client, tasks_fetch):
    task = tasks_fetch["Changed Task 1H14ACOMP1511"]
    res = non_creator_client.delete(f"api/v1/tasks/{task['id']}")
    assert res.status_code == 403


def test_delete_task_by_creator(auth_client, tasks_fetch):
    task = tasks_fetch["Changed Task 1H14ACOMP1511"]
    res = auth_client.delete(f"api/v1/tasks/{task['id']}")
    assert res.status_code == 200

    rem_tasks = auth_client.get("api/v1/tasks").json
    assert len(rem_tasks) == 1
    assert rem_tasks[0]["name"] == "Task 2"
    assert rem_tasks[0]["status"] == "In Progress"
    assert rem_tasks[0]["description"] == "Write the executive summary"
    assert rem_tasks[0]["deadline"] == "01/01/2024"
    assert rem_tasks[0]["weighting"] == 3
    assert rem_tasks[0]["priority"] == "Medium"
    assert rem_tasks[0]["attachment"] == "test.img"
