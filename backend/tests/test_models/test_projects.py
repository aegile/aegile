import pytest
from sqlalchemy.exc import IntegrityError
from src.models.course import Course
from src.models.tutorial import Tutorial
from src.models.group import Group
from src.models.project import Project
from src.models.user import User, UserSet
from src.error import InputError


@pytest.fixture(scope="function")
def test_projects(test_db):
    new_user = User(
        first_name="Philip",
        last_name="Tran",
        email="philip@email.com",
        password="PhilipTran123!",
    )
    test_db.session.add(new_user)
    test_db.session.flush()
    test_db.session.refresh(new_user)

    new_course = Course(
        term="23T3", code="COMP1511", name="Programming Fundamentals", creator=new_user
    )
    test_db.session.add(new_course)
    test_db.session.flush()
    test_db.session.refresh(new_course)

    new_tut = Tutorial(
        creator=new_user,
        course_id=new_course.id,
        name="H11A",
        capacity=30,
        datetime="Monday 12:00",
        location="OrganPhysU",
    )
    test_db.session.add(new_tut)
    test_db.session.flush()
    test_db.session.refresh(new_tut)
    # Might have to add a deliverable here...
    # new_group = Group(course_id=new_course.id, tutorial_id=new_tut.id, name="Group A")
    # test_db.session.add(new_group)
    # test_db.session.flush()
    return new_course.id, new_tut.id, new_user


def test_project_creation(test_db, test_projects):
    new_project = Project(
        creator=test_projects[2],
        course_id=test_projects[0],
        tutorial_id=test_projects[1],
        name="Assignment 1",
    )
    test_db.session.add(new_project)
    test_db.session.commit()
    inserted_project = test_db.session.scalars(
        test_db.select(Project).filter_by(
            course_id=test_projects[0],
            tutorial_id=test_projects[1],
            name="Assignment 1",
            creator_id=test_projects[2].id,
        )
    ).first()
    assert inserted_project is not None
    assert inserted_project.course_id == 1
    assert inserted_project.tutorial_id == 1
    assert inserted_project.name == "Assignment 1"


def test_project_creation_with_nullable_fields(test_db, test_projects):
    new_project = Project(
        course_id=test_projects[0],
        tutorial_id=test_projects[1],
        name="Assignment 1",
        creator=test_projects[2],
        subheading="Assignment 1 for COMP1511",
        description="This is a minesweeper assignment developed in C",
        end_date="31/04/2023",
    )
    test_db.session.add(new_project)
    test_db.session.commit()
    inserted_project = test_db.session.scalars(
        test_db.select(Project).filter_by(
            course_id=test_projects[0],
            tutorial_id=test_projects[1],
            name="Assignment 1",
            creator_id=test_projects[2].id,
        )
    ).first()
    assert inserted_project is not None
    assert inserted_project.subheading == "Assignment 1 for COMP1511"
    assert (
        inserted_project.description
        == "This is a minesweeper assignment developed in C"
    )
    assert inserted_project.end_date == "31/04/2023"


def test_project_update_fields(test_db, test_projects):
    new_project = Project(
        course_id=test_projects[0],
        tutorial_id=test_projects[1],
        name="Assignment 1",
        creator=test_projects[2],
    )
    test_db.session.add(new_project)
    test_db.session.commit()

    project_edits = {
        "name": "Assignment 2",
        "subheading": "Assignment 2 for COMP1511",
        "description": "This is a Beats assignment developed in C",
    }
    new_project.update(project_edits)

    updated_project = test_db.session.scalars(
        test_db.select(Project).filter_by(
            course_id=test_projects[0],
            tutorial_id=test_projects[1],
            name="Assignment 2",
            creator_id=test_projects[2].id,
        )
    ).first()
    assert updated_project is not None
    assert updated_project.name == "Assignment 2"
    assert updated_project.subheading == "Assignment 2 for COMP1511"
    assert updated_project.description == "This is a Beats assignment developed in C"
    assert updated_project.end_date is None


def test_project_deletion(test_db, test_projects):
    new_project = Project(
        course_id=test_projects[0],
        tutorial_id=test_projects[1],
        name="Assignment 1",
        creator=test_projects[2],
    )
    test_db.session.add(new_project)
    test_db.session.commit()

    project = test_db.session.scalars(
        test_db.select(Project).filter_by(
            course_id=test_projects[0],
            tutorial_id=test_projects[1],
            name="Assignment 1",
            creator_id=test_projects[2].id,
        )
    ).first()
    test_db.session.delete(project)
    test_db.session.commit()

    deleted_project = test_db.session.scalars(
        test_db.select(Project).filter_by(
            course_id=test_projects[0],
            tutorial_id=test_projects[1],
            name="Assignment 1",
            creator_id=test_projects[2].id,
        )
    ).first()
    assert deleted_project is None


def test_null_course_id(test_db, test_projects):
    with pytest.raises(InputError):
        new_project = Project(
            course_id=None,
            tutorial_id=test_projects[1],
            name="Assignment 1",
            creator=test_projects[2],
        )
        test_db.session.add(new_project)
        test_db.session.commit()


def test_invalid_course_id(test_db, test_projects):
    with pytest.raises(InputError):
        new_project = Project(
            course_id=0,
            tutorial_id=test_projects[1],
            name="Assignment 1",
            creator=test_projects[2],
        )
        test_db.session.add(new_project)
        test_db.session.commit()


