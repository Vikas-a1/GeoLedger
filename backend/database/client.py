import os
from flask import current_app
from database.sqlite_store import SQLiteDatabase
from database.seed_data import seed_demo_data

_db_instance = None
_db_type = "none"


def init_db(app):
    global _db_instance, _db_type

    mongo_uri = app.config.get("MONGO_URI")
    db_name = app.config.get("DATABASE_NAME", "geoledger")

    # 1. Attempt MongoDB connection if configured
    if mongo_uri and ("localhost" in mongo_uri or "mongodb+srv" in mongo_uri or "mongodb://" in mongo_uri):
        try:
            from pymongo import MongoClient
            from database.indexes import create_indexes

            client = MongoClient(mongo_uri, serverSelectionTimeoutMS=2000)
            client.admin.command("ping")
            app.db = client[db_name]
            _db_instance = app.db
            _db_type = "mongodb"
            create_indexes(app.db)
            seed_demo_data(app.db)
            print("MongoDB connected successfully.")
            return
        except Exception as e:
            print(f"MongoDB connection failed: {e}")
            print("Falling back to local SQLite storage (geoledger.db)...")

    # 2. SQLite Fallback
    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    sqlite_path = os.path.join(backend_dir, "geoledger.db")
    app.db = SQLiteDatabase(sqlite_path)
    _db_instance = app.db
    _db_type = "sqlite"
    seed_demo_data(app.db)
    print(f"SQLite database initialized at: {sqlite_path}")


def get_database():
    global _db_instance
    try:
        if current_app and hasattr(current_app, "db") and current_app.db is not None:
            return current_app.db
    except RuntimeError:
        pass

    if _db_instance is not None:
        return _db_instance

    backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    sqlite_path = os.path.join(backend_dir, "geoledger.db")
    _db_instance = SQLiteDatabase(sqlite_path)
    return _db_instance


def get_database_type():
    global _db_type
    return _db_type


def close_db():
    global _db_instance
    _db_instance = None
