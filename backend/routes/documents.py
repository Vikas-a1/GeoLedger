from flask import Blueprint
from controllers.document_controller import (
    delete_document,
    download_document,
    get_documents_for_application,
    get_documents_for_property,
    upload_document,
)


documents_bp = Blueprint(
    "documents",
    __name__
)


documents_bp.route(
    "/documents/upload",
    methods=["POST"]
)(upload_document)


documents_bp.route(
    "/documents/property/<property_id>",
    methods=["GET"]
)(get_documents_for_property)


documents_bp.route(
    "/documents/application/<application_id>",
    methods=["GET"]
)(get_documents_for_application)


documents_bp.route(
    "/documents/<document_id>",
    methods=["DELETE"]
)(delete_document)


documents_bp.route(
    "/documents/download/<document_id>",
    methods=["GET"]
)(download_document)