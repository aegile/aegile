import pytest
from sqlalchemy.exc import IntegrityError
from src.models.course import Course
from src.models.user import User, UserSet


def test_course_creation(test_db):
    new_course = Course(code="COMP1511", name="Programming Fundamentals")
    test_db.session.add(new_course)
    test_db.session.commit()
    inserted_course = test_db.session.scalars(
        test_db.select(Course).filter_by(code="COMP1511")
    ).first()
    assert inserted_course is not None
    assert inserted_course.code == "COMP1511"
    assert inserted_course.name == "Programming Fundamentals"


def test_course_update(test_db):
    new_course = Course(code="COMP1511", name="Programming Fundamentals")
    test_db.session.add(new_course)
    test_db.session.commit()

    course_data = {"code": "COMP1511", "name": "Programming Fundamentals Updated"}
    new_course.update(course_data)
    test_db.session.commit()

    updated_course = test_db.session.scalars(
        test_db.select(Course).filter_by(code="COMP1511")
    ).first()
    assert updated_course.name == "Programming Fundamentals Updated"


def test_course_deletion(test_db):
    new_course = Course(code="COMP1511", name="Programming Fundamentals")
    test_db.session.add(new_course)
    test_db.session.commit()

    course = test_db.session.scalars(
        test_db.select(Course).filter_by(code="COMP1511")
    ).first()
    test_db.session.delete(course)
    test_db.session.commit()

    deleted_course = test_db.session.scalars(
        test_db.select(Course).filter_by(code="COMP1511")
    ).first()
    assert deleted_course is None


def test_duplicate_course_code(test_db):
    new_course1 = Course(code="COMP1511", name="Programming Fundamentals")
    new_course2 = Course(code="COMP1511", name="Advanced Programming")

    test_db.session.add(new_course1)
    test_db.session.commit()

    with pytest.raises(IntegrityError):
        test_db.session.add(new_course2)
        test_db.session.commit()


def test_null_course_code(test_db):
    new_course = Course(code=None, name="Programming Fundamentals")
    with pytest.raises(IntegrityError):
        test_db.session.add(new_course)
        test_db.session.commit()


def test_enroll_users(test_db):
    new_course = Course(code="COMP1511", name="Programming Fundamentals")
    new_user = User(
        first_name="Alex", last_name="Xu", email="alex@email.com", password="AlexXu123!"
    )
    test_db.session.add(new_course)
    test_db.session.add(new_user)
    test_db.session.commit()

    new_course.enroll_users([new_user])
    test_db.session.commit()

    course = test_db.session.scalars(
        test_db.select(Course).filter_by(code="COMP1511")
    ).first()
    assert new_user in course.userset.members
