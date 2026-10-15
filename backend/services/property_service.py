from datetime import datetime

from bson import ObjectId

from database.client import get_database
from models.property import PropertyModel
from utils.errors import APIError
from utils.validation import (
    validate_property_data,
    validate_property_id,
    validate_survey_number,
)


class PropertyService:

    def __init__(self):
        self.db = get_database()

        self.collection = self.db.properties
        self.applications = self.db.applications
        self.documents = self.db.documents

    # ---------------------------------------------------------
    # CREATE PROPERTY
    # ---------------------------------------------------------

    def create_property(self, data: dict) -> dict:

        validate_property_data(data)

        application_id = data.get("application_id")

        if not application_id:
            raise APIError(
                "An approved application is required "
                "to register a property",
                status_code=400,
            )

        if not ObjectId.is_valid(application_id):
            raise APIError(
                "Invalid application ID",
                status_code=400,
            )

        application = self.applications.find_one(
            {"_id": ObjectId(application_id)}
        )

        if not application:
            raise APIError(
                "Application not found",
                status_code=404,
            )

        # A property can only be created from an approved
        # registration application.
        if application.get("status") != "APPROVED":
            raise APIError(
                "Property cannot be registered until "
                "the application is approved",
                status_code=409,
            )

        survey_number = data["survey_number"]

        validate_survey_number(survey_number)

        # Ensure the application and property refer to the
        # same survey number.
        if application.get("survey_number") != survey_number:
            raise APIError(
                "Survey number does not match the application",
                status_code=409,
            )

        # Prevent duplicate property registration.
        existing_property = self.collection.find_one(
            {"survey_number": survey_number}
        )

        if existing_property:
            raise APIError(
                "Property with this survey number already exists",
                status_code=409,
            )

        now = datetime.utcnow()

        property_model = PropertyModel(
            survey_number=survey_number,
            property_id="",
            owner_wallet=data.get("owner_wallet"),
            land_type=data.get("land_type"),
            village=data.get("village"),
            taluk=data.get("taluk"),
            district=data.get("district"),
            state=data.get("state"),
            area=data.get("area"),
            geojson_reference=data.get(
                "geojson_reference"
            ),
            status="REGISTERED",
            created_at=now,
            updated_at=now,
        )

        property_data = property_model.to_dict()

        # MongoDB generates the actual property ID.
        property_data.pop("property_id", None)

        # Keep the originating application reference.
        property_data["application_id"] = application_id

        # Keep submitted document references if provided.
        property_data["document_ids"] = data.get(
            "document_ids",
            [],
        )

        result = self.collection.insert_one(
            property_data
        )

        property_data["property_id"] = str(
            result.inserted_id
        )

        return property_data

    # ---------------------------------------------------------
    # LIST PROPERTIES
    # ---------------------------------------------------------

    def list_properties(self) -> list:

        return [
            self._serialize_property(item)
            for item in self.collection.find().sort(
                "created_at",
                -1,
            )
        ]

    # ---------------------------------------------------------
    # GET PROPERTY BY SURVEY NUMBER
    # ---------------------------------------------------------

    def get_property_by_survey(
        self,
        survey_number: str,
    ) -> dict:

        validate_survey_number(survey_number)

        property_data = self.collection.find_one(
            {
                "survey_number": survey_number
            }
        )

        if not property_data:
            raise APIError(
                "Property not found",
                status_code=404,
            )

        return self._serialize_property(
            property_data
        )

    # ---------------------------------------------------------
    # GET PROPERTY BY ID
    # ---------------------------------------------------------

    def get_property(
        self,
        property_id: str,
    ) -> dict:

        validate_property_id(property_id)

        property_data = self.collection.find_one(
            {
                "_id": ObjectId(property_id)
            }
        )

        if not property_data:
            raise APIError(
                "Property not found",
                status_code=404,
            )

        return self._serialize_property(
            property_data
        )

    # ---------------------------------------------------------
    # UPDATE PROPERTY
    # ---------------------------------------------------------

    def update_property(
        self,
        property_id: str,
        data: dict,
    ) -> dict:

        validate_property_id(property_id)

        validate_property_data(
            data,
            update=True,
        )

        data["updated_at"] = datetime.utcnow()

        result = self.collection.find_one_and_update(
            {
                "_id": ObjectId(property_id)
            },
            {
                "$set": data
            },
            return_document=True,
        )

        if not result:
            raise APIError(
                "Property not found",
                status_code=404,
            )

        return self._serialize_property(
            result
        )

    # ---------------------------------------------------------
    # DELETE PROPERTY
    # ---------------------------------------------------------

    def delete_property(
        self,
        property_id: str,
    ) -> None:

        validate_property_id(property_id)

        result = self.collection.delete_one(
            {
                "_id": ObjectId(property_id)
            }
        )

        if result.deleted_count == 0:
            raise APIError(
                "Property not found",
                status_code=404,
            )

    # ---------------------------------------------------------
    # SERIALIZATION
    # ---------------------------------------------------------

    @staticmethod
    def _serialize_property(
        document: dict,
    ) -> dict:

        document = document.copy()

        document["property_id"] = str(
            document.pop("_id")
        )

        return document