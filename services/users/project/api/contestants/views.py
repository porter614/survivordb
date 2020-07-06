# project/api/users/views.py


from flask import request
from flask_restx import Resource, fields, Namespace

from project.api.contestants.crud import get_all_contestants, get_contestant_by_id


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


contestant_namespace.add_resource(ContestantList, "")
contestant_namespace.add_resource(Contestant, "/<int:contestant_id>")
