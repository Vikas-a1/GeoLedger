from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

from config import Config
from database.client import init_db, close_db
from routes import register_blueprints
from utils.errors import APIError
from utils.responses import error_response


def create_app(testing=False):

    load_dotenv()

    app = Flask(__name__)

    app.config.from_object(Config)

    if testing:
        app.config["TESTING"] = True

    CORS(app)

    # Initialize database
    init_db(app)

    # Register API routes
    register_blueprints(app)

    @app.errorhandler(APIError)
    def handle_api_error(error):
        return error_response(
            error.message,
            status_code=error.status_code
        )

    @app.errorhandler(404)
    def handle_not_found(_error):
        return error_response(
            "Endpoint not found",
            status_code=404
        )

    @app.errorhandler(Exception)
    def handle_unexpected_error(error):

        if app.config.get("DEBUG"):
            details = str(error)
        else:
            details = None

        return error_response(
            "An unexpected error occurred",
            status_code=500,
            details=details
        )

    return app


if __name__ == "__main__":

    application = create_app()

    try:
        application.run(
            host="0.0.0.0",
            port=5000,
            debug=application.config["DEBUG"]
        )
    finally:
        close_db()