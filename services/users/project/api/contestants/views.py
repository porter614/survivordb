# project/api/users/views.py


from flask import request
from flask_restx import Resource, fields, Namespace

from project.api.contestants.crud import get_all_contestants


contestant_namespace = Namespace("contestants")

contestant = contestant_namespace.model(
    "Contestant",
    {
        "id": fields.Integer(readOnly=True),
        "name": fields.String(readOnly=True),
        "birthdate": fields.DateTime(),
        "occupation": fields.String(readOnly=True),
        "appearances": fields.List(fields.Integer(attribute="id")),
    },
)


class ContestantList(Resource):
    @contestant_namespace.marshal_with(contestant, as_list=True)
    def get(self):
        """Returns all users."""
        return get_all_contestants(), 200


contestant_namespace.add_resource(ContestantList, "")
