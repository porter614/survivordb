# project/api/users/views.py


from flask import request
from flask_restx import Resource, fields, Namespace

from project.api.contestants.crud import get_all_contestants


appearance_namespace = Namespace("appearances")

appearance = appearance_namespace.model(
    "Appearance", {"id": fields.Integer(readOnly=True), "contestant": fields.Nested()},
)


class ContestantList(Resource):
    @contestant_namespace.marshal_with(contestant, as_list=True)
    def get(self):
        """Returns all users."""
        return get_all_contestants(), 200


contestant_namespace.add_resource(ContestantList, "")
