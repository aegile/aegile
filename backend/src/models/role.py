from ..extensions import db
from ..models.user import User
from .helpers import get_with_default


class Permission(db.Model):
    # id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), primary_key=True)


class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    course_code = db.Column(db.String(8), db.ForeignKey("course.code"), nullable=False)
    course = db.relationship("Course", backref="roles")
    color = db.Column(db.String(7), nullable=False, default="#868686")
    permissions = db.relationship(
        "Permission",
        secondary="role_permission_association",
        backref="roles",
        # primaryjoin="and_(Role.name == role_permission.c.role, Role.course == role_permission.c.course)",
        # secondaryjoin="Permission.name == role_permission.c.permission",
    )
    members = db.relationship(
        "User",
        secondary="course_role_user_association",
        backref="roles",
    )

    def update(self, role_data: dict):
        self.name = get_with_default(role_data, "name", self.name)
        self.color = get_with_default(role_data, "color", self.color)

    def get_permissions(self):
        print(f"{self.permissions=}")

    def remove_permission(self, permission_type: str):
        self.permissions = [
            perm for perm in self.permissions if perm.name != permission_type
        ]

    def assign_to_members(self, members: list[User]):
        print(f"{members=}")
        values_to_insert = [
            {"course": self.course.id, "user": user.handle, "role": self.id}
            for user in members
        ]
        try:
            db.session.execute(
                db.insert(course_role_user_association).values(values_to_insert)
            )
            db.session.commit()
            print("Bulk insertion successful")
        except Exception as e:
            db.session.rollback()
            print(f"Error during bulk insertion: {e}")

    def unassign_from_members(self, members: list[User]):
        for user in members:
            db.session.execute(
                db.delete(course_role_user_association),
                {"course": self.course.id, "user": user.handle, "role": self.id},
            )

    def __repr__(self):
        return f"<Role {self.name=} {self.course=}>"


role_permission_association = db.Table(
    "role_permission_association",
    db.Column(
        "permission", db.String, db.ForeignKey("permission.name"), primary_key=True
    ),
    db.Column("role", db.Integer, db.ForeignKey("role.id"), primary_key=True),
)

course_role_user_association = db.Table(
    "course_role_user_association",
    db.Column("course", db.Integer, db.ForeignKey("course.id"), primary_key=True),
    db.Column("user", db.String, db.ForeignKey("user.handle"), primary_key=True),
    db.Column("role", db.Integer, db.ForeignKey("role.id"), primary_key=True),
)
