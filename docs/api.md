# REST API

Base URL: `http://127.0.0.1:5000`

JSON responses (except document download) use this envelope:

```json
{
  "success": true,
  "message": "…",
  "data": {}
}
```

Errors:

```json
{
  "success": false,
  "message": "…",
  "details": "only present when DEBUG=true on unhandled 500s"
}
```

`APIError` from services becomes a JSON error with the given status code. Unknown routes return 404 `"Endpoint not found"`.

---

## Health

### `GET /`

Confirms the API process is up.

**Response `data`:** none. Message is `"GeoLedger backend is running"`.

---

## Auth

Wallet addresses must match `^0x[a-fA-F0-9]{40}$`. There is no login, session, or JWT.

### `POST /auth/register`

| Field | Type | Required |
|---|---|---|
| `wallet_address` | string | yes |

**201** — user stored. **409** — wallet already registered.

---

## Properties

Property IDs used in `PUT`/`DELETE` are Mongo/SQLite document `_id` values. Lookups by cadastral identifier use survey number.

### `GET /properties`

List all properties, newest first.

### `GET /properties/<survey_number>`

Single parcel by survey number. **404** if missing.

### `POST /properties`

Create a property **only** from an application whose status is `APPROVED`.

| Field | Type | Required |
|---|---|---|
| `application_id` | string | yes |
| `survey_number` | string | yes |
| `owner_wallet` | string | yes |
| `land_type` | string | no |
| `village`, `taluk`, `district`, `state` | string | no |
| `area` | number | no |
| `geojson_reference` | string | no |
| `document_ids` | string[] | no |

**400** missing fields. **409** application not approved, survey mismatch, or duplicate survey. Note: the approve flow in `ApplicationService.verify_and_approve` already inserts the property when it registers on-chain, so this endpoint is a legacy/manual path.

### `PUT /properties/<property_id>`

Partial update. `property_id` must be a valid ObjectId-shaped id.

### `DELETE /properties/<property_id>`

Deletes the off-chain record. Does not reverse the on-chain registration.

---

## Applications

URL prefix: `/applications`.

### `POST /applications`

Opens a cadastral application. Status starts at `SUBMITTED`.

| Field | Type | Required |
|---|---|---|
| `application_type` | string | yes |
| `applicant_wallet` or `wallet_address` | string | yes |
| `survey_number` | string | yes |
| `property_id` | string | no (defaults to survey number) |
| `applicant_name`, `applicant_email`, `applicant_phone` | string | no |
| `buyer_wallet`, `seller_wallet` | string | no |
| `party_details` | object | no |

`application_type` aliases:

| Sent | Stored |
|---|---|
| `NEW_REGISTRATION` / `REGISTRATION` | `NEW_REGISTRATION` |
| `OWNERSHIP_TRANSFER` / `TRANSFER` | `OWNERSHIP_TRANSFER` |
| `INHERITANCE_TRANSFER` / `INHERITANCE` | `INHERITANCE_TRANSFER` |

**409** if an active (not `REJECTED`/`COMPLETED`) application already exists for the same survey + type.

