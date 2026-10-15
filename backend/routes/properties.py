from flask import Blueprint

from controllers.property_controller import (
    create_property,
    delete_property,
    get_property_by_survey,
    list_properties,
    update_property,
)

properties_bp = Blueprint("properties", __name__)

properties_bp.route("/properties", methods=["POST"])(create_property)
properties_bp.route("/properties", methods=["GET"])(list_properties)
properties_bp.route("/properties/<survey_number>", methods=["GET"])(get_property_by_survey)
properties_bp.route("/properties/<property_id>", methods=["PUT"])(update_property)
properties_bp.route("/properties/<property_id>", methods=["DELETE"])(delete_property)
