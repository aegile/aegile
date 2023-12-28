from sqlalchemy.exc import IntegrityError, ResourceClosedError
from ..extensions import db
from .user import User, UserSet
from .helpers import get_with_default
from ..error import InputError


class UserCourseStatus(db.Model):
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey("course.id"), nullable=False)
    role_id = db.Column(
        db.Integer, db.ForeignKey("role.id", ondelete="SET NULL"), nullable=True
    )

    user = db.relationship("User", backref="ucs")
    # role = db.relationship("Role", backref="course_progression_statuses")
    # course = db.relationship("Course", backref="course_progression_statuses")

    __table_args__ = (db.PrimaryKeyConstraint("user_id", "course_id"),)

    def __init__(self, user_id: str, course_id: str, role_id: str):
        self.user_id = user_id
        self.course_id = course_id
        self.role_id = role_id

    def __repr__(self) -> str:
        return f"<UserCourseStatus {self.user_id} cousre_id={self.course_id}>"


class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    term = db.Column(db.String(4), nullable=False)
    code = db.Column(db.String(8), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String)
    creator = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    user_course_statuses = db.relationship(
        "UserCourseStatus", backref="course", lazy=True, cascade="all, delete-orphan"
    )
    tutorials = db.relationship(
        "Tutorial", backref="course", cascade="all, delete-orphan"
    )
    roles = db.relationship("Role", backref="course", cascade="all, delete-orphan")

    __table_args__ = (db.UniqueConstraint("term", "code"),)

    # def __init__(self, term: str, code: str, name: str, creator: User):
    #     if not term or not code or not name:
    #         raise InputError("Course term, code and name must be given.")
    #     self.term = term
    #     self.code = code
    #     self.name = name
    #     self.creator = creator.id

    def __init__(self, creator: User, **kwargs):
        if not kwargs.get("term") or not kwargs.get("code") or not kwargs.get("name"):
            raise InputError("Course term, code and name must be given.")

        self.creator = creator.id
        super(Course, self).__init__(**kwargs)

    def update(self, course_data: dict):
        self.term = get_with_default(course_data, "term", self.code)
        self.code = get_with_default(course_data, "code", self.code)
        self.name = get_with_default(course_data, "name", self.name)
        self.description = get_with_default(
            course_data, "description", self.description
        )

    @property
    def members(self):
        return [ucs.user for ucs in self.user_course_statuses]

    @property
    def member_count(self):
        return len(self.user_course_statuses)

    def enroll(self, users: list[User]):
        try:
            for user in users:
                ucs = UserCourseStatus(
                    user_id=user.id,
                    course_id=self.id,
                    role_id=None,
                )
                db.session.add(ucs)
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            raise InputError(
                f"User {user.handle} is already enrolled in course {self.code}."
            )

    def kick(self, users: list[User]):
        for user in users:
            if user.id == self.creator:
                raise InputError("Creator cannot be kicked from course.")
            db.session.execute(
                db.delete(UserCourseStatus)
                .where(UserCourseStatus.user_id == user.id)
                .where(UserCourseStatus.course_id == self.id)
            )
        db.session.commit()

    def get_user_status(self, user: User):
        return next(
            (ucs for ucs in self.user_course_statuses if ucs.user_id == user.id),
            None,
        )

    def __repr__(self):
        return f"<Course {self.id} {self.code} {self.name}>"
