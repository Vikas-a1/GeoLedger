import re
from bson import ObjectId

from config import Config
from utils.errors import APIError

WALLET_ADDRESS_REGEX = re.compile(r"^0x[a-fA-F0-9]{40}$")


def validate_wallet_address(address: str) -> str:
    if not address or not WALLET_ADDRESS_REGEX.match(address):
        raise APIError("Invalid wallet address format", status_code=400)
    return address


def validate_survey_number(survey_number: str) -> str:
    if not survey_number or not isinstance(survey_number, str):
        raise APIError("Survey number is required", status_code=400)
    return survey_number.strip()


def validate_property_id(property_id: str) -> None:
    if not property_id or not ObjectId.is_valid(property_id):
        raise APIError("Invalid property ID", status_code=400)


def validate_property_data(data: dict, update: bool = False) -> None:
    required_fields = ["survey_number", "owner_wallet"]
    if not update:
        missing = [field for field in required_fields if field not in data or not data[field]]
        if missing:
            raise APIError(f"Missing required fields: {', '.join(missing)}", status_code=400)

    if "survey_number" in data:
        validate_survey_number(data["survey_number"])
    if "owner_wallet" in data:
        validate_wallet_address(data["owner_wallet"])


def validate_document_upload(
    reference_id: str,
    document_type: str,
    file
) -> None:

    if not reference_id:
        raise APIError(
            "Property or application reference is required",
            status_code=400
        )

    if not document_type:
        raise APIError(
            "Document type is required",
            status_code=400
        )

    if not file or file.filename == "":
        raise APIError(
            "Document file is required",
            status_code=400
        )

    if "." not in file.filename:
        raise APIError(
            "File must have an extension",
            status_code=400
        )

    extension = (
        file.filename
        .rsplit(".", 1)[-1]
        .lower()
    )

    if extension not in Config.ALLOWED_DOCUMENT_EXTENSIONS:
        raise APIError(
            "Unsupported file type",
            status_code=400
        )