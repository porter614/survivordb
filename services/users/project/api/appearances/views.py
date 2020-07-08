# project/api/users/views.py


from flask import request
from flask_restx import Resource, fields, Namespace

from project.api.appearances.crud import get_all_appearances
from project.api.appearances.models import Appearance
from collections import defaultdict

appearance_namespace = Namespace("appearances")

appearance = appearance_namespace.model(
    "Appearance",
    {
        "id": fields.Integer(readOnly=True),
        "season": fields.Integer(),
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

node = appearance_namespace.model(
    "Node",
    {
        "id": fields.Integer(),
        "label": fields.String(),
        "title": fields.String(),
        "image": fields.String(),
        "shape": fields.String(),
        "brokenImage": fields.String(),
        "value": fields.Integer(),
    },
)

edge = appearance_namespace.model(
    "Edge", {"from": fields.Integer(), "to": fields.Integer()},
)

graph = appearance_namespace.model(
    "Graph",
    {
        "nodes": fields.List(fields.Nested(node)),
        "edges": fields.List(fields.Nested(edge)),
    },
)


class AppearanceList(Resource):
    @appearance_namespace.marshal_with(appearance, as_list=True)
    def get(self):
        """Returns all users."""
        return get_all_appearances(**request.args), 200


class Graph(Resource):
    @appearance_namespace.marshal_with(graph)
    def get(self):
        edges = []
        nodes = defaultdict(dict)
        appearances = get_all_appearances(**request.args)

        for appearance in appearances:
            if 10000 + appearance.season not in nodes and appearance.season != -1:
                nodes[10000 + appearance.season] = {
                    "id": 10000 + appearance.season,
                    "label": "Season " + str(appearance.season),
                    "title": "TODO",
                    "shape": "circularImage",
                    "image": "https://survivordb.s3-us-west-2.amazonaws.com/"
                    + str(appearance.season)
                    + ".jpg",
                    "brokenImage": "https://survivordb.s3-us-west-2.amazonaws.com/"
                    + str(appearance.season)
                    + ".jpg",
                    "value": 50,
                }

            nodes[appearance.contestant_id] = {
                "id": appearance.contestant_id,
                # "label": appearance.contestant.name,
                "title": appearance.contestant.name,
                "image": appearance.contestant.image_link,
                "shape": "circularImage",
                "brokenImage": "https://survivordb.s3-us-west-2.amazonaws.com/"
                + str(appearance.season)
                + ".jpg",
                "value": 15 * len(appearance.contestant.appearances),
            }
            if appearance.contestant.name == "Jeff Probst":
                nodes[appearance.contestant_id]["value"] = 1000
            else:
                edges.append(
                    {"from": appearance.contestant_id, "to": 10000 + appearance.season}
                )

        return {"nodes": list(nodes.values()), "edges": edges}


appearance_namespace.add_resource(AppearanceList, "")
appearance_namespace.add_resource(Graph, "/graph")
