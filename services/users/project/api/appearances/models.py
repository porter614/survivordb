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
    season_id = db.Column(db.Integer, db.ForeignKey("seasons.id"))
    season = db.relationship("Season")

    # Overall Challenge Stats
    challengeWins = db.Column(db.Float, nullable=False)
    challengeAppearances = db.Column(db.Float, nullable=False)
    challengeWinPercentage = db.Column(db.Float, nullable=False)
    sitOuts = db.Column(db.Integer, nullable=False)

    immunityChallengeAppearances = db.Column(db.Integer, nullable=False)
    immunityChallengeWins = db.Column(db.Integer, nullable=False)
    rewardChallengeAppearances = db.Column(db.Float, nullable=False)
    rewardChallengeWins = db.Column(db.Float, nullable=False)
    individualImmunityChallengeWins = db.Column(db.Integer, nullable=False)
    individualRewardChallengeWins = db.Column(db.Float, nullable=False)

    # Overall Tribal Council Stats
    votesForBootee = db.Column(db.Integer, nullable=False)
    wrongSideOfTheVote = db.Column(db.Integer, nullable=False)
    votesAgainst = db.Column(db.Integer, nullable=False)
    totalVotesCast = db.Column(db.Integer, nullable=False)
    tribalCouncilAppearances = db.Column(db.Integer, nullable=False)

    # Overall Jury Stats
    juryVotesReceived = db.Column(db.Integer, nullable=False)

    # General Stats
    daysPlayed = db.Column(db.Float, nullable=False)
    place = db.Column(db.Integer, nullable=False)
    season = db.Column(db.Integer, nullable=False)
    didNotFinish = db.Column(db.Boolean, nullable=False)
    # score/rank
    rank = db.Column(db.Float, nullable=False)

    idols = db.relationship("Idol")
