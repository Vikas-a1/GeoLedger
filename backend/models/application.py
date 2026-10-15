from dataclasses import dataclass, asdict
from typing import Optional


@dataclass
class RegistrationApplication:
    application_type: str
    applicant_wallet: str
    survey_number: str

    property_id: Optional[str] = None

    status: str = "DRAFT"

    required_documents: list = None
    submitted_documents: list = None

    government_reference: Optional[str] = None
    rejection_reason: Optional[str] = None

    verification_summary: Optional[dict] = None

    # Blockchain information
    blockchain_transaction_hash: Optional[str] = None
    blockchain_block_number: Optional[int] = None
    blockchain_status: Optional[str] = None

    created_at: object = None
    updated_at: object = None

    def __post_init__(self):
        if self.required_documents is None:
            self.required_documents = []

        if self.submitted_documents is None:
            self.submitted_documents = []

    def to_dict(self) -> dict:
        return asdict(self)