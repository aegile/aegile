import pytest
from tests.test_models.model_fixtures import init_users, init_courses, init_roles
from sqlalchemy.exc import IntegrityError
from src.error import InputError
from src.models.course import UserCourseStatus
from src.models.role import Role


def test_create_role(test_db, init_courses):
    course, _, _ = init_courses
    new_role = Role(name="Student", course_code=course.code)
    test_db.session.add(new_role)
    test_db.session.commit()
    inserted_role: Role = test_db.session.scalars(
        test_db.select(Role).filter_by(name="Student")
    ).first()
    assert inserted_role is not None
    assert inserted_role.name == "Student"
    assert inserted_role.color == "#868686"
    assert inserted_role.course == course


def test_create_role_with_invalid_code(test_db):
    # Guarantees that roles will always have an existing course tied to it

    new_role = Role(name="Student", course_code="FINS1234")

    with pytest.raises(IntegrityError):
        test_db.session.add(new_role)
        test_db.session.commit()


def test_course_assigned_student_roles(test_db, init_users, init_roles):
    _, user, _ = init_users
    student_role, _ = init_roles

    ucs = UserCourseStatus(
        user_handle=user.handle,
        course_id=student_role.course.id,
        role_id=student_role.id,
    )
    test_db.session.add(ucs)
    test_db.session.commit()

    assert len(student_role.members) == 2


def test_course_assigned_student_roles(test_db, init_users, init_courses, init_roles):
    user, _, _ = init_users
    _, course, _ = init_courses
    student_role, _ = init_roles
    new_role = Role(name="Admin", course_code="COMP2511")
    test_db.session.add(new_role)
    test_db.session.commit()

    course.get_user_status(user).role_id = new_role.id
    test_db.session.commit()

    assert len(student_role.members) == 1
    assert len(new_role.members) == 1


def test_course_assigned_tutor_roles(test_db, init_roles):
    _, tutor_role = init_roles
    assert len(tutor_role.members) == 0


def test_get_all_course_roles(test_db, init_roles):
    roles: Role = test_db.session.scalars(
        test_db.select(Role).filter_by(course_code="COMP1511")
    ).all()
    assert len(roles) == 2
    assert any(role.name == "Student" for role in roles)
    assert any(role.name == "Tutor" for role in roles)


def test_edit_role(test_db, init_roles):
    student_role, _ = init_roles
    student_role.name = "everyone"
    student_role.color = "#000000"
    test_db.session.commit()

    updated_role: Role = test_db.session.scalars(
        test_db.select(Role).filter_by(name="everyone", course_code="COMP1511")
    ).first()
    assert updated_role is not None
    assert updated_role.name == "everyone"
    assert updated_role.color == "#000000"


def test_user_assigned_duplicate_course_role(test_db, init_users, init_courses):
    course1, _, _ = init_courses
    user1, _, _ = init_users
    student_role = Role(name="Student", course_code=course1.code)
    test_db.session.add(student_role)
    test_db.session.commit()

    ucs1 = UserCourseStatus(user1.id, course1.code, student_role.id)
    ucs2 = UserCourseStatus(user1.id, course1.code, student_role.id)
    with pytest.raises(IntegrityError):
        test_db.session.add_all([ucs1, ucs2])
        test_db.session.commit()


def test_user_assigned_duplicate_course_role(test_db, init_users, init_courses):
    course1, _, _ = init_courses
    user1, _, _ = init_users
    student_role = Role(name="Student", course_code=course1.code)
    tutor_role = Role(name="Tutor", course_code=course1.code)
    test_db.session.add_all([student_role, tutor_role])
    test_db.session.commit()

    ucs1 = UserCourseStatus(user1.id, course1.code, student_role.id)
    ucs2 = UserCourseStatus(user1.id, course1.code, tutor_role.id)
    with pytest.raises(IntegrityError):
        test_db.session.add_all([ucs1, ucs2])
        test_db.session.commit()


def test_delete_role(test_db, init_users, init_courses, init_roles):
    course, _, _ = init_courses
    user, _, _ = init_users
    student_role, _ = init_roles
    test_db.session.delete(student_role)
    test_db.session.commit()

    deleted_role: Role = test_db.session.scalars(
        test_db.select(Role).filter_by(id=student_role.id)
    ).first()
    assert deleted_role is None
    ucs_with_deleted_role: UserCourseStatus = test_db.session.scalars(
        test_db.select(UserCourseStatus).filter_by(user_id=user.id, course_id=course.id)
    ).first()
    assert ucs_with_deleted_role.role is None
