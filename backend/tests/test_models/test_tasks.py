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
    new_task = Task(
        name="Task 1",
        project_id=test_tasks[0],
        creator=test_tasks[3],
        status="Not Started",
    )
    test_db.session.add(new_task)
    test_db.session.commit()
    inserted_task = test_db.session.scalars(
        test_db.select(Task).filter_by(
            name="Task 1",
            project_id=test_tasks[0],
            creator=test_tasks[3],
            status="Not Started",
        )
    ).first()
    assert inserted_task is not None
    assert inserted_task.name == "Task 1"
    assert inserted_task.project_id == test_tasks[0]
    assert inserted_task.creator == test_tasks[3]
    assert inserted_task.status == "Not Started"


def test_task_creation_with_nullable_fields(test_db, test_tasks):
    new_task = Task(
        name="Task 1",
        project_id=test_tasks[0],
        creator=test_tasks[3],
        status="Not Started",
        description="Write unit tests for auth implementation",
        deadline="31/12/2023",
        weighting=3,
        priority="Medium",
        attachment="test_image.jpeg",
    )
    test_db.session.add(new_task)
    test_db.session.commit()
    inserted_task = test_db.session.scalars(
        test_db.select(Task).filter_by(
            name="Task 1",
            project_id=test_tasks[0],
            creator=test_tasks[3],
            status="Not Started",
        )
    ).first()
    assert inserted_task is not None
    assert inserted_task.description == "Write unit tests for auth implementation"
    assert inserted_task.deadline == "31/12/2023"
    assert inserted_task.weighting == 3
    assert inserted_task.priority == "Medium"
    assert inserted_task.attachment == "test_image.jpeg"


def test_task_update_fields(test_db, test_tasks):
    new_task = Task(
        name="Task 1",
        project_id=test_tasks[0],
        creator=test_tasks[3],
        status="Not Started",
    )
    test_db.session.add(new_task)
    test_db.session.commit()

    original_task = test_db.session.scalars(
        test_db.select(Task).filter_by(
            name="Task 1",
            project_id=test_tasks[0],
            creator=test_tasks[3],
            status="Not Started",
        )
    ).first()
    original_task.name = "Task 2"
    original_task.status = "In Progress"
    original_task.description = "Implement backend for auth"
    original_task.deadline = "10/01/2024"
    original_task.weighting = 4
    original_task.priority = "High"
    test_db.session.commit()

    updated_task = test_db.session.scalars(
        test_db.select(Task).filter_by(name="Task 2")
    ).first()
    assert updated_task is not None
    assert updated_task.name == "Task 2"
    assert updated_task.status == "In Progress"
    assert updated_task.description == "Implement backend for auth"
    assert updated_task.deadline == "10/01/2024"
    assert updated_task.weighting == 4
    assert updated_task.priority == "High"
    assert updated_task.attachment is None


def test_task_deletion(test_db, test_tasks):
    new_task = Task(
        name="Task 1",
        project_id=test_tasks[0],
        creator=test_tasks[3],
        status="Not Started",
    )
    test_db.session.add(new_task)
    test_db.session.commit()

    task = test_db.session.scalars(
        test_db.select(Task).filter_by(
            name="Task 1",
            project_id=test_tasks[0],
            creator=test_tasks[3],
            status="Not Started",
        )
    ).first()
    test_db.session.delete(task)
    test_db.session.commit()

    deleted_task = test_db.session.scalars(
        test_db.select(Task).filter_by(name="Task 1")
    ).first()
    assert deleted_task is None


def test_null_task_name(test_db, test_tasks):
    new_task = Task(
        name=None, project_id=test_tasks[0], creator=test_tasks[3], status="Not Started"
    )
    with pytest.raises(IntegrityError):
        test_db.session.add(new_task)
        test_db.session.commit()


def test_null_project_id(test_db, test_tasks):
    new_task = Task(
        name="Task 1", project_id=None, creator=test_tasks[3], status="Not Started"
    )
    with pytest.raises(IntegrityError):
        test_db.session.add(new_task)
        test_db.session.commit()


def test_invalid_project_id(test_db, test_tasks):
    new_task = Task(
        name="Task 1", project_id=0, creator=test_tasks[3], status="Not Started"
    )
    with pytest.raises(IntegrityError):
        test_db.session.add(new_task)
        test_db.session.commit()


def test_null_creator_handle(test_db, test_tasks):
    new_task = Task(
        name="Task 1",
        project_id=test_tasks[0],
        creator=None,
        status="Not Started",
    )
    with pytest.raises(IntegrityError):
        test_db.session.add(new_task)
        test_db.session.commit()


