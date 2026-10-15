from flask import Blueprint

from controllers.ownership_controller import (
    get_ownership_history,
    submit_ownership_transfer,
)

ownership_bp = Blueprint("ownership", __name__)

ownership_bp.route(
    "/ownership/transfer",
    methods=["POST"]
)(submit_ownership_transfer)

ownership_bp.route(
    "/ownership/history/<property_id>",
    methods=["GET"]
)(get_ownership_history)