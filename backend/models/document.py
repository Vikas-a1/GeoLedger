from dataclasses import dataclass, asdict
from typing import Optional


@dataclass
class DocumentModel:

    application_id: Optional[str] = None
    property_id: Optional[str] = None

    document_type: str = ""

    filename: str = ""
    storage_location: str = ""

    document_hash: Optional[str] = None

    document_number: Optional[str] = None
    issuing_authority: Optional[str] = None
    issue_date: Optional[str] = None

    verification_status: str = "UNVERIFIED"

    verification_score: Optional[float] = None

    verification_checks: Optional[list] = None

    verification_notes: Optional[str] = None

    uploaded_at: Optional[object] = None
    verified_at: Optional[object] = None

    def __post_init__(self):

        if self.verification_checks is None:
            self.verification_checks = []

    def to_dict(self) -> dict:
        return asdict(self)