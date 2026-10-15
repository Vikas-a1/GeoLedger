from dataclasses import dataclass, asdict
from typing import Optional


@dataclass
class PropertyModel:
    survey_number: str
    property_id: Optional[str] = None
    owner_wallet: Optional[str] = None

    land_type: Optional[str] = None
    village: Optional[str] = None
    taluk: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None

    area: Optional[float] = None

    geojson_reference: Optional[str] = None
    document_ids: Optional[list] = None

    status: str = "REGISTERED"

    created_at: Optional[object] = None
    updated_at: Optional[object] = None

    def to_dict(self) -> dict:
        return asdict(self)