def test_invalid_creator_handle(test_db, test_tasks):
    new_task = Task(
        name="Task 1",
        project_id=test_tasks[0],
        creator="PhilipTran1234",
        status="Not Started",
    )
    with pytest.raises(IntegrityError):
        test_db.session.add(new_task)
        test_db.session.commit()


def test_null_task_status(test_db, test_tasks):
    new_task = Task(
        name="Task 1",
        project_id=test_tasks[0],
        creator=test_tasks[3],
        status=None,
    )
    with pytest.raises(IntegrityError):
        test_db.session.add(new_task)
        test_db.session.commit()


def test_invalid_task_status(test_db, test_tasks):
    # Status must be one of "Not Started", "Backlog", "In Progress" or "Completed"
    new_task = Task(
        name="Task 1",
        project_id=test_tasks[0],
        creator=test_tasks[3],
        status="Blocked",
    )
    with pytest.raises(IntegrityError):
        test_db.session.add(new_task)
        test_db.session.commit()


def test_duplicate_project_names(test_db, test_tasks):
    # Testing same task names in a single project
    new_task = Task(
        name="Task 1",
        project_id=test_tasks[0],
        creator=test_tasks[3],
        status="Not Started",
    )
    new_task2 = Task(
        name="Task 1",
        project_id=test_tasks[0],
        creator=test_tasks[3],
        status="Not Started",
    )
    test_db.session.add(new_task)
    test_db.session.commit()

    with pytest.raises(IntegrityError):
        test_db.session.add(new_task2)
        test_db.session.commit()


def test_multiple_project_tasks(test_db, test_tasks):
    new_task = Task(
        name="Task 1",
        project_id=test_tasks[0],
        creator=test_tasks[3],
        status="Not Started",
    )
    new_task2 = Task(
        name="Task 2",
        project_id=test_tasks[0],
        creator=test_tasks[3],
        status="Not Started",
    )
    new_task3 = Task(
        name="Task 3",
        project_id=test_tasks[0],
        creator=test_tasks[3],
        status="Not Started",
    )
    test_db.session.add(new_task)
    test_db.session.add(new_task2)
    test_db.session.add(new_task3)
    test_db.session.commit()

    inserted_task = test_db.session.scalars(
        test_db.select(Task).filter_by(
            name="Task 1",
            project_id=test_tasks[0],
            creator=test_tasks[3],
            status="Not Started",
        )
    ).first()
    assert inserted_task is not None
    assert inserted_task.name == "Task 1"
    inserted_task2 = test_db.session.scalars(
        test_db.select(Task).filter_by(
            name="Task 2",
            project_id=test_tasks[0],
            creator=test_tasks[3],
            status="Not Started",
        )
    ).first()
    assert inserted_task2 is not None
    assert inserted_task2.name == "Task 2"
    inserted_task3 = test_db.session.scalars(
        test_db.select(Task).filter_by(
            name="Task 3",
            project_id=test_tasks[0],
            creator=test_tasks[3],
            status="Not Started",
        )
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

    new_task = Task(
        name="Task 1",
        project_id=test_tasks[0],
        creator=test_tasks[3],
        status="Not Started",
    )
    new_task2 = Task(
        name="Task 1",
        project_id=new_project2.id,
        creator=test_tasks[3],
        status="Not Started",
    )
    test_db.session.add(new_task)
    test_db.session.add(new_task2)
    test_db.session.commit()

    inserted_task = test_db.session.scalars(
        test_db.select(Task).filter_by(
            name="Task 1",
            project_id=test_tasks[0],
            creator=test_tasks[3],
            status="Not Started",
        )
    ).first()
    assert inserted_task is not None
    assert inserted_task.name == "Task 1"

    inserted_task2 = test_db.session.scalars(
        test_db.select(Task).filter_by(
            name="Task 1",
            project_id=new_project2.id,
            creator=test_tasks[3],
            status="Not Started",
        )
    ).first()
    assert inserted_task2 is not None
    assert inserted_task2.name == "Task 1"


def test_add_members(test_db, test_tasks):
    new_user = User(
        first_name="Alex", last_name="Xu", email="alex@email.com", password="AlexXu123!"
    )
    new_task = Task(
        name="Task 1",
        project_id=test_tasks[0],
        creator=new_user.handle,
        status="Not Started",
    )
    test_db.session.add(new_user)
    test_db.session.add(new_task)
    test_db.session.commit()

    new_task.add_assignees([new_user])
    test_db.session.commit()
    task = test_db.session.scalars(
        test_db.select(Task).filter_by(
            name="Task 1",
            project_id=test_tasks[0],
            creator=new_user.handle,
            status="Not Started",
        )
    ).first()
    assert new_user in task.get_assignees()
