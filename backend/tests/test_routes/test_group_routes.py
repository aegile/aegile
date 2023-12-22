# def test_valid_group_creation(auth_client, tutorials_setup):
#     tut1 = tutorials_setup[0]
#     response = auth_client.post(
#         "v1/groups",
#         json={
#             "name": "Group 1",
#             "tutorial_id": tut1["id"],
#             "course_code": tut1["course_code"],
#             "userset": [user["handle"] for user in tut1["userset"]],
#         },
#     )
#     assert response.status_code == 201
#     response = auth_client.get("v1/groups")
#     assert response.status_code == 200
#     assert response.json[0]["name"] == "Group 1"
#     assert response.json[0]["tutorial_id"] == tut1["id"]
#     assert response.json[0]["course_code"] == tut1["course_code"]
#     assert len(response.json[0]["userset"]) == 2


# def test_invalid_group_creation_no_name(auth_client, tutorials_setup):
#     tut1 = tutorials_setup[0]
#     response = auth_client.post(
#         "v1/groups",
#         json={
#             "tutorial_id": tut1["id"],
#             "course_code": tut1["course_code"],
#             "userset": ["user1", "user2"],
#         },
#     )
#     assert response.status_code == 400


# def test_invalid_group_creation_no_tutorial_id(auth_client, tutorials_setup):
#     response = auth_client.post(
#         "v1/groups",
#         json={
#             "name": "Group 1",
#             "course_code": "COMP1511",
#             "userset": ["user1", "user2"],
#         },
#     )
#     assert response.status_code == 400


# def test_invalid_group_creation_no_course_code(auth_client, tutorials_setup):
#     tut1 = tutorials_setup[0]
#     response = auth_client.post(
#         "v1/groups",
#         json={
#             "name": "Group 1",
#             "tutorial_id": tut1["id"],
#             "userset": ["user1", "user2"],
#         },
#     )
#     assert response.status_code == 400


# def test_invalid_group_creation_no_userset(auth_client, tutorials_setup):
#     tut1 = tutorials_setup[0]
#     response = auth_client.post(
#         "v1/groups",
#         json={
#             "name": "Group 1",
#             "tutorial_id": tut1["id"],
#             "course_code": tut1["course_code"],
#         },
#     )
#     assert response.status_code == 400


# def test_valid_group_creation_empty_userset(auth_client, tutorials_setup):
#     tut1 = tutorials_setup[0]
#     response = auth_client.post(
#         "v1/groups",
#         json={
#             "name": "Group 1",
#             "tutorial_id": tut1["id"],
#             "course_code": tut1["course_code"],
#             "userset": [],
#         },
#     )
#     assert response.status_code == 201
#     response = auth_client.get("v1/groups")
#     assert response.status_code == 200
#     assert response.json[0]["name"] == "Group 1"
#     assert response.json[0]["tutorial_id"] == tut1["id"]
#     assert response.json[0]["course_code"] == tut1["course_code"]
#     assert len(response.json[0]["userset"]) == 0


# def test_invalid_group_creation_nonexistent_user(auth_client, tutorials_setup):
#     tut1 = tutorials_setup[0]
#     response = auth_client.post(
#         "v1/groups",
#         json={
#             "name": "Group 1",
#             "tutorial_id": tut1["id"],
#             "course_code": tut1["course_code"],
#             "userset": ["nonexistent_user"],
#         },
#     )
#     assert response.status_code == 400


# def test_invalid_group_creation_duplicate_user(auth_client, tutorials_setup):
#     tut1 = tutorials_setup[0]
#     response = auth_client.post(
#         "v1/groups",
#         json={
#             "name": "Group 1",
#             "tutorial_id": tut1["id"],
#             "course_code": tut1["course_code"],
#             "userset": [tut1["userset"][0]["handle"], tut1["userset"][0]["handle"]],
#         },
#     )
#     assert response.status_code == 400


# def test_invalid_group_creation_duplicate_group(auth_client, tutorials_setup):
#     tut1 = tutorials_setup[0]
#     auth_client.post(
#         "v1/groups",
#         json={
#             "name": "Group 1",
#             "tutorial_id": tut1["id"],
#             "course_code": tut1["course_code"],
#             "userset": [tut1["userset"][0]["handle"], tut1["userset"][0]["handle"]],
#         },
#     )
#     response = auth_client.post(
#         "v1/groups",
#         json={
#             "name": "Group 1",
#             "tutorial_id": tut1["id"],
#             "course_code": tut1["course_code"],
#             "userset": [],
#         },
#     )
#     assert response.status_code == 400


# def test_invalid_group_fetch(auth_client):
#     response = auth_client.get("v1/groups/9999")
#     assert response.status_code == 400


# def test_valid_group_update(auth_client, tutorials_setup):
#     tut1 = tutorials_setup[0]
#     auth_client.post(
#         "v1/groups",
#         json={
#             "name": "Group 1",
#             "tutorial_id": tut1["id"],
#             "course_code": tut1["course_code"],
#             "userset": [user["handle"] for user in tut1["userset"]],
#         },
#     )
#     group_id = auth_client.get("v1/groups").json[0]["id"]
#     response = auth_client.put(
#         f"v1/groups/{group_id}",
#         json={"name": "Group 2", "userset": [tut1["userset"][0]["handle"]]},
#     )

#     assert response.status_code == 201
#     response = auth_client.get(f"v1/groups/{group_id}")
#     assert response.status_code == 200
#     assert response.json["name"] == "Group 2"
#     assert len(response.json["userset"]) == 1


# def test_delete_group(auth_client, tutorials_setup):
#     tut1 = tutorials_setup[0]
#     auth_client.post(
#         "v1/groups",
#         json={
#             "name": "Group 1",
#             "tutorial_id": tut1["id"],
#             "course_code": tut1["course_code"],
#             "userset": [user["handle"] for user in tut1["userset"]],
#         },
#     )
#     group_id = auth_client.get("v1/groups").json[0]["id"]
#     response = auth_client.get("v1/groups")
#     assert len(response.json) == 1

#     response = auth_client.delete(f"v1/groups/{group_id}")
#     assert response.status_code == 200

#     response = auth_client.get("v1/groups")
#     assert len(response.json) == 0
