# services/users/project/api/contestants/models.py

import os


from sqlalchemy.sql import func

from project import db
from flask import current_app


class Contestant(db.Model):

    __tablename__ = "contestants"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(256), nullable=False)
    birthdate = db.Column(db.DateTime, default=func.now(), nullable=False)
    _occupation = db.Column(db.String(256), default="", nullable=False)
    hometown = db.Column(db.String(256), default="unknown", nullable=False)
    season_id = db.Column(db.Integer, db.ForeignKey("seasons.id"))

    @property
    def occupation(self):
        tmp = [x for x in self._occupation.split(";") if x]
        return tmp

    @occupation.setter
    def occupation(self, value):
        if not self._occupation:
            self._occupation = value + ";"
        else:
            self._occupation += ";%s" % value

    image_link = db.Column(db.String(256), default="unknown", nullable=False)
    profile_image_link = db.Column(db.String(256), default="unknown", nullable=False)

    # TODO add more
    appearances = db.relationship("Appearance")

    seasons = db.relationship(
        "Season",
        secondary="link",
        # backref="contestants",  # back_populates="contestants"
    )
