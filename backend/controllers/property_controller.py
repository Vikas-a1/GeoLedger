from flask import request

from services.property_service import PropertyService
from utils.responses import success_response


def get_property_service():
    return PropertyService()


def create_property():
    data = request.get_json() or {}

    property_record = get_property_service().create_property(data)

    return success_response(
        "Property created successfully",
        data=property_record,
        status_code=201
    )


def list_properties():
    properties = get_property_service().list_properties()

    return success_response(
        "Properties retrieved successfully",
        data=properties
    )


def get_property_by_survey(survey_number):
    property_record = get_property_service().get_property_by_survey(
        survey_number
    )

    return success_response(
        "Property retrieved successfully",
        data=property_record
    )


def update_property(property_id):
    data = request.get_json() or {}

    property_record = get_property_service().update_property(
        property_id,
        data
    )

    return success_response(
        "Property updated successfully",
        data=property_record
    )


def delete_property(property_id):
    get_property_service().delete_property(property_id)

    return success_response(
        "Property deleted successfully"
    )