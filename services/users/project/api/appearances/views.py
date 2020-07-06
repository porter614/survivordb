# project/api/users/views.py


from flask import request
from flask_restx import Resource, fields, Namespace

from project.api.appearances.crud import get_all_appearances
from project.api.appearances.models import Appearance

appearance_namespace = Namespace("appearances")

appearance = appearance_namespace.model(
    "Appearance",
    {
        "id": fields.Integer(readOnly=True),
        "season": fields.Integer(),
        "contestant_id": fields.String(attribute="contestant.id"),
        "contestant": fields.String(attribute="contestant.name"),
        "image_link": fields.String(attribute="contestant.image_link"),
        "birthdate": fields.DateTime(attribute="contestant.birthdate"),
        "occupations": fields.String(attribute="contestant._occupation"),
        "hometown": fields.String(attribute="contestant.hometown"),
        "challengeWins": fields.Integer(),
        "challengeAppearances": fields.Float(),
        "challengeWinPercentage": fields.Float(),
        "immunityChallengeAppearances": fields.Integer(),
        "immunityChallengeWins": fields.Integer(),
        "rewardChallengeAppearances": fields.Integer(),
        "rewardChallengeWins": fields.Integer(),
        "individualImmunityChallengeWins": fields.Integer(),
        "individualRewardChallengeWins": fields.Integer(),
        "sitOuts": fields.Integer(),
        "votesForBootee": fields.Integer(),
        "wrongSideOfTheVote": fields.Integer(),
        "votesAgainst": fields.Integer(),
        "totalVotesCast": fields.Integer(),
        "tribalCouncilAppearances": fields.Integer(),
        "juryVotesReceived": fields.Integer(),
        "daysPlayed": fields.Integer(),
        "place": fields.Integer(),
        "rank": fields.Float(),
        "idols": fields.List(fields.Integer(attribute="id")),
    },
)


class AppearanceList(Resource):
    @appearance_namespace.marshal_with(appearance, as_list=True)
    def get(self):
        """Returns all users."""
        return get_all_appearances(**request.args), 200


appearance_namespace.add_resource(AppearanceList, "")
