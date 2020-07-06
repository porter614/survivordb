# services/users/project/api/contestants/models.py

import os


from sqlalchemy.sql import func

from project import db
from flask import current_app


class Idol(db.Model):

    __tablename__ = "idols"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)

    # TODO add more
    appearance_id = db.Column(db.Integer, db.ForeignKey("appearances.id"))
    appearance = db.relationship("Appearance")

    finder = db.Column(db.String(256), nullable=False)
    season = db.Column(db.Integer, nullable=False)
    was_held = db.Column(db.Boolean, nullable=False)
    was_played = db.Column(db.Boolean, nullable=False)
    votes_voided = db.Column(db.Integer, nullable=False)
    boot_avoided = db.Column(db.Boolean, nullable=False)
    tie_avoided = db.Column(db.Boolean, nullable=False)
    day_found = db.Column(db.Integer, nullable=False)
    day_played = db.Column(db.Integer, nullable=False)

    note = db.Column(db.String(512), default="", nullable=False)
