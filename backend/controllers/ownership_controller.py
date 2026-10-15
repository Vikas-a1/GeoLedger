from flask import request

from services.ownership_service import OwnershipService
from utils.responses import success_response


def get_ownership_service():
    return OwnershipService()


def submit_ownership_transfer():
    data = request.get_json() or {}

    application = get_ownership_service().create_transfer_application(
        data
    )

    return success_response(
        "Ownership transfer application submitted successfully",
        data=application,
        status_code=201
    )


def get_ownership_history(property_id):
    history = get_ownership_service().get_ownership_history(
        property_id
    )

    return success_response(
        "Ownership history retrieved successfully",
        data=history
    )