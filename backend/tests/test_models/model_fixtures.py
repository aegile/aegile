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

    course1 = Course("23T2", "COMP1511", "Programming Fundamentals", user)
    course2 = Course("23T2", "COMP2511", "Object-Oriented Design", user)
    course3 = Course("23T2", "COMP6080", "Web Front-End Programming", user)
    test_db.session.add_all([course1, course2, course3])
    test_db.session.commit()
    ucs1 = UserCourseStatus(user_handle=user.handle, course_id=course1.id, role_id=None)
    ucs2 = UserCourseStatus(user_handle=user.handle, course_id=course2.id, role_id=None)
    ucs3 = UserCourseStatus(user_handle=user.handle, course_id=course3.id, role_id=None)
    test_db.session.add_all([ucs1, ucs2, ucs3])
    test_db.session.commit()
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
