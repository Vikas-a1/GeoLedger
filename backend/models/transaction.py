from dataclasses import dataclass, asdict


@dataclass
class TransactionModel:
    property_id: str
    previous_owner: str
    new_owner: str
    transaction_type: str
    blockchain_tx_hash: str
    timestamp: object

    def to_dict(self) -> dict:
        return asdict(self)
