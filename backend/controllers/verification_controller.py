from flask import request
from services.verification_service import VerificationService
from utils.responses import success_response


def get_verification_service():
    return VerificationService()


def verify_document(document_id):
    data = request.get_json(silent=True) or {}
    status = data.get("status")
    remarks = data.get("remarks")

    if status:
        result = get_verification_service().review_document(
            document_id, status=status, remarks=remarks
        )
    else:
        result = get_verification_service().verify_document(document_id)

    return success_response(
        "Document verification completed",
        data=result,
    )


def review_document(document_id):
    data = request.get_json(silent=True) or {}
    status = data.get("status", "VERIFIED")
    remarks = data.get("remarks", "Verified by authorized reviewer")

    result = get_verification_service().review_document(
        document_id, status=status, remarks=remarks
    )

    return success_response(
        "Document reviewed successfully",
        data=result,
    )