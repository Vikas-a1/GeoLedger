from flask import Blueprint

from controllers.verification_controller import (
    review_document,
    verify_document,
)


verification_bp = Blueprint(
    "verification",
    __name__,
)


verification_bp.route(
    "/verification/document/<document_id>",
    methods=["POST"],
)(verify_document)

verification_bp.route(
    "/verification/document/<document_id>/review",
    methods=["POST"],
)(review_document)