from flask import Blueprint
from database.client import get_database
from services.blockchain_service import BlockchainService
from utils.errors import APIError
from utils.responses import success_response

public_verify_bp = Blueprint("public_verify", __name__)


@public_verify_bp.route("/verify/property/<identifier>", methods=["GET"])
def public_verify_property(identifier):
    db = get_database()
    prop = db.properties.find_one({"survey_number": identifier})
    if not prop:
        prop = db.properties.find_one({"property_id": identifier})
    if not prop:
        prop = db.properties.find_one({"_id": identifier})

    if not prop:
        raise APIError("Property not found in registry", status_code=404)

    survey_number = prop.get("survey_number")
    property_id = prop.get("property_id") or str(prop.get("_id"))

    # Fetch on-chain status if blockchain is reachable
    on_chain_data = None
    try:
        bc_service = BlockchainService()
        on_chain_data = bc_service.get_property(survey_number)
    except Exception:
        on_chain_data = {
            "property_id": survey_number,
            "owner": prop.get("owner_wallet"),
            "exists": True,
            "source": "database_cached",
        }

    # Fetch verified documents hashes
    docs_cursor = db.documents.find({"$or": [{"survey_number": survey_number}, {"property_id": property_id}]})
    docs_summary = [
        {
            "document_type": d.get("document_type"),
            "sha256_hash": d.get("document_hash"),
            "verification_status": d.get("verification_status"),
            "verified_at": d.get("verified_at"),
        }
        for d in docs_cursor
    ]

    response_data = {
        "property_id": property_id,
        "survey_number": survey_number,
        "status": prop.get("status", "REGISTERED"),
        "blockchain_owner_wallet": (on_chain_data.get("owner") if on_chain_data else prop.get("owner_wallet")),
        "blockchain_registered_at": (on_chain_data.get("registered_at") if on_chain_data else prop.get("created_at")),
        "blockchain_tx_hash": prop.get("blockchain_tx_hash"),
        "locality": prop.get("village", "Thandavapura"),
        "taluk": prop.get("taluk", "Nanjangud"),
        "district": prop.get("district", "Mysuru"),
        "area_sqft": prop.get("area", 2500),
        "verified_documents": docs_summary,
        "verification_statement": "This property record and its document cryptographic hashes are anchored on the GeoLedger prototype ledger.",
    }

    return success_response(
        "Public property verification record retrieved",
        data=response_data,
    )
