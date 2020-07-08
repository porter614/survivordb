# project/api/users/crud.py


from project import db
from project.api.seasons.models import Season


def get_all_seasons(*args, **kwargs):
    return Season.query.filter_by(**kwargs).all()


def get_season_by_id(season_id):
    return Season.query.filter_by(id=season_id).first()
