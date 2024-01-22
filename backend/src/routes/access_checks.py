from sqlalchemy.exc import NoResultFound
from ..error import InputError, AccessError, NotFoundError
from ..models.course import Course, UserCourseStatus
from ..models.user import User
from ..models.tutorial import Tutorial
from ..models.deliverable import DeliverableInstance
from ..models.project import Project
from ..models.task import Task
from ..models.role import Role
from ..extensions import db


def has_manage_authorization(course: Course, user: User, permission: str):
    if user.id == course.creator_id:
        return True
    try:
        ucs: UserCourseStatus = db.session.scalars(
            db.select(UserCourseStatus).filter_by(course_id=course.id, user_id=user.id)
        ).one()
    except NoResultFound as exc:
        return False

    if not ucs.role or not ucs.role.has_permission(permission):
        return False


def check_authorization(course: Course, user: User, permission: str):
    if user.id == course.creator_id:
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
    if user.id != course.creator_id:
        raise AccessError(
            f"You are not the creator of this {(Course.__name__).lower()}"
        )


def check_in_other_tuts(course: Course, tutorial: Tutorial, user: User):
    for tut in course.tutorials:
        if user in tut.members and tut.id != tutorial.id:
            raise InputError(
                f"User {user.handle} is already enrolled in another tutorial."
            )


def check_is_in_a_project(instance: DeliverableInstance, user: User):
    for prj in instance.projects:
        if user in prj.members:
            raise InputError(
                f"User {user.handle} is already enrolled in project {prj.name}."
            )


def check_project_view_access(tutorial: Tutorial, user: User):
    if user in tutorial.members:
        return
    course: Course = db.session.scalars(
        db.select(Course).filter_by(id=tutorial.course_id)
    ).one()
    check_authorization(course, user, "can_manage_projects")


def check_project_edit_access(project: Project, user: User, course_id: str):
    if user.id == project.creator_id:
        return
    course: Course = db.session.scalars(db.select(Course).filter_by(id=course_id)).one()
    check_authorization(course, user, "can_manage_projects")


# Only project members and tutors/lic are able to fetch or view task info in
# projects
def check_task_view_access(project: Project, user: User):
    if user in project.members:
        return
    course: Course = db.session.scalars(
        db.select(Course).filter_by(id=project.course_id)
    ).one()
    check_authorization(course, user, "can_manage_tasks")


# Only allows task creators or course tutors to edit a particular task
# "can_manage_tasks" is a permission that is provided to tutors and lic
def check_task_edit_access(task: Task, user: User, course_id: str):
    if user.id == task.creator_id:
        return
    course: Course = db.session.scalars(db.select(Course).filter_by(id=course_id)).one()
    check_authorization(course, user, "can_manage_tasks")


def check_is_member(model, object, user, is_auth_user=True):
    if user not in object.members:
        if is_auth_user:
            raise AccessError(
                f"You are not a member of this {(model.__name__).lower()}"
            )
        raise NotFoundError(
            f"{user.handle} is not a member of this {(model.__name__).lower()}"
        )


def check_access(course: Course, model, object, user: User, permission: str):
    if user.id == model.creator_id:
        return
    try:
        check_is_member(model, object, user)
    except AccessError:
        check_authorization(course, user, permission)


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
