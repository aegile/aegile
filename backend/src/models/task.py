from ..extensions import db
from .user import User, UserSet
from ..error import InputError


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"), nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    status = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(100))
    deadline = db.Column(db.String(10))
    weighting = db.Column(db.Integer)
    priority = db.Column(db.String(100))
    attachment = db.Column(db.String(100))
    userset_id = db.Column(db.Integer, db.ForeignKey("user_set.id"), unique=True)
    userset = db.relationship("UserSet", backref="tasks", uselist=False)

    # project = db.relationship("Project", backref="tasks", uselist=False)
    __table_args__ = (
        db.UniqueConstraint("name", "project_id", name="proj_task_name"),
        db.CheckConstraint(
            "status == 'Not Started' or status == 'In Progress' or \
            status == 'Completed' or status == 'Backlog'"
        ),
        db.CheckConstraint(
            "priority == 'Low' or priority == 'Medium' or \
            Priority == 'High'"
        ),
    )

    def __init__(self, creator: User, **kwargs):
        if (
            not kwargs.get("project_id")
            or not kwargs.get("name")
            or not kwargs.get("status")
        ):
            raise InputError("Project ID, name and status must be given.")

        self.creator_id = creator.id
        self.userset = UserSet()
        # Automatically assign the task to the creator
        self.userset.members = [creator]
        super(Task, self).__init__(**kwargs)

    # Change task assignees to become members for consistency with other classes
    @property
    def members(self):
        return self.userset.members

    @property
    def member_count(self):
        return len(self.userset.members)

    def set_members(self, members: list[User]):
        self.userset.members = members

    # Assuming project_id and creator cannot be changed
    def update(self, task_data: dict):
        self.name = task_data.get("name", self.name)
        self.status = task_data.get("status", self.status)
        self.description = task_data.get("description", self.description)
        self.deadline = task_data.get("deadline", self.deadline)
        self.weighting = task_data.get("weighting", self.weighting)
        self.priority = task_data.get("priority", self.priority)
        self.attachment = task_data.get("attachment", self.attachment)

    def __repr__(self):
        return f"<Task {self.id=} {self.name}>"
