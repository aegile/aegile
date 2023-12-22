import pytest
from sqlalchemy.exc import IntegrityError
from src.models.course import Course
from src.models.tutorial import Tutorial
from src.models.group import Group
from src.models.project import Project
from src.models.user import User, UserSet


@pytest.fixture(scope="function")
def test_projects(test_db):
    new_course = Course(code="COMP1511", name="Programming Fundamentals")
    new_tut = Tutorial(course_code=new_course.code, name="H11A")
    test_db.session.add(new_course)
    test_db.session.add(new_tut)
    # flush() to access id of new_tut object
    test_db.session.flush()

    new_group = Group(
        course_code=new_course.code, tutorial_id=new_tut.id, name="Group A"
    )
    test_db.session.add(new_group)
    test_db.session.flush()
    return new_course.code, new_group.id, new_tut.id


def test_project_creation(test_db, test_projects):
    new_project = Project(
        course_code=test_projects[0], group_id=test_projects[1], name="Assignment 1"
    )
    test_db.session.add(new_project)
    test_db.session.commit()
    inserted_project = test_db.session.scalars(
        test_db.select(Project).filter_by(name="Assignment 1")
    ).first()
    assert inserted_project is not None
    assert inserted_project.course_code == "COMP1511"
    assert inserted_project.group_id == 1
    assert inserted_project.name == "Assignment 1"

    inserted_course = test_db.session.scalars(
        test_db.select(Course).filter_by(code="COMP1511")
    ).first()
    assert inserted_course is not None
    assert inserted_course.code == "COMP1511"
    assert inserted_course.name == "Programming Fundamentals"


def test_project_update(test_db, test_projects):
    new_project = Project(
        course_code=test_projects[0], group_id=test_projects[1], name="Assignment 1"
    )
    test_db.session.add(new_project)
    test_db.session.commit()

    original_project = test_db.session.scalars(
        test_db.select(Project).filter_by(name="Assignment 1")
    ).first()
    original_project.name = "Assignment 2"
    test_db.session.commit()

    updated_project = test_db.session.scalars(
        test_db.select(Project).filter_by(name="Assignment 2")
    ).first()
    assert updated_project is not None
    assert updated_project.name == "Assignment 2"


def test_project_deletion(test_db, test_projects):
    new_project = Project(
        course_code=test_projects[0], group_id=test_projects[1], name="Assignment 1"
    )
    test_db.session.add(new_project)
    test_db.session.commit()

    project = test_db.session.scalars(
        test_db.select(Project).filter_by(name="Assignment 1")
    ).first()
    test_db.session.delete(project)
    test_db.session.commit()

    deleted_project = test_db.session.scalars(
        test_db.select(Project).filter_by(name="Assignment 1")
    ).first()
    assert deleted_project is None


def test_null_course_code(test_db, test_projects):
    new_project = Project(
        course_code=None, group_id=test_projects[1], name="Assignment 1"
    )
    with pytest.raises(IntegrityError):
        test_db.session.add(new_project)
        test_db.session.commit()


def test_invalid_course_code(test_db, test_projects):
    new_project = Project(
        course_code="COMP0000", group_id=test_projects[1], name="Assignment 1"
    )
    with pytest.raises(IntegrityError):
        test_db.session.add(new_project)
        test_db.session.commit()


def test_null_group_id(test_db, test_projects):
    new_project = Project(
        course_code=test_projects[0], group_id=None, name="Assignment 1"
    )
    with pytest.raises(IntegrityError):
        test_db.session.add(new_project)
        test_db.session.commit()


def test_invalid_group_id(test_db, test_projects):
    new_project = Project(course_code=test_projects[0], group_id=0, name="Assignment 1")
    with pytest.raises(IntegrityError):
        test_db.session.add(new_project)
        test_db.session.commit()


def test_null_project_name(test_db, test_projects):
    new_project = Project(
        course_code=test_projects[0], group_id=test_projects[1], name=None
    )
    with pytest.raises(IntegrityError):
        test_db.session.add(new_project)
        test_db.session.commit()


def test_duplicate_project_names(test_db, test_projects):
    # Testing same project names in a single group
    # Not yet implemented in project.py...
    new_project = Project(
        course_code=test_projects[0], group_id=test_projects[1], name="Assignment 1"
    )
    new_project2 = Project(
        course_code=test_projects[0], group_id=test_projects[1], name="Assignment 1"
    )
    test_db.session.add(new_project)
    test_db.session.commit()

    with pytest.raises(IntegrityError):
        test_db.session.add(new_project2)
        test_db.session.commit()


def test_multiple_group_projects(test_db, test_projects):
    new_project = Project(
        course_code=test_projects[0], group_id=test_projects[1], name="Assignment 1"
    )
    new_project2 = Project(
        course_code=test_projects[0], group_id=test_projects[1], name="Assignment 2"
    )
    new_project3 = Project(
        course_code=test_projects[0], group_id=test_projects[1], name="Assignment 3"
    )
    test_db.session.add(new_project)
    test_db.session.add(new_project2)
    test_db.session.add(new_project3)
    test_db.session.commit()

    assert test_db.session.query(Project).count() == 3


def test_duplicate_project_names_in_different_groups(test_db, test_projects):
    new_group2 = Group(
        course_code=test_projects[0], tutorial_id=test_projects[2], name="Group B"
    )
    test_db.session.add(new_group2)
    test_db.session.flush()

    new_project = Project(
        course_code=test_projects[0], group_id=test_projects[1], name="Assignment 1"
    )
    new_project2 = Project(
        course_code=test_projects[0], group_id=new_group2.id, name="Assignment 1"
    )
    test_db.session.add(new_project)
    test_db.session.add(new_project2)
    test_db.session.commit()

    inserted_project = test_db.session.scalars(
        test_db.select(Project).filter_by(
            group_id=test_projects[1], name="Assignment 1"
        )
    ).first()
    assert inserted_project is not None
    assert inserted_project.name == "Assignment 1"

    inserted_project2 = test_db.session.scalars(
        test_db.select(Project).filter_by(group_id=new_group2.id, name="Assignment 1")
    ).first()
    assert inserted_project2 is not None
    assert inserted_project2.name == "Assignment 1"
