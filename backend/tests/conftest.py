import pytest
from src.app import create_app, db


@pytest.fixture
def app_ctx():
    app = create_app()
    with app.app_context():
        db.drop_all()
        db.create_all()
        yield


# @pytest.fixture
# def client():
#     app = create_app()
#     app.testing = True
#     with app.test_client() as testclient:
#         with app.app_context():
#             db.create_all()
#             yield testclient
