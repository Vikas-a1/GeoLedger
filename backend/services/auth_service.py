from datetime import datetime

from database.client import get_database
from models.user import UserModel
from utils.validation import validate_wallet_address
from utils.errors import APIError


class AuthService:
    def __init__(self):
        self.db = get_database()
        self.collection = self.db.users

    def register_user(self, data: dict) -> dict:
        wallet_address = data.get("wallet_address")
        validate_wallet_address(wallet_address)

        existing_user = self.collection.find_one({"wallet_address": wallet_address})
        if existing_user:
            raise APIError("Wallet address already registered", status_code=409)

        user_data = UserModel(
            wallet_address=wallet_address,
            created_at=datetime.utcnow(),
        ).to_dict()
        self.collection.insert_one(user_data)
        return user_data
