# project/api/users/crud.py


from project import db
from project.api.idols.models import Idol


def get_all_idols(*args, **kwargs):
    return Idol.query.filter_by(**kwargs).all()
