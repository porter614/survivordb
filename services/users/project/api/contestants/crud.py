# project/api/users/crud.py


from project import db
from project.api.contestants.models import Contestant


def get_all_contestants():
    return Contestant.query.all()
