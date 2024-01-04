from sqlalchemy.exc import IntegrityError
from ..extensions import db
from .user import User, UserSet
from .helpers import get_with_default
from ..error import InputError


class Deliverable(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey("course.id"), nullable=False)
    description = db.Column(db.String)
    weighting = db.Column(db.Integer, nullable=False)
    limit = db.Column(db.String)
    deadline = db.Column(db.String, nullable=False)
    deliverable_type = db.Column(db.String, nullable=False, default="individual")
    deliverable_instances = db.relationship(
        "DeliverableInstance", backref="deliverable", cascade="all, delete-orphan"
    )

    def __init__(self, **kwargs):
        required_fields = [
            "name",
            "course_id",
            "deliverable_type",
            "weighting",
            "deadline",
        ]

        if not all(kwargs.get(field) for field in required_fields):
            raise InputError(
                "Course ID, deliverable type, name, weighting and deadline must be given."
            )
        super(Deliverable, self).__init__(**kwargs)

    def update(self, data: dict):
        self.name = get_with_default(data, "name", self.name)
        self.deliverable_type = get_with_default(
            data, "deliverable_type", self.deliverable_type
        )
        self.limit = get_with_default(data, "limit", self.limit)
        self.weighting = get_with_default(data, "weighting", self.weighting)
        self.deadline = get_with_default(data, "deadline", self.deadline)
        self.description = get_with_default(data, "description", self.description)


class DeliverableInstance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tutorial_id = db.Column(db.Integer, db.ForeignKey("tutorial.id"), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey("course.id"), nullable=False)
    deliverable_id = db.Column(
        db.Integer, db.ForeignKey("deliverable.id"), nullable=False
    )
    # projects = db.relationship(
    #     "Project", backref="deliverable_instance", cascade="all, delete-orphan"
    # )

    def __init__(self, **kwargs):
        required_fields = ["tutorial_id", "course_id", "deliverable_id"]
        if not all(kwargs.get(field) for field in required_fields):
            raise InputError("Course, tutorial and deliverable ID must be given.")
        super(DeliverableInstance, self).__init__(**kwargs)

    @property
    def groups(self):
        return [project.userset for project in self.projects]

    @property
    def users(self):
        return UserSet.union(*self.groups)

    @property
    def name(self):
        return self.deliverable.name

    @property
    def deliverable_type(self):
        return self.deliverable.deliverable_type

    @property
    def weighting(self):
        return self.deliverable.weighting

    @property
    def deadline(self):
        return self.deliverable.deadline

    @property
    def limit(self):
        return self.deliverable.limit

    @property
    def member_count(self):
        # return len(self.projects)
        return 0
