from sqlalchemy.exc import NoResultFound
from ..error import InputError, AccessError, NotFoundError
from ..models.course import Course, UserCourseStatus
from ..models.user import User
from ..models.role import Role
from ..extensions import db


def check_authorization(course: Course, user: User, permission: str):
    if user.id == course.creator:
        return
    try:
        ucs: UserCourseStatus = db.session.scalars(
            db.select(UserCourseStatus).filter_by(course_id=course.id, user_id=user.id)
        ).one()
    except NoResultFound as exc:
        raise AccessError("You are not a member of this course")

    if not ucs.role or not ucs.role.has_permission(permission):
        raise AccessError("You are not authorized to access this resource.")


def check_course_creator(course: Course, user: User):
    if user.id != course.creator:
        raise AccessError(
            f"You are not the creator of this {(Course.__name__).lower()}"
        )


def check_is_member(model, object, user, is_auth_user=True):
    if user not in object.members:
        if is_auth_user:
            raise AccessError(
                f"You are not a member of this {(model.__name__).lower()}"
            )
        raise NotFoundError(
            f"{user.handle} is not a member of this {(model.__name__).lower()}"
        )


def check_in_userset(model, object, user, is_auth_user=True):
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
