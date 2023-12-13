from src.extensions import db


class Permission(db.Model):
    # id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), primary_key=True)


class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    course = db.Column(db.String(8), db.ForeignKey("course.code"), nullable=False)
    permissions = db.relationship(
        "Permission",
        secondary="role_permission_association",
        backref="roles",
        # primaryjoin="and_(Role.name == role_permission.c.role, Role.course == role_permission.c.course)",
        # secondaryjoin="Permission.name == role_permission.c.permission",
    )

    def get_permissions(self):
        print(f"{self.permissions=}")

    def remove_permission(self, permission_type: str):
        self.permissions = [
            perm for perm in self.permissions if perm.name != permission_type
        ]

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
    db.Column("user", db.Integer, db.ForeignKey("user.id"), primary_key=True),
    db.Column("role", db.Integer, db.ForeignKey("role.id"), primary_key=True),
)
