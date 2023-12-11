from src.extensions import db
from .user import UserSet


class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    userset_id = db.Column(db.Integer, db.ForeignKey("user_set.id"), unique=True)
    userset = db.relationship("UserSet", backref="projects", uselist=False)

    def __init__(self, name: str):
        self.name = name
        self.userset = UserSet()

    def get_members(self):
        return self.userset.members

    def __repr__(self):
        return f"<Project {self.id=}>"
