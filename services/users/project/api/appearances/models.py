# services/users/project/api/appearances/models.py

import os


from sqlalchemy.sql import func

from project import db
from flask import current_app


class Appearance(db.Model):
    __tablename__ = "appearances"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    contestant_id = db.Column(db.Integer, db.ForeignKey("contestants.id"))
    contestant = db.relationship("Contestant")

    # # Overall Challenge Stats
    # challengeWins = db.Column(db.Float, nullable=False)
    # challengeAppearances = db.Column(db.Float, nullable=False)
    # sitOuts = db.Column(db.Integer, nullable=False)

    # # Overall Tribal Council Stats
    # votesForBootee = db.Column(db.Integer, nullable=False)
    # votesAgainst = db.Column(db.Integer, nullable=False)
    # totalVotesCast = db.Column(db.Integer, nullable=False)
    # tribalCouncilAppearances = db.Column(db.Integer, nullable=False)