The service fills `required_documents` from [document requirements](./data-model.md#document-requirements).

### `GET /applications`

Lists applications, newest first. The service supports `applicant_wallet` and `status` filters, but the current route does not read query parameters, so the API always returns the full list.

### `GET /applications/<application_id>`

### `PUT /applications/<application_id>/status`

| Field | Type | Required |
|---|---|---|
| `status` | string | yes (must be a known application status) |
| `rejection_reason` | string | no |
| `verification_summary` | object | no |

### `POST /applications/<application_id>/approve`

Reviewer action. Checks required documents are present and `VERIFIED`, then:

1. Sets status `BLOCKCHAIN_PENDING`
2. Calls `registerProperty` or `transferOwnership` on-chain (keyed by survey number)
3. Upserts the property and writes a `transactions` row
4. Sets status `COMPLETED`

**409** missing or unverified documents. **502** chain call failed (`BLOCKCHAIN_FAILED`).

---

## Documents

Allowed extensions: `pdf`, `png`, `jpg`, `jpeg`, `doc`, `docx`, `txt`. Max size: `MAX_CONTENT_LENGTH` (16 MB default).

### `POST /documents/upload`

`multipart/form-data`

| Field | Type | Required |
|---|---|---|
| `file` | file | yes |
| `document_type` | string | yes |
| `application_id` | string | one of `application_id` / `property_id` |
| `property_id` | string | one of `application_id` / `property_id` |

Stores the file, computes SHA-256, sets `verification_status` to `PENDING`, and if `application_id` is set, appends the document id and moves the application to `UNDER_REVIEW`.

**201** with serialized document (`id`, `document_id`, `document_hash`, …).

### `GET /documents/application/<application_id>`

### `GET /documents/property/<property_id>`

### `GET /documents/download/<document_id>`

Raw file download (`Content-Disposition: attachment`). Not JSON.

### `DELETE /documents/<document_id>`

Removes the database row and the file on disk.

---

## Verification

### `POST /verification/document/<document_id>`

Integrity check: re-hash the stored file and compare to `document_hash`. Updates status to `VERIFIED` or `REJECTED`.

If the JSON body includes `status`, this endpoint behaves like review instead (`VERIFIED` or `REJECTED` with remarks).

### `POST /verification/document/<document_id>/review`

| Field | Type | Required |
|---|---|---|
| `status` | string | no (default `VERIFIED`) |
| `remarks` | string | no |

Allowed status values: `VERIFIED`, `REJECTED`. After review, the linked application may move to `VERIFIED`, `UNDER_REVIEW`, or `DOCUMENTS_PENDING`.

---

## Ownership

### `POST /ownership/transfer`

Creates an `OWNERSHIP_TRANSFER` application for an existing property. Does **not** execute the chain transfer; that happens on approve.

| Field | Type | Required |
|---|---|---|
| `property_id` or `survey_number` | string | one required |
| `buyer_wallet` or `new_owner` | string | yes |
| `seller_wallet` / `current_owner` / `applicant_wallet` | string | no (defaults to current owner) |
| `seller_name`, `seller_email`, `seller_phone`, `seller_gov_id` | string | no |
| `buyer_name`, `buyer_email`, `buyer_phone`, `buyer_gov_id` | string | no |

**404** property not found. **201** application payload.

### `GET /ownership/history/<property_id>`

Transactions for that `property_id` or `survey_number`. Pass `ALL` to list every transaction.

---

## GIS

### `GET /gis/property/<survey_number>`

```json
{
  "survey_number": "SN-DEMO-001",
  "status": "found",
  "geojson": { "type": "Feature", "properties": {}, "geometry": {} }
}
```

`status` is `"found"` for parcels in `backend/geojson/demo_parcels.json`, or `"generated"` for a synthesized Mysuru-area rectangle.

Demo survey numbers in the bundled GeoJSON: `SN-DEMO-001`, `SN-2023-4521`.

---

## Blockchain bridge

These talk to `GeoLedger.sol` through the backend signer. They require `BLOCKCHAIN_CONTRACT_ADDRESS`, `BLOCKCHAIN_PRIVATE_KEY`, and a reachable RPC.

### `POST /blockchain/register`

| Field | Required |
|---|---|
| `property_id` | yes |
| `wallet_address` | yes |

**201** `{ property_id, wallet_address, transaction_hash, block_number, status: "confirmed" }`

### `GET /blockchain/property/<property_id>`

On-chain tuple: `{ property_id, owner, registered_at, exists }`.

### `POST /blockchain/transfer`

| Field | Required |
|---|---|
| `property_id` | yes |
| `new_owner` | yes |

### `GET /blockchain/transactions`

Off-chain transaction log (`OwnershipService.get_ownership_history("ALL")`), not a raw RPC event scan.

---

## Public verification

### `GET /verify/property/<identifier>`

Looks up a property by `survey_number`, `property_id`, or `_id`. Returns cadastral fields, the on-chain owner when the node is reachable (otherwise cached `owner_wallet`), document hashes, and `blockchain_tx_hash`.

**404** if the parcel is not in the registry.
