from flask import request

from services.auth_service import AuthService
from utils.responses import success_response


def get_auth_service():
    return AuthService()


def status():
    return success_response("GeoLedger backend is running")


def register_user():
    data = request.get_json() or {}

    user = get_auth_service().register_user(data)

    return success_response(
        "User registered successfully",
        data=user,
        status_code=201
    )