# project/api/users/crud.py


from project import db
from project.api.contestants.models import Contestant


def get_all_contestants(*args, **kwargs):
    return Contestant.query.filter_by(**kwargs).all()


def get_contestant_by_id(contestant_id):
    return Contestant.query.filter_by(id=contestant_id).first()
