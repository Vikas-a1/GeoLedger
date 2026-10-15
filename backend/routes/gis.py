from flask import Blueprint
from services.gis_service import GISService
from utils.responses import success_response

gis_bp = Blueprint("gis", __name__)


def get_gis_service():
    return GISService()


@gis_bp.route("/gis/property/<survey_number>", methods=["GET"])
def get_property_geojson(survey_number):
    result = get_gis_service().get_geojson_by_survey_number(survey_number)
    return success_response(
        "GIS parcel data retrieved successfully",
        data=result,
    )
