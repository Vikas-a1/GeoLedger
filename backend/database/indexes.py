def create_indexes(db):

    # Users
    db.users.create_index(
        "wallet_address",
        unique=True
    )

    # Properties
    db.properties.create_index(
        "survey_number",
        unique=True
    )

    db.properties.create_index(
        "owner_wallet"
    )

    # Applications
    db.applications.create_index(
        "applicant_wallet"
    )

    db.applications.create_index(
        "survey_number"
    )

    db.applications.create_index(
        "status"
    )

    # Documents
    db.documents.create_index(
        "property_id"
    )

    db.documents.create_index(
        "application_id"
    )

    # Transactions
    db.transactions.create_index(
        "property_id"
    )

    db.transactions.create_index(
        "timestamp"
    )