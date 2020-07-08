# project/api/users/views.py


from flask import request
from flask_restx import Resource, fields, Namespace

from project.api.contestants.crud import get_all_contestants, get_contestant_by_id
from project.api.appearances.crud import get_appearance_by_ids
from project.api.appearances.views import appearance
from collections import Counter

contestant_namespace = Namespace("contestants")

contestant = contestant_namespace.model(
    "Contestant",
    {
        "id": fields.Integer(readOnly=True),
        "name": fields.String(readOnly=True),
        "birthdate": fields.DateTime(),
        "hometown": fields.String(readOnly=True),
        "occupation": fields.String(readOnly=True),
        "appearances": fields.List(fields.Integer(attribute="id")),
        "image_link": fields.String(readOnly=True),
        "profile_image_link": fields.String(readOnly=True),
    },
)

career_stats = set(
    [
        "challengeWins",
        "challengeAppearances",
        "challengeWinPercentage",
        "immunityChallengeAppearances",
        "immunityChallengeWins",
        "rewardChallengeAppearances",
        "rewardChallengeWins",
        "individualImmunityChallengeWins",
        "individualRewardChallengeWins",
        "sitOuts",
        "votesForBootee",
        "wrongSideOfTheVote",
        "votesAgainst",
        "totalVotesCast",
        "tribalCouncilAppearances",
        "juryVotesReceived",
        "daysPlayed",
    ]
)

career = contestant_namespace.model(
    "Career",
    {
        "seasons": fields.List(fields.Integer()),
        "id": fields.Integer(readOnly=True),
        "contestant_id": fields.String(attribute="contestant.id"),
        "contestant": fields.String(attribute="contestant.name"),
        "image_link": fields.String(attribute="contestant.image_link"),
        "profile_image_link": fields.String(attribute="contestant.profile_image_link"),
        "birthdate": fields.DateTime(attribute="contestant.birthdate"),
        "occupations": fields.List(fields.String(), attribute="contestant.occupation"),
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

player_name = contestant_namespace.model(
    "Player", {"id": fields.String(), "name": fields.String(),},
)


def compile_career_stats(appearances):
    c = Counter()
    seasons = []
    idols = []
    for appearance in appearances:
        # need this line or else appearance.contestant member value remain null
        _ = appearance.contestant

        seasons.append(appearance.season)
        idols.extend(appearance.idols)

        a = appearance.__dict__
        a_mod = {key: a[key] for key in career_stats}
        c.update(a_mod)

    result = dict(c)
    for key, value in appearances[0].__dict__.items():
        if key not in career_stats and key != "_sa_instance_state":
            result[key] = value
    result["seasons"] = seasons
    result["idols"] = idols

    return result


class ContestantList(Resource):
    @contestant_namespace.marshal_with(contestant, as_list=True)
    def get(self):
        """Returns all users."""
        return get_all_contestants(**request.args), 200


class Contestant(Resource):
    @contestant_namespace.marshal_with(contestant)
    @contestant_namespace.response(200, "Success")
    @contestant_namespace.response(404, "Contestant <id> does not exist")
    def get(self, contestant_id):
        """Returns a single user."""
        user = get_contestant_by_id(contestant_id)
        if not user:
            contestant_namespace.abort(
                404, f"Contestant {contestant_id} does not exist"
            )
        return user, 200


class CareerList(Resource):
    @contestant_namespace.marshal_with(career, as_list=True)
    def get(self):
        """Returns all users."""
        return (
            list(
                map(
                    lambda contestant: compile_career_stats(contestant.appearances),
                    get_all_contestants(**request.args),
                )
            ),
            200,
        )


class Career(Resource):
    @contestant_namespace.marshal_with(career)
    @contestant_namespace.response(200, "Success")
    @contestant_namespace.response(404, "Contestant <id> does not exist")
    def get(self, contestant_id):
        """Returns a single user."""
        contestant = get_contestant_by_id(contestant_id)
        if not contestant:
            contestant_namespace.abort(
                404, f"Contestant {contestant_id} does not exist"
            )

        career = compile_career_stats(contestant.appearances)
        return career, 200


class PlayerNames(Resource):
    # @contestant_namespace.marshal_with(player_name, as_list=True)
    def get(self):
        """Returns all users."""
        # return get_all_contestants(**request.args), 200
        return (
            dict(
                map(
                    lambda contestant: (contestant.name, contestant.id),
                    get_all_contestants(**request.args),
                )
            ),
            200,
        )


contestant_namespace.add_resource(ContestantList, "")
contestant_namespace.add_resource(Contestant, "/<int:contestant_id>")
contestant_namespace.add_resource(Career, "/<int:contestant_id>/career")
contestant_namespace.add_resource(CareerList, "/careers")
contestant_namespace.add_resource(PlayerNames, "/names")
