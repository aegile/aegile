import pytest
from sqlalchemy.exc import IntegrityError
from src.models.course import Course
from src.models.tutorial import Tutorial
from src.models.group import Group
from src.models.user import User, UserSet


# def test_group_creation(test_db):
#     new_course = Course(code="COMP1511", name="Programming Fundamentals")
#     new_tut = Tutorial(course=new_course, name="H11A")
#     new_group = Course(code="COMP1511", name="Programming Fundamentals")
#     test_db.session.add(new_group)
#     test_db.session.commit()

#     inserted_group = test_db.session.scalars(
#         test_db.select(Course).filter_by(code="COMP1511")
#     ).first()
#     assert inserted_group is not None
#     assert inserted_group.code == "COMP1511"
#     assert inserted_group.name == "Programming Fundamentals"
