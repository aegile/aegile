from src.extensions import db
from src.error import InputError
from .helpers import get_with_default


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.String(50), nullable=False)
    handle = db.Column(db.String(54), nullable=False, unique=True)
    image = db.Column(db.String)

    def __init__(self, first_name: str, last_name: str, email: str, password: str):
        if not first_name or not last_name or not email or not password:
            raise InputError("Names, email, and password cannot be empty")
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        self.password = password
        self.handle = f"{first_name}{last_name}"

    def update(self, profile_data: dict):
        self.email = get_with_default(profile_data, "email", self.email)
        self.password = get_with_default(profile_data, "password", self.password)
        self.first_name = get_with_default(profile_data, "first_name", self.first_name)
        self.last_name = get_with_default(profile_data, "last_name", self.last_name)
        self.image = get_with_default(profile_data, "image", self.image)

    def __repr__(self):
        return f"<User {self.id} {self.handle} {self.email}>"


class UserSet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    members = db.relationship(
        "User",
        secondary="user_set_association",
        backref="user_sets",
    )

    def __repr__(self):
        return f"<UserSet {self.id=}>"


user_set_association = db.Table(
    "user_set_association",
    db.Column("user_set", db.Integer, db.ForeignKey("user_set.id"), primary_key=True),
    db.Column("user", db.Integer, db.ForeignKey("user.id"), primary_key=True),
)
