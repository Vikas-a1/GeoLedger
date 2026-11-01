from flask import Blueprint, request

from services.application_service import ApplicationService
from utils.responses import success_response


applications_bp = Blueprint(
    "applications",
    __name__,
    url_prefix="/applications",
)


def get_application_service():
    return ApplicationService()


@applications_bp.route("", methods=["POST"])
def create_application():

    data = request.get_json() or {}

    application = (
        get_application_service()
        .create_application(data)
    )

    return success_response(
        "Application created successfully",
        data=application,
        status_code=201,
    )


@applications_bp.route("", methods=["GET"])
def list_applications():

    applications = (
        get_application_service()
        .list_applications(
            applicant_wallet=request.args.get("applicant_wallet"),
            status=request.args.get("status"),
        )
    )

    return success_response(
        "Applications retrieved successfully",
        data=applications,
    )


@applications_bp.route(
    "/<application_id>",
    methods=["GET"],
)
def get_application(application_id):

    application = (
        get_application_service()
        .get_application(application_id)
    )

    return success_response(
        "Application retrieved successfully",
        data=application,
    )


@applications_bp.route(
    "/<application_id>/status",
    methods=["PUT"],
)
def update_application_status(application_id):

    data = request.get_json() or {}

    application = (
        get_application_service()
        .update_status(
            application_id=application_id,
            status=data.get("status"),
            rejection_reason=data.get(
                "rejection_reason"
            ),
            verification_summary=data.get(
                "verification_summary"
            ),
        )
    )

    return success_response(
        "Application status updated successfully",
        data=application,
    )
    
@applications_bp.route(
    "/<application_id>/approve",
    methods=["POST"],
)

def approve_application(application_id):

    application = (
        get_application_service()
        .verify_and_approve(application_id)
    )

    return success_response(
        "Application approved successfully",
        data=application,
    )    