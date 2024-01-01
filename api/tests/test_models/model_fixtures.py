import pytest
from src.models.course import Course, UserCourseStatus
from src.models.role import Role
from src.models.user import User


@pytest.fixture
def init_users(test_db):
    user1 = User("Alex", "Xu", "alex@email.com", "AlexXu123!")
    user2 = User("Sam", "Yu", "sam@email.com", "SamYu123!")
    user3 = User("Philip", "Tran", "philip@email.com", "PhilipTran123!")
    test_db.session.add_all([user1, user2, user3])
    test_db.session.commit()
    return user1, user2, user3


@pytest.fixture
def init_courses(test_db, init_users):
    user, _, _ = init_users

    course1 = Course(
        term="23T2", code="COMP1511", name="Programming Fundamentals", creator=user
    )
    course2 = Course(
        term="23T2", code="COMP2511", name="Object-Oriented Design", creator=user
    )
    course3 = Course(
        term="23T2", code="COMP6080", name="Web Front-End Programming", creator=user
    )
    test_db.session.add_all([course1, course2, course3])
    test_db.session.commit()
    course1.enroll([user])
    course2.enroll([user])
    course3.enroll([user])
    return course1, course2, course3


@pytest.fixture
def init_roles(test_db, init_users, init_courses):
    user1, user2, user3 = init_users
    course, _, _ = init_courses
    student_role = Role(name="Student", course_code=course.code)
    tutor_role = Role(name="Tutor", course_code=course.code)
    test_db.session.add_all([student_role, tutor_role])
    test_db.session.commit()

    ucs1 = course.get_user_status(user1)

    ucs1.role_id = student_role.id
    test_db.session.commit()

    return student_role, tutor_role
