from ..extensions import db
from ..models.user import User
from .helpers import get_with_default


class Permission(db.Model):
    # id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), primary_key=True)


class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, default="new role")
    course_code = db.Column(db.String(8), db.ForeignKey("course.code"), nullable=False)
    color = db.Column(db.String(7), nullable=False, default="#868686")
    can_manage_roles = db.Column(db.Integer, nullable=False, default=0)
    can_access_tutorials = db.Column(db.Integer, nullable=False, default=0)
    user_course_statuses = db.relationship(
        "UserCourseStatus", backref="role", lazy=True, cascade="all, delete-orphan"
    )

    def __init__(self, name: str, course_code: str):
        self.name = name
        self.course_code = course_code
        # self.members = members
        # self.permissions = permissions

    def update(self, role_data: dict):
        self.name = get_with_default(role_data, "name", self.name)
        self.color = get_with_default(role_data, "color", self.color)

    @property
    def members(self):
        return [ucs.user for ucs in self.user_course_statuses]

    # def enable_permission(self, permission: str, value: str) -> bool:
    #     return setattr(self, permission, True)

    def set_permission(self, permission: str, value: int):
        return setattr(self, permission, value)

    def has_permission(self, permission: str) -> bool:
        return getattr(self, permission, 0) == 1

    @property
    def permissions(self):
        return {
            "can_access_tutorials": self.can_access_tutorials,
            "can_manage_roles": self.can_manage_roles,
        }

    def remove_permission(self, permission_type: str):
        self.permissions = [
            perm for perm in self.permissions if perm.name != permission_type
        ]

    def __repr__(self):
        return f"<Role {self.name=} {self.course=}>"
