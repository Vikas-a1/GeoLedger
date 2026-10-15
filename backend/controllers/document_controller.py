from flask import request

from services.document_service import DocumentService
from utils.responses import success_response


def get_document_service():
    return DocumentService()


def upload_document():

    if "file" not in request.files:
        raise ValueError("No file provided")

    file = request.files["file"]

    property_id = request.form.get("property_id")
    application_id = request.form.get("application_id")
    document_type = request.form.get("document_type")

    document_record = (
        get_document_service().upload_document(
            property_id=property_id,
            application_id=application_id,
            document_type=document_type,
            file=file,
        )
    )

    return success_response(
        "Document uploaded successfully",
        data=document_record,
        status_code=201,
    )


def get_documents_for_property(property_id):

    documents = (
        get_document_service()
        .get_documents_for_property(property_id)
    )

    return success_response(
        "Documents retrieved successfully",
        data=documents,
    )


def get_documents_for_application(application_id):

    documents = (
        get_document_service()
        .get_documents_for_application(application_id)
    )

    return success_response(
        "Documents retrieved successfully",
        data=documents,
    )


def delete_document(document_id):

    get_document_service().delete_document(
        document_id
    )

    return success_response(
        "Document deleted successfully"
    )


def download_document(document_id):
    from flask import send_file, abort
    import os

    doc = get_document_service().get_document_by_id(document_id)
    file_path = doc.get("storage_location")
    if not file_path or not os.path.exists(file_path):
        abort(404, description="Document file not found on disk")

    return send_file(
        file_path,
        as_attachment=True,
        download_name=doc.get("filename", "document.pdf"),
    )