def test_null_tutorial_id(test_db, test_projects):
    with pytest.raises(InputError):
        new_project = Project(
            course_id=test_projects[0],
            tutorial_id=None,
            name="Assignment 1",
            creator=test_projects[2],
        )
        test_db.session.add(new_project)
        test_db.session.commit()


def test_invalid_tutorial_id(test_db, test_projects):
    with pytest.raises(InputError):
        new_project = Project(
            course_id=test_projects[0],
            tutorial_id=0,
            name="Assignment 1",
            creator=test_projects[2],
        )
        test_db.session.add(new_project)
        test_db.session.commit()


def test_null_project_name(test_db, test_projects):
    with pytest.raises(InputError):
        new_project = Project(
            course_id=test_projects[0],
            tutorial_id=test_projects[1],
            name=None,
            creator=test_projects[2],
        )
        test_db.session.add(new_project)
        test_db.session.commit()


def test_duplicate_project_names(test_db, test_projects):
    # Testing same project names in a single group
    new_project = Project(
        course_id=test_projects[0],
        tutorial_id=test_projects[1],
        name="Assignment 1",
        creator=test_projects[2],
    )
    new_project2 = Project(
        course_id=test_projects[0],
        tutorial_id=test_projects[1],
        name="Assignment 1",
        creator=test_projects[2],
    )
    test_db.session.add(new_project)
    test_db.session.commit()

    with pytest.raises(IntegrityError):
        test_db.session.add(new_project2)
        test_db.session.commit()


def test_multiple_group_projects(test_db, test_projects):
    new_project = Project(
        course_id=test_projects[0],
        tutorial_id=test_projects[1],
        name="Assignment 1",
        creator=test_projects[2],
    )
    new_project2 = Project(
        course_id=test_projects[0],
        tutorial_id=test_projects[1],
        name="Assignment 2",
        creator=test_projects[2],
    )
    new_project3 = Project(
        course_id=test_projects[0],
        tutorial_id=test_projects[1],
        name="Assignment 3",
        creator=test_projects[2],
    )
    test_db.session.add(new_project)
    test_db.session.add(new_project2)
    test_db.session.add(new_project3)
    test_db.session.commit()

    inserted_project = test_db.session.scalars(
        test_db.select(Project).filter_by(
            course_id=test_projects[0],
            tutorial_id=test_projects[1],
            name="Assignment 1",
            creator_id=test_projects[2].id,
        )
    ).first()
    assert inserted_project is not None
    assert inserted_project.name == "Assignment 1"
    inserted_project2 = test_db.session.scalars(
        test_db.select(Project).filter_by(
            course_id=test_projects[0],
            tutorial_id=test_projects[1],
            name="Assignment 2",
            creator_id=test_projects[2].id,
        )
    ).first()
    assert inserted_project2 is not None
    assert inserted_project2.name == "Assignment 2"
    inserted_project3 = test_db.session.scalars(
        test_db.select(Project).filter_by(
            course_id=test_projects[0],
            tutorial_id=test_projects[1],
            name="Assignment 3",
            creator_id=test_projects[2].id,
        )
    ).first()
    assert inserted_project3 is not None
    assert inserted_project3.name == "Assignment 3"


# def test_duplicate_project_names_in_different_deliverables(test_db, test_projects):
#     new_project = Project(
#         course_id=test_projects[0],
#         tutorial_id=test_projects[1],
#         name="Assignment 1",
#         creator=test_projects[2],
#     )
#     new_project2 = Project(
#         course_id=test_projects[0],
#         tutorial_id=test_projects[1],
#         name="Assignment 1",
#         creator=test_projects[2],
#     )
#     test_db.session.add(new_project)
#     test_db.session.add(new_project2)
#     test_db.session.commit()

#     inserted_project = test_db.session.scalars(
#         test_db.select(Project).filter_by(
#             course_id=test_projects[0],
#             tutorial_id=test_projects[1],
#             name="Assignment 1",
#             creator_id=test_projects[2].id,
#         )
#     ).first()
#     assert inserted_project is not None
#     assert inserted_project.name == "Assignment 1"

#     inserted_project2 = test_db.session.scalars(
#         test_db.select(Project).filter_by(
#             course_id=test_projects[0],
#             tutorial_id=test_projects[1],
#             name="Assignment 1",
#             creator_id=test_projects[2].id,
#         )
#     ).first()
#     assert inserted_project2 is not None
#     assert inserted_project2.name == "Assignment 1"


def test_project_add_members(test_db, test_projects):
    new_user = User(
        first_name="Alex", last_name="Xu", email="alex@email.com", password="AlexXu123!"
    )
    new_project = Project(
        course_id=test_projects[0],
        tutorial_id=test_projects[1],
        name="Assignment 1",
        creator=test_projects[2],
    )
    test_db.session.add(new_user)
    test_db.session.add(new_project)
    test_db.session.commit()

    new_project.add_members([test_projects[2], new_user])
    test_db.session.commit()
    project = test_db.session.scalars(
        test_db.select(Project).filter_by(
            course_id=test_projects[0],
            tutorial_id=test_projects[1],
            name="Assignment 1",
            creator_id=test_projects[2].id,
        )
    ).first()
    assert project.member_count == 2
    assert test_projects[2] in project.members
    assert new_user in project.members
