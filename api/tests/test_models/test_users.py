import pytest
from sqlalchemy.exc import IntegrityError
from src.models.user import User


@pytest.fixture(scope="function")
def _init_users(test_db):
    user1 = User(
        first_name="Alex",
        last_name="Xu",
        email="alex@email.com",
        password="AlexXu123!",
    )
    user2: User = User(
        first_name="Sam",
        last_name="Yu",
        email="sam@email.com",
        password="SamYu123!",
    )
    user3: User = User(
        first_name="Philip",
        last_name="Tran",
        email="philip@email.com",
        password="PhilipTran123!",
    )
    test_db.session.add(user1)
    test_db.session.add(user2)
    test_db.session.add(user3)
    test_db.session.commit()
    return test_db


def test_user_creation(_init_users):
    test_db = _init_users
    inserted_user: User = test_db.session.scalars(
        test_db.select(User).filter_by(email="alex@email.com")
    ).first()
    assert inserted_user is not None
    assert inserted_user.first_name == "Alex"
    assert inserted_user.last_name == "Xu"
    assert inserted_user.email == "alex@email.com"
    assert inserted_user.password == "AlexXu123!"


def test_user_update(_init_users):
    test_db = _init_users
    user: User = test_db.session.scalars(
        test_db.select(User).filter_by(email="alex@email.com")
    ).first()
    user.first_name = "Aleks"
    test_db.session.commit()

    updated_user: User = test_db.session.scalars(
        test_db.select(User).filter_by(email="alex@email.com")
    ).first()
    assert updated_user.first_name == "Aleks"


def test_user_deletion(_init_users):
    test_db = _init_users
    user: User = test_db.session.scalars(
        test_db.select(User).filter_by(email="alex@email.com")
    ).first()

    test_db.session.delete(user)
    test_db.session.commit()

    deleted_user: User = test_db.session.scalars(
        test_db.select(User).filter_by(email="alex@email.com")
    ).first()
    assert deleted_user is None


def test_duplicate_user_email(_init_users):
    test_db = _init_users
    new_user: User = User(
        first_name="Vincent",
        last_name="Wong",
        email="alex@email.com",
        password="VincentWong123!",
    )

    with pytest.raises(IntegrityError):
        test_db.session.add(new_user)
        test_db.session.commit()


def test_get_all_users(_init_users):
    test_db = _init_users
    users = test_db.session.scalars(test_db.select(User)).all()
    assert len(users) == 3
