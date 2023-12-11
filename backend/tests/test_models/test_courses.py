import pytest
from src.app import db
from src.models.course import Course, CourseOffering


@pytest.mark.usefixtures("app_ctx")
def test_course_creation():
    new_course = Course(code="COMP1511", name="Programming Fundamentals")
    db.session.add(new_course)
    db.session.commit()

    fetched_course = db.session.execute(
        db.select(Course).filter_by(code="COMP1511")
    ).scalar_one()
    assert fetched_course.code == "COMP1511"
    assert fetched_course.name == "Programming Fundamentals"
