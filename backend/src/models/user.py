from src.extensions import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)

    def __repr__(self):
        return f"<Course {self.id} {self.first_name} {self.last_name}>"


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
