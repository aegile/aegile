from sqlalchemy.exc import NoResultFound, IntegrityError

from ..extensions import db
from ..error import InputError
from ..models.user import User
from ..handlers.events import trigger_event

AUTH_NAME = "jsonWebToken"

authorizations = {
    AUTH_NAME: {
        "type": "apiKey",
        "in": "header",
        "name": "Authorization",
    }
}


def fetch_one(model, filter):
    try:
        return db.session.scalars(db.select(model).filter_by(**filter)).one()
    except NoResultFound as exc:
        msg = f"{model.__name__} {filter} was not found."
        trigger_event("event_db_query_not_found", msg)
        raise InputError(f"ERROR: {msg}") from exc


def fetch_all(model, filter=None):
    try:
        if filter:
            return (
                db.session.execute(db.select(model).filter_by(**filter)).scalars().all()
            )
        else:
            return db.session.execute(db.select(model)).scalars().all()
    except NoResultFound as exc:
        msg = f"{model.__name__}s not found."
        trigger_event("event_db_query_not_found", msg)
        raise InputError(f"ERROR: {msg}") from exc


def add_db_object(model, object, error_field):
    try:
        db.session.add(object)
        db.session.commit()
        return {}, 201
    except IntegrityError as exc:
        db.session.rollback()
        raise InputError(f"{model.__name__} {error_field} already exists.") from exc


def update_db_object(model, error_field):
    try:
        db.session.commit()
        return {}, 200
    except IntegrityError as exc:
        db.session.rollback()
        raise InputError(f"{model.__name__} {error_field} already exists.") from exc


# Legacy
def fetch_one_by_id(model, id, error_message):
    try:
        return db.session.execute(db.select(model).filter_by(id=id)).scalar_one()
    except NoResultFound as exc:
        raise InputError(error_message) from exc


def fetch_user_by_handle(handle):
    try:
        return db.session.execute(db.select(User).filter_by(handle=handle)).scalar_one()
    except NoResultFound as exc:
        raise InputError(f"ERROR: User {handle} was not found.") from exc


def fetch_all_by_id(model, id, error_message):
    try:
        return db.session.execute(db.select(model).filter_by(id=id)).scalars()
    except NoResultFound as exc:
        raise InputError(error_message) from exc
