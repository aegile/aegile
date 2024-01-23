from ..extensions import db
from .course import Course
from .deliverable import DeliverableInstance
from .user import User, UserSet
from .helpers import get_with_default
from ..error import InputError


class Tutorial(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    creator_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey("course.id"), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    capacity = db.Column(db.Integer, nullable=False, default=25)
    day = db.Column(db.String, nullable=False)
    times = db.Column(db.String, nullable=False)
    location = db.Column(db.String, nullable=False)

    # announcements = db.relationship(
    #     "Announcement", backref="tutorial", cascade="all, delete-orphan"
    # )
    deliverable_instances = db.relationship(
        "DeliverableInstance", backref="tutorial", cascade="all, delete-orphan"
    )
    groups = db.relationship("Group", backref="tutorial", cascade="all, delete-orphan")
    userset_id = db.Column(db.Integer, db.ForeignKey("user_set.id"))
    userset = db.relationship("UserSet", backref="tutorial_userset", uselist=False)

    __table_args__ = (
        db.UniqueConstraint("course_id", "name", name="uix_course_name"),
        db.UniqueConstraint("day", "times", "location", name="uix_tutorial_class"),
    )

    # def __init__(self, course_id: str, name: str, userset: list[User] = []):
    #     self.course_id = course_id
    #     self.name = name
    #     self.userset = UserSet()
    #     self.userset.members = userset

    def __init__(self, creator: User, **kwargs):
        required_fields = ["course_id", "name", "capacity", "day", "times", "location"]

        if not all(kwargs.get(field) for field in required_fields):
            raise InputError(
                "Course ID and class name, capacity, date/time and location must be given."
            )
        self.creator_id = creator.id
        super(Tutorial, self).__init__(**kwargs)
        self.userset = UserSet()
        self.userset.members = [creator]
        # Retrieve the parent Course
        # course = Course.query.get(self.course_id)

        # # Create DeliverableInstance for each Deliverable in the parent Course
        # for deliverable in course.deliverables:
        #     DeliverableInstance(
        #         course_id=self.course_id,
        #         tutorial_id=self.id,
        #         deliverable_id=deliverable.id,
        #     )
        # self.deliverable_instances.append(deliverable_instance)

    def update(self, update_data: dict):
        # self.course_id = get_with_default(update_data, "course_id", self.course_id)
        self.name = get_with_default(update_data, "name", self.name)
        self.capacity = get_with_default(update_data, "capacity", self.capacity)
        self.day = get_with_default(update_data, "day", self.day)
        self.times = get_with_default(update_data, "times", self.times)
        self.location = get_with_default(update_data, "location", self.location)

    @property
    def members(self):
        return self.userset.members

    @property
    def member_count(self):
        return len(self.userset.members)

    @property
    def course_code(self):
        return self.course.code

    def enroll(self, users: list[User]):
        # All users must not be in the project yet
        for user in users:
            if user in self.members:
                raise InputError(
                    f"User {user.handle} already enrolled in tutorial {self.name}."
                )
        self.set_members(self.members + users)

    def kick(self, users: list[User]):
        # All users must be enrolled in the project
        for user in users:
            if user not in self.members:
                raise InputError(
                    f"User {user.handle} is not enrolled in tutorial {self.name}."
                )
        self.set_members([us for us in self.members if us not in users])

    def set_members(self, users: list[User]):
        self.userset.members = users

    def __repr__(self):
        return f"<Tutorial {self.id} {self.course_id}→{self.name}>"
