import json
import os

from pathlib import Path
from dotenv import load_dotenv
from web3 import Web3

from utils.errors import APIError

env_path = Path(__file__).resolve().parent.parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path, override=True)
else:
    load_dotenv()


class BlockchainService:

    def __init__(self):
        self.rpc_url = os.getenv(
            "BLOCKCHAIN_RPC_URL",
            "http://127.0.0.1:8545"
        )

        self.contract_address = os.getenv(
            "BLOCKCHAIN_CONTRACT_ADDRESS"
        )

        self.private_key = os.getenv(
            "BLOCKCHAIN_PRIVATE_KEY"
        )

        if not self.contract_address:
            raise APIError(
                "Blockchain contract address is not configured",
                status_code=500
            )

        if not self.private_key:
            raise APIError(
                "Blockchain private key is not configured",
                status_code=500
            )

        # Connect to blockchain
        self.web3 = Web3(
            Web3.HTTPProvider(self.rpc_url)
        )

        if not self.web3.is_connected():
            raise APIError(
                "Unable to connect to blockchain",
                status_code=503
            )

        # Load contract ABI
        artifact_path = os.path.join(
            os.path.dirname(__file__),
            "..",
            "blockchain",
            "GeoLedger.json"
        )

        try:
            with open(
                artifact_path,
                "r",
                encoding="utf-8"
            ) as file:
                artifact = json.load(file)

        except FileNotFoundError:
            raise APIError(
                "GeoLedger contract artifact not found",
                status_code=500
            )

        # Create contract instance
        self.contract = self.web3.eth.contract(
            address=Web3.to_checksum_address(
                self.contract_address
            ),
            abi=artifact["abi"]
        )

        # Blockchain account used by backend
        self.account = self.web3.eth.account.from_key(
            self.private_key
        )

    # ---------------------------------------------------------
    # REGISTER PROPERTY
    # ---------------------------------------------------------

    def register_property(
        self,
        property_id: str,
        wallet_address: str
    ) -> dict:

        try:
            wallet_address = Web3.to_checksum_address(
                wallet_address
            )

            transaction = (
                self.contract
                .functions
                .registerProperty(
                    property_id,
                    wallet_address
                )
                .build_transaction({
                    "from": self.account.address,
                    "nonce": self.web3.eth.get_transaction_count(
                        self.account.address
                    ),
                    "gas": 300000,
                    "gasPrice": self.web3.eth.gas_price,
                })
            )

            signed_transaction = (
                self.web3.eth.account.sign_transaction(
                    transaction,
                    self.private_key
                )
            )

            tx_hash = self.web3.eth.send_raw_transaction(
                signed_transaction.raw_transaction
            )

            receipt = self.web3.eth.wait_for_transaction_receipt(
                tx_hash
            )

            return {
                "property_id": property_id,
                "wallet_address": wallet_address,
                "transaction_hash": tx_hash.hex(),
                "block_number": receipt["blockNumber"],
                "status": "confirmed",
            }

        except Exception as exc:
            raise APIError(
                f"Blockchain registration failed: {str(exc)}",
                status_code=502
            )

    # ---------------------------------------------------------
    # CHECK WHETHER PROPERTY EXISTS
    # ---------------------------------------------------------

    def property_exists(
        self,
        property_id: str
    ) -> bool:

        try:
            result = (
                self.contract
                .functions
                .getProperty(property_id)
                .call()
            )

            return result[3]

        except Exception as exc:
            raise APIError(
                f"Blockchain lookup failed: {str(exc)}",
                status_code=502
            )

    # ---------------------------------------------------------
    # GET PROPERTY
    # ---------------------------------------------------------

    def get_property(
        self,
        property_id: str
    ) -> dict:

        try:
            result = (
                self.contract
                .functions
                .getProperty(property_id)
                .call()
            )

            return {
                "property_id": result[0],
                "owner": result[1],
                "registered_at": result[2],
                "exists": result[3],
            }

        except Exception as exc:
            raise APIError(
                f"Blockchain lookup failed: {str(exc)}",
                status_code=502
            )

    # ---------------------------------------------------------
    # TRANSFER PROPERTY
    # ---------------------------------------------------------

    def transfer_property(
        self,
        property_id: str,
        new_owner: str
    ) -> dict:

        try:
            new_owner = Web3.to_checksum_address(
                new_owner
            )

            transaction = (
                self.contract
                .functions
                .transferOwnership(
                    property_id,
                    new_owner
                )
                .build_transaction({
                    "from": self.account.address,
                    "nonce": self.web3.eth.get_transaction_count(
                        self.account.address
                    ),
                    "gas": 300000,
                    "gasPrice": self.web3.eth.gas_price,
                })
            )

            signed_transaction = (
                self.web3.eth.account.sign_transaction(
                    transaction,
                    self.private_key
                )
            )

            tx_hash = self.web3.eth.send_raw_transaction(
                signed_transaction.raw_transaction
            )

            receipt = self.web3.eth.wait_for_transaction_receipt(
                tx_hash
            )

            return {
                "property_id": property_id,
                "new_owner": new_owner,
                "transaction_hash": tx_hash.hex(),
                "block_number": receipt["blockNumber"],
                "status": "confirmed",
            }

        except Exception as exc:
            raise APIError(
                f"Blockchain transfer failed: {str(exc)}",
                status_code=502
            )