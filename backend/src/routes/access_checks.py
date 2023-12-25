from ..error import InputError, AccessError, NotFoundError
from ..models.course import Course
from ..models.user import User
from ..models.role import Role


def query_course_creator(course: Course, user: User):
    if user.id != course.creator:
        raise AccessError(
            f"You are not the creator of this {(Course.__name__).lower()}"
        )


def query_in_userset(model, object, user, is_auth_user=True):
    if user not in object.userset.members:
        if is_auth_user:
            raise AccessError(
                f"You are not a member of this {(model.__name__).lower()}"
            )
        raise NotFoundError(
            f"{user.handle} is not a member of this {(model.__name__).lower()}"
        )
    return object


def check_role_permission(role: Role, permission: str):
    if not role.has_permission(permission):
        raise AccessError(f"You are not authorized to access this resource.")
