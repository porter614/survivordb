# project/api/users/views.py


from flask import request
from flask_restx import Resource, fields, Namespace

from project.api.seasons.crud import get_all_seasons, get_season_by_id
from project.api.appearances.crud import get_appearance_by_ids
from project.api.appearances.views import appearance

season_namespace = Namespace("seasons")

contestant = season_namespace.model(
    "Season",
    {
        "id": fields.Integer(readOnly=True),
        "order": fields.Integer(),
        "contestants": fields.List(fields.String(attribute="name")),
        # "appearances": fields.List(fields.Integer(attribute="id"))
    },
)


class SeasonList(Resource):
    @season_namespace.marshal_with(contestant, as_list=True)
    def get(self):
        """Returns all users."""
        return get_all_seasons(**request.args), 200


class Season(Resource):
    @season_namespace.marshal_with(contestant)
    @season_namespace.response(200, "Success")
    @season_namespace.response(404, "Contestant <id> does not exist")
    def get(self, season_id):
        """Returns a single user."""
        user = get_season_by_id(season_id)
        if not user:
            season_namespace.abort(404, f"Contestant {season_id} does not exist")
        return user, 200


season_namespace.add_resource(SeasonList, "")
season_namespace.add_resource(Season, "/<int:season_id>")
