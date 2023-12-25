import pytest
from sqlalchemy.exc import IntegrityError
from tests.test_models.model_fixtures import init_users, init_courses
from src.error import InputError
from src.models.course import Course, UserCourseStatus


def test_create_course_with_valid_inputs(test_db, init_users):
    user, _, _ = init_users
    new_course = Course(
        term="23T3",
        code="COMP1511",
        name="Programming Fundamentals",
        creator=user,
    )
    test_db.session.add(new_course)
    test_db.session.commit()
    new_ucs: UserCourseStatus = UserCourseStatus(
        user_handle=user.handle,
        course_id=new_course.id,
        role_id=None,
    )
    test_db.session.add(new_ucs)
    test_db.session.commit()

    inserted_course: Course = test_db.session.scalars(
        test_db.select(Course).filter_by(term="23T3", code="COMP1511")
    ).first()

    assert inserted_course is not None
    assert inserted_course.code == "COMP1511"
    assert inserted_course.name == "Programming Fundamentals"
    assert len(inserted_course.members) == 1


def test_create_course_with_duplicate_offering(test_db, init_users, init_courses):
    user, _, _ = init_users
    with pytest.raises(IntegrityError):
        new_course = Course(
            term="23T2",
            code="COMP1511",
            name="Programming Fundamentals",
            creator=user,
        )
        test_db.session.add(new_course)
        test_db.session.commit()


def test_enroll_users_to_course(test_db, init_users, init_courses):
    _, user2, user3 = init_users
    course, _, _ = init_courses
    course.enroll([user2, user3])
    test_db.session.commit()

    inserted_course: Course = test_db.session.scalars(
        test_db.select(Course).filter_by(term="23T2", code="COMP1511")
    ).first()
    assert len(inserted_course.members) == 3


def test_enroll_already_enrolled_users(test_db, init_users, init_courses):
    _, user2, user3 = init_users
    course, _, _ = init_courses

    course.enroll([user2, user3])
    test_db.session.commit()

    # the course_id and user_handle are unique together
    with pytest.raises(IntegrityError):
        course.enroll([user2, user3])


def test_course_update_with_valid_input(test_db, init_courses):
    course, _, _ = init_courses
    course_data = {
        "term": "21T2",
        "code": "",
        "name": "Programming Fundamentals Updated",
    }
    course.update(course_data)
    test_db.session.commit()

    updated_course: Course = test_db.session.scalars(
        test_db.select(Course).filter_by(term="21T2", code="COMP1511")
    ).first()
    assert updated_course.term == "21T2"
    assert updated_course.code == "COMP1511"
    assert updated_course.name == "Programming Fundamentals Updated"


def test_course_update_code_to_existing_course_offering(test_db, init_courses):
    course, _, _ = init_courses
    course_data = {
        "term": "",
        "code": "COMP2511",
        "name": "Programming Fundamentals Updated",
    }
    with pytest.raises(IntegrityError):
        course.update(course_data)
        test_db.session.commit()


def test_course_delete(test_db, init_courses):
    course, _, _ = init_courses
    test_db.session.delete(course)
    test_db.session.commit()

    deleted_course = test_db.session.scalars(
        test_db.select(Course).filter_by(term="23T2", code="COMP1511")
    ).first()
    assert deleted_course is None
