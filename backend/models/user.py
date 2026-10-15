from dataclasses import dataclass, asdict


@dataclass
class UserModel:
    wallet_address: str
    created_at: object

    def to_dict(self) -> dict:
        return asdict(self)
