import os
import sys
import io
import time
from pathlib import Path

# Ensure backend root is always in Python module search path
backend_dir = str(Path(__file__).resolve().parent.parent)
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

import pytest
from app import create_app
from database.client import get_database


@pytest.fixture
def client():
    os.environ["DEBUG"] = "False"
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def test_status_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    payload = response.get_json()
    assert payload["success"] is True
    assert "GeoLedger backend is running" in payload["message"]


def test_property_routes_return_json(client):
    response = client.get("/properties")
    assert response.status_code == 200
    assert response.is_json


def test_gis_lookup_endpoint(client):
    response = client.get("/gis/property/SN-DEMO-001")
    assert response.status_code == 200
    data = response.get_json()["data"]
    geojson = data.get("geojson")
    assert geojson is not None
    assert geojson["type"] == "Feature"
    assert geojson["geometry"]["type"] == "Polygon"


def test_full_registration_lifecycle(client):
    survey_num = f"SN-TEST-{int(time.time())}"
    applicant_wallet = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"

    # 1. Create application
    res = client.post("/applications", json={
        "application_type": "NEW_REGISTRATION",
        "survey_number": survey_num,
        "applicant_wallet": applicant_wallet,
        "applicant_name": "Automated Test User",
    })
    assert res.status_code == 201
    app_id = res.get_json()["data"]["id"]

    # 2. Upload documents
    req_docs = res.get_json()["data"]["required_documents"]
    doc_ids = []
    for doc_type in req_docs:
        up_res = client.post("/documents/upload", data={
            "document_type": doc_type,
            "application_id": app_id,
            "survey_number": survey_num,
            "file": (io.BytesIO(b"Simulated document bytes"), f"{doc_type}.pdf")
        }, content_type="multipart/form-data")
        assert up_res.status_code == 201
        doc_ids.append(up_res.get_json()["data"]["id"])

    # 3. Verify documents
    for doc_id in doc_ids:
        v_res = client.post(f"/verification/document/{doc_id}/review", json={
            "status": "VERIFIED",
            "remarks": "Reviewed in automated test"
        })
        assert v_res.status_code == 200

    # 4. Reviewer approves application -> On-chain transaction executed
    approve_res = client.post(f"/applications/{app_id}/approve")
    assert approve_res.status_code == 200
    approved_data = approve_res.get_json()["data"]
    assert approved_data["status"] == "COMPLETED"
    assert approved_data["blockchain_transaction_hash"] is not None
    assert approved_data["blockchain_block_number"] is not None

    # 5. Public verification endpoint confirms on-chain ownership & document hashes
    pub_res = client.get(f"/verify/property/{survey_num}")
    assert pub_res.status_code == 200
    pub_data = pub_res.get_json()["data"]
    assert pub_data["blockchain_owner_wallet"].lower() == applicant_wallet.lower()
    assert len(pub_data["verified_documents"]) == len(req_docs)


def test_blockchain_transactions_endpoint(client):
    res = client.get("/blockchain/transactions")
    assert res.status_code == 200
    json_data = res.get_json()
    assert json_data["success"] is True
    assert isinstance(json_data["data"], list)
    assert len(json_data["data"]) >= 1
    # Verify transaction record structure
    first_tx = json_data["data"][0]
    assert "tx_hash" in first_tx or "blockchain_tx_hash" in first_tx
    assert "status" in first_tx
