from lib.log import logger
from .events import subscribe
from ..models.user import User


def handle_user_register_success(user: User):
    logger.info(f"User {user.email} has registered.")


def handle_user_login_success(user: User):
    logger.info(f"User {user.email} logged in")


def handle_user_login_fail(user: User):
    logger.info(f"User {user.email} failed to log in")


def handle_db_query_not_found(msg: str):
    logger.info(msg)


def setup_log_handlers():
    subscribe("event_user_login_success", handle_user_login_success)
    subscribe("event_user_login_fail", handle_user_login_fail)
    subscribe("event_db_query_not_found", handle_db_query_not_found)
