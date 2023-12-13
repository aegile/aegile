import pytest
from src.app import db
from src.models.course import Course
from src.models.role import Permission, Role

# PERMS = {
#     "course_access": Permission(name="course_access"),
#     "course_manage": Permission(name="course_manage"),
#     "tut_access": Permission(name="tut_access"),
#     "tut_manage": Permission(name="tut_manage"),
#     "group_access": Permission(name="group_access"),
#     "group_manage": Permission(name="group_manage"),
# }


@pytest.fixture
def _init_role():
    new_course = Course(code="COMP1511", name="Programming Fundamentals")
    db.session.add(new_course)

    course_access = Permission(name="course_access")
    course_manage = Permission(name="course_manage")
    tut_access = Permission(name="tut_access")
    tut_manage = Permission(name="tut_manage")
    group_access = Permission(name="group_access")
    group_manage = Permission(name="group_manage")

    db.session.add_all(
        [
            course_access,
            course_manage,
            tut_access,
            tut_manage,
            group_access,
            group_manage,
        ]
    )

    admin = Role(
        name="Administrator",
        permissions=[
            course_access,
            course_manage,
            tut_access,
            tut_manage,
            group_access,
            group_manage,
        ],
        course=new_course.code,
    )
    db.session.add(admin)

    db.session.commit()


@pytest.mark.usefixtures("app_ctx", "_init_role")
def test_create_role():
    admin_role = db.session.scalars(
        db.select(Role).filter_by(name="Administrator")
    ).one()

    assert admin_role.name == "Administrator"
    assert admin_role.course == "COMP1511"

    assert len(admin_role.permissions) == 6
    assert admin_role.permissions[0].name == "course_access"
    assert admin_role.permissions[1].name == "course_manage"
    assert admin_role.permissions[2].name == "tut_access"
    assert admin_role.permissions[3].name == "tut_manage"
    assert admin_role.permissions[4].name == "group_access"
    assert admin_role.permissions[5].name == "group_manage"


@pytest.mark.usefixtures("app_ctx", "_init_role")
def test_update_role():
    admin_role = db.session.scalars(
        db.select(Role).filter_by(name="Administrator")
    ).one()

    admin_role.remove_permission("group_access")
    db.session.commit()

    fetched_admin = db.session.scalars(
        db.select(Role).filter_by(name="Administrator")
    ).one()

    # Checks
    assert len(fetched_admin.permissions) == 5
    assert fetched_admin.permissions[0].name == "course_access"
    assert fetched_admin.permissions[1].name == "course_manage"
    assert fetched_admin.permissions[2].name == "tut_access"
    assert fetched_admin.permissions[3].name == "tut_manage"
    assert fetched_admin.permissions[4].name == "group_manage"


@pytest.mark.usefixtures("app_ctx", "_init_role")
def test_additional_role_with_existing_perms():
    new_course = Course(code="COMP2511", name="Object-Oriented Design & Programming")
    course_access = db.session.execute(
        db.select(Permission).filter_by(name="course_access")
    ).scalar_one()
    guest = Role(
        name="Guest",
        permissions=[course_access],
        course=new_course.code,
    )
    db.session.add(guest)
    db.session.commit()

    fetched_guest = db.session.execute(
        db.select(Role).filter_by(name="Guest", course="COMP2511")
    ).scalar_one()

    # Checks
    assert fetched_guest.name == "Guest"
    assert fetched_guest.course == "COMP2511"
    assert len(fetched_guest.permissions) == 1
    assert fetched_guest.permissions[0].name == "course_access"
