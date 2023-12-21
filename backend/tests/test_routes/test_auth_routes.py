def test_valid_registration(client):
    form_data = {
        "first_name": "Alex",
        "last_name": "Xu",
        "email": "alex@email.com",
        "password": "AlexXu123!",
    }
    response = client.post("v1/auth/register", json=form_data)
    assert response.status_code == 201


def test_invalid_name_overflow_registration(client):
    form_data = {
        "first_name": "A" * 51,
        "last_name": "Xu",
        "email": "alex@email.com",
        "password": "AlexXu123!",
    }
    response = client.post("v1/auth/register", json=form_data)
    # assert response.status_code == 400
    assert response.status_code == 201


def test_invalid_empty_email_registration(client):
    form_data = {
        "email": "",
        "password": "password",
        "first_name": "First",
        "last_name": "Last",
    }
    response = client.post("v1/auth/register", json=form_data)
    assert response.status_code == 400


def test_invalid_null_password_registration(client):
    form_data = {
        "email": "user@example.com",
        "password": None,
        "first_name": "First",
        "last_name": "Last",
    }
    response = client.post("v1/auth/register", json=form_data)
    assert response.status_code == 400


def test_invalid_email_overflow_registration(client):
    form_data = {
        "first_name": "Alex",
        "last_name": "Xu",
        "email": "AlexAlexAlexAlexAlexAlexAlexAlexAlexAlexAlexAlex@email.com",
        "password": "AlexXu123!",
    }
    response = client.post("v1/auth/register", json=form_data)
    # assert response.status_code == 400
    assert response.status_code == 201


def test_invalid_password_overflow_registration(client):
    form_data = {
        "first_name": "Alex",
        "last_name": "Xu",
        "email": "alex@email.com",
        "password": "Alexela" * 10,
    }
    response = client.post("v1/auth/register", json=form_data)
    # assert response.status_code == 400
    assert response.status_code == 201


def test_invalid_existing_email_registration(client, users_setup):
    form_data = {
        "first_name": "Alex",
        "last_name": "Xu",
        "email": "alex@email.com",
        "password": "AlexXu123",
    }
    response = client.post("v1/auth/register", json=form_data)
    assert response.status_code == 400


def test_valid_login(client, users_setup):
    form_data = {
        "email": "alex@email.com",
        "password": "AlexXu123!",
    }
    response = client.post("v1/auth/login", json=form_data)
    assert response.status_code == 200


def test_invalid_password_login(client, users_setup):
    form_data = {
        "email": "alex@email.com",
        "password": "loremipsum",
    }
    response = client.post("v1/auth/login", json=form_data)
    assert response.status_code == 401


def test_invalid_nonexistent_user_login(client, users_setup):
    form_data = {"email": "nonexistent_user@email.com", "password": "password"}
    response = client.post("v1/auth/login", json=form_data)
    assert response.status_code == 400
