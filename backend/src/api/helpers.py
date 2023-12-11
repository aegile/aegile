from os import error
from sqlalchemy.exc import NoResultFound

from ..extensions import db
from ..error import InputError


def fetch_one_by_id(model, id, error_message):
    try:
        return db.session.execute(db.select(model).filter_by(id=id)).scalar_one()
    except NoResultFound as exc:
        print(error_message)
        raise InputError(error_message) from exc


def fetch_all_by_id(model, id, error_message):
    try:
        return db.session.execute(db.select(model).filter_by(id=id)).scalars()
    except NoResultFound as exc:
        raise InputError(error_message) from exc
