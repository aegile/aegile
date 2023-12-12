from os import error
from sqlalchemy.exc import NoResultFound

from ..extensions import db
from ..error import InputError
from ..models.user import User


def fetch_one(model, filter):
    try:
        return db.session.execute(db.select(model).filter_by(**filter)).scalar_one()
    except NoResultFound as exc:
        raise InputError(
            f"ERROR: {model.__name__} {list(filter.values())[0]} was not found."
        ) from exc


def fetch_all(model, filter=None):
    try:
        if filter:
            return (
                db.session.execute(db.select(model).filter_by(**filter)).scalars().all()
            )
        else:
            return db.session.execute(db.select(model)).scalars().all()
    except NoResultFound as exc:
        raise InputError(f"ERROR: {model.__name__}s not found.") from exc


def fetch_one_by_id(model, id, error_message):
    try:
        return db.session.execute(db.select(model).filter_by(id=id)).scalar_one()
    except NoResultFound as exc:
        print(error_message)
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
