# Workflows

These are the paths the prototype implements end to end.

## New registration

```
Applicant                  API                         Chain
   │                       │                            │
   │ POST /applications    │                            │
   │ type=NEW_REGISTRATION │  status = SUBMITTED        │
   │                       │  required_documents set    │
   │                       │                            │
   │ POST /documents/upload│  SHA-256, PENDING          │
   │  (each required type) │  status → UNDER_REVIEW     │
   │                       │                            │
   │                       │  reviewer:                 │
   │                       │  POST …/review VERIFIED    │
   │                       │  all required verified     │
   │                       │  status → VERIFIED         │
   │                       │                            │
   │ POST …/approve        │  BLOCKCHAIN_PENDING        │
   │                       │  registerProperty(survey) ─┼─► PropertyRegistered
   │                       │  insert properties row     │
   │                       │  insert transactions row   │
   │                       │  status → COMPLETED        │
```

Required files for `NEW_REGISTRATION`: `SALE_DEED`, `ID_PROOF`, `MUTATION_CERTIFICATE`.

Approve will not run the chain call until every required type is uploaded **and** `verification_status == VERIFIED`. Missing types set `DOCUMENTS_PENDING` (409). Unverified types set `UNDER_REVIEW` (409). A failed RPC/tx sets `BLOCKCHAIN_FAILED` (502).

On success the property id is `GL-PROP-<survey_number>`, documents are linked to that id, and the applicant wallet becomes `owner_wallet`.

## Ownership transfer

```
Seller                     API                         Chain
   │ POST /ownership/transfer                           │
   │  survey + buyer_wallet│  OWNERSHIP_TRANSFER app    │
   │                       │                            │
   │ upload required docs  │  same review path as above │
   │ POST …/approve        │  transferOwnership(survey)─┼─► OwnershipTransferred
   │                       │  properties.owner_wallet   │
   │                       │    = buyer wallet          │
```

Required files: `SALE_DEED`, `SELLER_ID_PROOF`, `BUYER_ID_PROOF`, `MUTATION_CERTIFICATE`.

The new owner is `party_details.buyer.wallet_address`, falling back to `applicant_wallet`. The chain call is signed by the backend registrar key, which the contract allows because `msg.sender == registrar`.

## Inheritance transfer

Same application machinery as registration, with a larger document set (`DEATH_CERTIFICATE`, `LEGAL_HEIR_CERTIFICATE`, `FAMILY_TREE`, `NOC_FROM_LEGAL_HEIRS`, `MUTATION_CERTIFICATE`, `NEW_OWNER_ID_PROOF`). Approve uses the **register** path unless the stored type is `OWNERSHIP_TRANSFER` / `TRANSFER`, so inheritance currently registers (or fails if the survey is already on-chain) rather than transferring.

## Document integrity

1. Upload stores `document_hash = sha256(file_bytes)`.
2. `POST /verification/document/<id>` re-reads the file and compares hashes.
3. `POST /verification/document/<id>/review` is the human reviewer decision.

The public verify endpoint lists those hashes next to the parcel so a third party can see what was anchored off-chain. The frontend verify screen also hashes a local file with `crypto.subtle.digest("SHA-256")`; matching against stored hashes is only partially wired (it currently loads `SN-DEMO-001` as a demo lookup).

## Public lookup

`GET /verify/property/<survey_or_property_id>` is unauthenticated. It joins:

- off-chain cadastral fields
- `BlockchainService.get_property(survey_number)` when RPC works
- document type + hash + verification status

Use this as the “does this title exist and who owns it?” check.

## Status machine

Application statuses (`utils/constants.py`):

```
DRAFT
SUBMITTED ──► UNDER_REVIEW ──► DOCUMENTS_PENDING
                 │
                 ▼
         UNDER_VERIFICATION
                 │
                 ▼
              VERIFIED ──► APPROVED ──► BLOCKCHAIN_PENDING ──► COMPLETED
                 │                                              │
                 └──────── REJECTED                    BLOCKCHAIN_FAILED
```

What the code actually sets (not every constant is used):

| Event | Status |
|---|---|
| `create_application` | `SUBMITTED` |
| First document linked | `UNDER_REVIEW` (unless already `VERIFIED`/`APPROVED`/`COMPLETED`) |
| Reviewer: missing required types | `DOCUMENTS_PENDING` |
| Reviewer: some rejected or not all verified | `UNDER_REVIEW` |
| All required types `VERIFIED` | `VERIFIED` |
| Approve starts | `BLOCKCHAIN_PENDING` |
| Chain success | `COMPLETED` |
| Chain failure | `BLOCKCHAIN_FAILED` |
| `reject_application` | `REJECTED` |

Property statuses: `REGISTERED`, `PENDING_TRANSFER`, `TRANSFERRED`, `UNDER_DISPUTE`. New parcels are inserted as `REGISTERED`. Transfer approve currently updates `owner_wallet` but does not flip the property status to `TRANSFERRED`.
