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
    occupation = db.Column(db.String(256), nullable=False)

    # TODO add more
    appearances = db.relationship("Appearance")
