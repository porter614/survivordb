# project/api/__init__.py


from flask_restx import Api

from project.api.ping import ping_namespace
from project.api.users.views import users_namespace
from project.api.contestants.views import contestant_namespace
from project.api.appearances.views import appearance_namespace
from project.api.idols.views import idol_namespace
from project.api.seasons.views import season_namespace
from project.api.auth import auth_namespace  # new

api = Api(version="1.0", title="Users API", doc="/doc/")

api.add_namespace(ping_namespace, path="/ping")
api.add_namespace(users_namespace, path="/users")
api.add_namespace(contestant_namespace, path="/contestants")
api.add_namespace(appearance_namespace, path="/appearances")
api.add_namespace(idol_namespace, path="/idols")
api.add_namespace(season_namespace, path="/seasons")
api.add_namespace(auth_namespace, path="/auth")  # new
