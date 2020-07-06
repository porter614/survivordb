# project/api/users/crud.py


from project import db
from project.api.appearances.models import Appearance


def get_all_appearances(*args, **kwargs):
    return Appearance.query.filter_by(**kwargs).all()
