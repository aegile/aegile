import pytest
from sqlalchemy.exc import IntegrityError
from src.models.course import Course
from src.models.tutorial import Tutorial


def test_tutorial_creation(test_db):
    new_course = Course(code="COMP1511", name="Programming Fundamentals")
    new_tut = Tutorial(course_code=new_course.code, name="H11A")
    test_db.session.add(new_course)
    test_db.session.add(new_tut)
    test_db.session.commit()

    inserted_tut: Tutorial = test_db.session.scalars(
        test_db.select(Tutorial).filter_by(course_code="COMP1511", name="H11A")
    ).first()
    assert inserted_tut is not None
    assert inserted_tut.course == new_course
    assert inserted_tut.name == "H11A"


def test_multiple_course_tutorials(test_db):
    new_course = Course(code="COMP1511", name="Programming Fundamentals")
    new_tut = Tutorial(course_code=new_course.code, name="H11A")
    new_tut2 = Tutorial(course_code=new_course.code, name="H11B")
    new_tut3 = Tutorial(course_code=new_course.code, name="H14A")
    test_db.session.add(new_course)
    test_db.session.add(new_tut)
    test_db.session.add(new_tut2)
    test_db.session.add(new_tut3)
    test_db.session.commit()

    inserted_course: Course = test_db.session.scalars(
        test_db.select(Course).filter_by(code="COMP1511")
    ).first()
    assert inserted_course is not None
    assert len(inserted_course.tutorials) == 3


def test_tutorial_update(test_db):
    new_course = Course(code="COMP1511", name="Programming Fundamentals")
    new_tut = Tutorial(course_code=new_course.code, name="H11A")
    test_db.session.add(new_course)
    test_db.session.add(new_tut)
    test_db.session.commit()

    updated_tut: Tutorial = test_db.session.scalars(
        test_db.select(Tutorial).filter_by(course_code="COMP1511", name="H11A")
    ).first()
    updated_tut.name = "H11B"
    test_db.session.commit()

    renamed_tut: Tutorial = test_db.session.scalars(
        test_db.select(Tutorial).filter_by(course_code="COMP1511", name="H11B")
    ).first()
    assert renamed_tut is not None
    assert renamed_tut.name == "H11B"


def test_tutorial_deletion(test_db):
    new_course = Course(code="COMP1511", name="Programming Fundamentals")
    new_tut = Tutorial(course_code=new_course.code, name="H11A")
    test_db.session.add(new_course)
    test_db.session.add(new_tut)
    test_db.session.commit()

    test_db.session.delete(new_tut)
    test_db.session.commit()

    deleted_tut: Tutorial = test_db.session.scalars(
        test_db.select(Tutorial).filter_by(course_code="COMP1511", name="H11A")
    ).first()
    assert deleted_tut is None


def test_tutorial_without_course(test_db):
    new_tut = Tutorial(course_code="COMP1568", name="H11A")
    with pytest.raises(IntegrityError):
        test_db.session.add(new_tut)
        test_db.session.commit()


def test_tutorial_creation_without_name(test_db):
    new_course = Course(code="COMP1511", name="Programming Fundamentals")
    test_db.session.add(new_course)
    test_db.session.commit()

    with pytest.raises(IntegrityError):
        new_tut = Tutorial(course_code=new_course.code, name=None)
        test_db.session.add(new_tut)
        test_db.session.commit()


def test_tutorial_creation_with_null_course_code(test_db):
    with pytest.raises(IntegrityError):
        new_tut = Tutorial(course_code=None, name="H11A")
        test_db.session.add(new_tut)
        test_db.session.commit()


def test_tutorial_creation_with_duplicate_name_same_course(test_db):
    new_course = Course(code="COMP1511", name="Programming Fundamentals")
    new_tut1 = Tutorial(course_code=new_course.code, name="H11A")
    new_tut2 = Tutorial(course_code=new_course.code, name="H11A")
    test_db.session.add(new_course)
    test_db.session.add(new_tut1)
    test_db.session.commit()

    with pytest.raises(IntegrityError):
        test_db.session.add(new_tut2)
        test_db.session.commit()
