# project/api/users/views.py


from flask import request
from flask_restx import Resource, fields, Namespace

from project.api.idols.crud import get_all_idols


idol_namespace = Namespace("idols")

idol = idol_namespace.model(
    "Idol",
    {
        "id": fields.Integer(readOnly=True),
        "season": fields.Integer(readOnly=True),
        "was_held": fields.Boolean(readOnly=True),
        "was_played": fields.Boolean(readOnly=True),
        "votes_voided": fields.Integer(readOnly=True),
        "tie_avoided": fields.Boolean(readOnly=True),
        "day_found": fields.Integer(readOnly=True),
        "day_played": fields.Integer(readOnly=True),
        "note": fields.String(readOnly=True),
        "appearance": fields.Integer(attribute="appearance.id"),
    },
)


class IdolList(Resource):
    @idol_namespace.marshal_with(idol, as_list=True)
    def get(self):
        """Returns all users."""
        return get_all_idols(**request.args), 200


# class Idol(Resource):
#     @idol_namespace.marshal_with(idol)
#     @idol_namespace.response(200, "Success")
#     @idol_namespace.response(404, "Contestant <id> does not exist")
#     def get(self, contestant_id):
#         """Returns a single user."""
#         user = get_contestant_by_id(contestant_id)
#         if not user:
#             idol_namespace.abort(404, f"Contestant {contestant_id} does not exist")
#         return user, 200


idol_namespace.add_resource(IdolList, "")
# contestant_namespace.add_resource(Contestant, "/<int:contestant_id>")
