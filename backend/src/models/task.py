from src.extensions import db
from .user import User, UserSet


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"), nullable=False)
    creator = db.Column(db.String(54), db.ForeignKey("user.handle"), nullable=False)
    status = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(100))
    deadline = db.Column(db.String(10))
    weighting = db.Column(db.Integer)
    priority = db.Column(db.String(100))
    attachment = db.Column(db.String(100))
    userset_id = db.Column(db.Integer, db.ForeignKey("user_set.id"), unique=True)
    userset = db.relationship("UserSet", backref="tasks", uselist=False)

    project = db.relationship("Project", backref="tasks", uselist=False)
    __table_args__ = (
        db.UniqueConstraint("name", "project_id", name="proj_task_name"),
        db.CheckConstraint(
            "status == 'Not Started' or status == 'In Progress' or \
            status == 'Completed' or status == 'Backlog'"
        ),
    )

    def __init__(
        self,
        name: str,
        project_id: int,
        creator: str,
        status: str,
        description: str = None,
        deadline: str = None,
        weighting: int = None,
        priority: str = None,
        attachment: str = None,
    ):
        self.name = name
        self.project_id = project_id
        self.creator = creator
        self.status = status
        self.description = description
        self.deadline = deadline
        self.weighting = weighting
        self.priority = priority
        self.attachment = attachment
        self.userset = UserSet()

    def add_assignees(self, assignees: list[User]):
        self.userset.members = assignees

    def get_assignees(self):
        return self.userset.members

    def __repr__(self):
        return f"<Task {self.id=} {self.name}>"
