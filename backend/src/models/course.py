from sqlalchemy.exc import IntegrityError
from ..extensions import db
from .user import User, UserSet
from .helpers import get_with_default
from ..error import InputError


class UserCourseStatus(db.Model):
    user_handle = db.Column(db.String, db.ForeignKey("user.handle"), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey("course.id"), nullable=False)
    role_id = db.Column(db.Integer, db.ForeignKey("role.id"), nullable=True)

    user = db.relationship("User", backref="ucs")
    # role = db.relationship("Role", backref="course_progression_statuses")
    # course = db.relationship("Course", backref="course_progression_statuses")

    __table_args__ = (db.PrimaryKeyConstraint("user_handle", "course_id"),)

    def __init__(self, user_handle: str, course_id: str, role_id: str):
        self.user_handle = user_handle
        self.course_id = course_id
        self.role_id = role_id

    def __repr__(self) -> str:
        return f"<UserCourseStatus {self.user_handle} {self.course_code}>"


class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    term = db.Column(db.String(4), nullable=False)
    code = db.Column(db.String(8), nullable=False, unique=True)
    name = db.Column(db.String(100), nullable=False)
    creator = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    user_course_statuses = db.relationship(
        "UserCourseStatus", backref="course", lazy=True, cascade="all, delete-orphan"
    )
    tutorials = db.relationship(
        "Tutorial", backref="course", cascade="all, delete-orphan"
    )
    roles = db.relationship("Role", backref="course", cascade="all, delete-orphan")

    __table_args__ = (db.UniqueConstraint("term", "code"),)

    def __init__(self, term: str, code: str, name: str, creator: User):
        if not term or not code or not name:
            raise InputError("Course term, code and name must be given.")
        self.term = term
        self.code = code
        self.name = name
        self.creator = creator.id

    def update(self, course_data: dict):
        self.term = get_with_default(course_data, "term", self.code)
        self.code = get_with_default(course_data, "code", self.code)
        self.name = get_with_default(course_data, "name", self.name)

    @property
    def members(self):
        return [ucs.user for ucs in self.user_course_statuses]

    def enroll(self, users: list[User]):
        # try:
        for user in users:
            ucs = UserCourseStatus(
                user_handle=user.handle,
                course_id=self.id,
                role_id=None,
            )
            db.session.add(ucs)
        db.session.commit()

    # except IntegrityError as exc:
    #     raise InputError(
    #         f"User {user.handle} is already enrolled in course {self.code}."
    #     ) from exc

    def enroll_users(self, users: list[User]):
        self.userset.members = users

    def __repr__(self):
        return f"<Course {self.id} {self.code} {self.name}>"
