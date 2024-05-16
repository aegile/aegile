import pytest
from fastapi.testclient import TestClient
from src import create_app, sessionmanager


@pytest.fixture(scope="module")
def test_client():
    sessionmanager.drop_tables()
    sessionmanager.create_tables()
    app = create_app()
    client = TestClient(app)
    yield client


@pytest.fixture(scope="module", autouse=True)
def register_users(test_client):
    users = [
        {
            "first_name": "Alex",
            "last_name": "Xu",
            "email": "alex1@email.com",
            "password": "AlexXu123!",
        },
        {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe@email.com",
            "password": "JohnDoe123!",
        },
        {
            "first_name": "Jane",
            "last_name": "Doe",
            "email": "jane.doe@email.com",
            "password": "JaneDoe123!",
        },
    ]

    for user in users:
        response = test_client.post("/api/auth/register", json=user)
        assert response.status_code == 200
        assert response.json() == {"message": "User registered successfully!!"}
