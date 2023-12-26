import pytest
from sqlalchemy.exc import IntegrityError
from src.models.course import Course
from src.models.tutorial import Tutorial
from src.models.group import Group
from src.models.project import Project
from src.models.task import Task
from src.models.user import User, UserSet


@pytest.fixture(scope="function")
def test_tasks(test_db):
    new_user = User(
        first_name="Philip",
        last_name="Tran",
        email="philip@email.com",
        password="PhilipTran123!",
    )
    new_course = Course(code="COMP1511", name="Programming Fundamentals")
    new_tut = Tutorial(course_code=new_course.code, name="H11A")
    test_db.session.add(new_user)
    test_db.session.add(new_course)
    test_db.session.add(new_tut)
    test_db.session.flush()
    new_group = Group(
        course_code=new_course.code, tutorial_id=new_tut.id, name="Group A"
    )
    test_db.session.add(new_group)
    test_db.session.flush()
    new_project = Project(
        course_code=new_course.code,
        group_id=new_group.id,
        name="Assignment 1",
        creator=new_user.handle,
    )
    test_db.session.add(new_project)
    test_db.session.flush()
    return new_project.id, new_course.code, new_group.id, new_user.handle


def test_task_creation(test_db, test_tasks):
    new_task = Task(name="Task 1", project_id=test_tasks[0])
    test_db.session.add(new_task)
    test_db.session.commit()
    inserted_task = test_db.session.scalars(
        test_db.select(Task).filter_by(name="Task 1", project_id=test_tasks[0])
    ).first()
    assert inserted_task is not None
    assert inserted_task.name == "Task 1"
    assert inserted_task.project_id == test_tasks[0]


# Also add other fields to change such as description, weighting, deadline...
def test_task_update(test_db, test_tasks):
    new_test = Task(name="Task 1", project_id=test_tasks[0])
    test_db.session.add(new_test)
    test_db.session.commit()

    original_task = test_db.session.scalars(
        test_db.select(Task).filter_by(name="Task 1", project_id=test_tasks[0])
    ).first()
    original_task.name = "Task 2"
    test_db.session.commit()

    updated_task = test_db.session.scalars(
        test_db.select(Task).filter_by(name="Task 2")
    ).first()
    assert updated_task is not None
    assert updated_task.name == "Task 2"


def test_task_deletion(test_db, test_tasks):
    new_task = Task(name="Task 1", project_id=test_tasks[0])
    test_db.session.add(new_task)
    test_db.session.commit()

    task = test_db.session.scalars(
        test_db.select(Task).filter_by(name="Task 1", project_id=test_tasks[0])
    ).first()
    test_db.session.delete(task)
    test_db.session.commit()

    deleted_task = test_db.session.scalars(
        test_db.select(Task).filter_by(name="Task 1")
    ).first()
    assert deleted_task is None


def test_null_task_name(test_db, test_tasks):
    new_task = Task(name=None, project_id=test_tasks[0])
    with pytest.raises(IntegrityError):
        test_db.session.add(new_task)
        test_db.session.commit()


def test_null_project_id(test_db, test_tasks):
    new_task = Task(name="Task 1", project_id=None)
    with pytest.raises(IntegrityError):
        test_db.session.add(new_task)
        test_db.session.commit()


def test_invalid_project_id(test_db, test_tasks):
    new_task = Task(name="Task 1", project_id=0)
    with pytest.raises(IntegrityError):
        test_db.session.add(new_task)
        test_db.session.commit()


def test_duplicate_project_names(test_db, test_tasks):
    # Testing same task names in a single project
    new_task = Task(name="Task 1", project_id=test_tasks[0])
    new_task2 = Task(name="Task 1", project_id=test_tasks[0])
    test_db.session.add(new_task)
    test_db.session.commit()

    with pytest.raises(IntegrityError):
        test_db.session.add(new_task2)
        test_db.session.commit()


def test_multiple_project_tasks(test_db, test_tasks):
    new_task = Task(name="Task 1", project_id=test_tasks[0])
    new_task2 = Task(name="Task 2", project_id=test_tasks[0])
    new_task3 = Task(name="Task 3", project_id=test_tasks[0])
    test_db.session.add(new_task)
    test_db.session.add(new_task2)
    test_db.session.add(new_task3)
    test_db.session.commit()

    inserted_task = test_db.session.scalars(
        test_db.select(Task).filter_by(name="Task 1", project_id=test_tasks[0])
    ).first()
    assert inserted_task is not None
    assert inserted_task.name == "Task 1"
    inserted_task2 = test_db.session.scalars(
        test_db.select(Task).filter_by(name="Task 2", project_id=test_tasks[0])
    ).first()
    assert inserted_task2 is not None
    assert inserted_task2.name == "Task 2"
    inserted_task3 = test_db.session.scalars(
        test_db.select(Task).filter_by(name="Task 3", project_id=test_tasks[0])
    ).first()
    assert inserted_task3 is not None
    assert inserted_task3.name == "Task 3"


def test_duplicate_task_names_in_different_projects(test_db, test_tasks):
    new_project2 = Project(
        course_code=test_tasks[1],
        group_id=test_tasks[2],
        name="Assignment 2",
        creator=test_tasks[3],
    )
    test_db.session.add(new_project2)
    test_db.session.flush()

    new_task = Task(name="Task 1", project_id=test_tasks[0])
    new_task2 = Task(name="Task 1", project_id=new_project2.id)
    test_db.session.add(new_task)
    test_db.session.add(new_task2)
    test_db.session.commit()

    inserted_task = test_db.session.scalars(
        test_db.select(Task).filter_by(name="Task 1", project_id=test_tasks[0])
    ).first()
    assert inserted_task is not None
    assert inserted_task.name == "Task 1"

    inserted_task2 = test_db.session.scalars(
        test_db.select(Task).filter_by(name="Task 1", project_id=new_project2.id)
    ).first()
    assert inserted_task2 is not None
    assert inserted_task2.name == "Task 1"
