from flask import Blueprint

from controllers.auth_controller import register_user, status

auth_bp = Blueprint("auth", __name__)


auth_bp.route("/", methods=["GET"])(status)

auth_bp.route("/auth/register", methods=["POST"])(register_user)
