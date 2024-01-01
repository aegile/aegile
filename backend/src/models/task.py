from ..extensions import db
from .user import User, UserSet


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    userset_id = db.Column(db.Integer, db.ForeignKey("user_set.id"), unique=True)
    userset = db.relationship("UserSet", backref="tasks", uselist=False)

    project_id = db.Column(db.Integer, db.ForeignKey("project.id"), nullable=False)
    project = db.relationship("Project", backref="tasks", uselist=False)
    __table_args__ = (db.UniqueConstraint("name", "project_id", name="proj_task_name"),)

    def __init__(self, name: str, project_id: str):
        self.name = name
        self.project_id = project_id
        self.userset = UserSet()

    def add_assignees(self, assignees: list[User]):
        self.userset.members = assignees

    def get_assignees(self):
        return self.userset.members

    def __repr__(self):
        return f"<Task {self.id=} {self.name}>"
