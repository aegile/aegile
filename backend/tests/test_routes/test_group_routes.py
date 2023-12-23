def test_valid_group_creation(auth_client, tutorials_setup):
    tut = next(
        (tut for tut in tutorials_setup if tut["course_code"] == "COMP1511"),
        None,
    )
    response = auth_client.post(
        "v1/groups",
        json={
            "name": "Group 1",
            "tutorial_id": tut["id"],
            "course_code": tut["course_code"],
            "userset": [user["handle"] for user in tut["userset"]],
        },
    )
    assert response.status_code == 201


def test_valid_additional_tut_group_creation(auth_client, groups_setup):
    group = next(
        (group for group in groups_setup if group["course_code"] == "COMP1511"),
        None,
    )
    response = auth_client.post(
        "v1/groups",
        json={
            "name": "Group 2",
            "tutorial_id": group["tutorial_id"],
            "course_code": group["course_code"],
            "userset": [],
        },
    )
    assert response.status_code == 400


def test_user_exists_in_another_group_creation(auth_client, groups_setup):
    group = next(
        (group for group in groups_setup if group["course_code"] == "COMP1511"),
        None,
    )
    response = auth_client.post(
        "v1/groups",
        json={
            "name": "Group 2",
            "tutorial_id": group["tutorial_id"],
            "course_code": group["course_code"],
            "userset": [user["handle"] for user in group["userset"]],
        },
    )
    assert response.status_code == 400


def test_invalid_tutorial_id_creation(auth_client, groups_setup):
    group = next(
        (group for group in groups_setup if group["course_code"] == "COMP1511"),
        None,
    )
    response = auth_client.post(
        "v1/groups",
        json={
            "name": "Group 1",
            "tutorial_id": "invalid_tut_id",
            "course_code": group["course_code"],
            "userset": [user["handle"] for user in group["userset"]],
        },
    )
    assert response.status_code == 400


def test_duplicate_group_name_creation(auth_client, groups_setup):
    group = next(
        (group for group in groups_setup if group["course_code"] == "COMP1511"),
        None,
    )
    response = auth_client.post(
        "v1/groups",
        json={
            "name": "Group 1",
            "tutorial_id": group["tutorial_id"],
            "course_code": group["course_code"],
            "userset": [user["handle"] for user in group["userset"]],
        },
    )
    assert response.status_code == 400


def test_nonexistent_user_creation(auth_client, groups_setup):
    group = next(
        (group for group in groups_setup if group["course_code"] == "COMP1511"),
        None,
    )
    response = auth_client.post(
        "v1/groups",
        json={
            "name": "Group 1",
            "tutorial_id": group["tutorial_id"],
            "course_code": group["course_code"],
            "userset": ["nonexistent_user"],
        },
    )
    assert response.status_code == 400


def test_empty_group_name_creation(auth_client, groups_setup):
    group = next(
        (group for group in groups_setup if group["course_code"] == "COMP1511"),
        None,
    )
    response = auth_client.post(
        "v1/groups",
        json={
            "name": "",
            "tutorial_id": group["tutorial_id"],
            "course_code": group["course_code"],
            "userset": [user["handle"] for user in group["userset"]],
        },
    )
    assert response.status_code == 400


def test_valid_group_fetchall(auth_client, groups_setup):
    # should only return two tutorials,
    # for COMP1511's H14A tut and COMP2511's H14A tut

    response = auth_client.get("v1/groups")
    assert response.status_code == 200
    assert len(response.json) == 2

    assert any(group["name"] == "Group 1" for group in response.json)
    assert any(group["course_code"] == "COMP1511" for group in response.json)
    assert any(group["course_code"] == "COMP2511" for group in response.json)


def test_valid_group_fetch(auth_client, groups_setup):
    group = next(
        (group for group in groups_setup if group["course_code"] == "COMP1511"),
        None,
    )
    response = auth_client.get(f"v1/groups/{group['id']}")
    assert response.status_code == 200
    assert response.json["name"] == "Group 1"
    assert response.json["course_code"] == "COMP1511"
    assert len(response.json["userset"]) == 4


def test_invalid_group_id_fetch(auth_client, groups_setup):
    response = auth_client.get("v1/groups/9999")
    assert response.status_code == 400


def test_valid_group_update(auth_client, groups_setup):
    group = next(
        (group for group in groups_setup if group["course_code"] == "COMP1511"),
        None,
    )
    response = auth_client.put(
        f"v1/groups/{group['id']}",
        json={
            "name": "Group 2",
            "userset": [],
        },
    )
    assert response.status_code == 200


def test_invalid_group_id_update(auth_client, groups_setup):
    response = auth_client.put(
        "v1/groups/9999",
        json={
            "name": "Group 2",
            "userset": [],
        },
    )
    assert response.status_code == 400


def test_duplicate_group_name_update(auth_client, groups_setup):
    pass


def test_duplicate_user_in_group_update(auth_client, groups_setup):
    pass


def test_nonexistent_user_in_group_update(auth_client, groups_setup):
    group = next(
        (group for group in groups_setup if group["course_code"] == "COMP1511"),
        None,
    )
    response = auth_client.put(
        f"v1/groups/{group['id']}",
        json={
            "name": "Group 2",
            "userset": ["nonexistent_user"],
        },
    )
    assert response.status_code == 400


def test_user_not_in_tutorial_group_update(auth_client, groups_setup):
    groupA = next(
        (group for group in groups_setup if group["course_code"] == "COMP1511"),
        None,
    )
    groupC = next(
        (group for group in groups_setup if group["course_code"] == "COMP6080"),
        None,
    )
    response = auth_client.put(
        f"v1/groups/{groupC['id']}",
        json={
            "name": "Group 2",
            "userset": [user["handle"] for user in groupA["userset"]],
        },
    )
    assert response.status_code == 400


def test_user_exists_in_another_group_update(auth_client, groups_setup):
    pass


def test_valid_group_delete(auth_client, groups_setup):
    group = next(
        (group for group in groups_setup if group["course_code"] == "COMP1511"),
        None,
    )
    assert len(auth_client.get("v1/groups").json) == 2
    response = auth_client.delete(f"v1/groups/{group['id']}")
    assert response.status_code == 200
    assert len(auth_client.get("v1/groups").json) == 1


def test_invalid_group_id_delete(auth_client, groups_setup):
    response = auth_client.delete("v1/groups/9999")
    assert response.status_code == 200
