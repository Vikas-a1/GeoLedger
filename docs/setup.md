# Local setup

You need three processes: a local EVM node, the Flask API, and the Vite dev server.

## Prerequisites

- Node.js 18 or 20, with npm (blockchain) and npm or pnpm (frontend)
- Python 3.10+
- Optional: MongoDB. If it is not running, the API uses SQLite at `backend/geoledger.db`.

## 1. Smart contract (Hardhat)

```bash
cd blockchain
npm install
npx hardhat compile
npx hardhat node
```

Keep that terminal open. In a second terminal, deploy:

```bash
cd blockchain
npx hardhat run deploy-local.js --network localhost
```

The deploy script:

- prints the contract address
- copies the ABI to `backend/blockchain/GeoLedger.json`
- writes `BLOCKCHAIN_CONTRACT_ADDRESS` into `backend/.env` if that file exists
- writes `blockchain/deployed-address.json`

Use the first Hardhat account as the backend signer. Default private key for account `#0` on a stock Hardhat node:

```
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`

## 2. Backend (Flask)

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env` (see [Environment variables](#environment-variables)). Then:

```bash
python app.py
```

The API listens on `http://0.0.0.0:5000`. `GET /` should return `{ "success": true, "message": "GeoLedger backend is running" }`.

### Tests

```bash
cd backend
source venv/bin/activate
pytest tests/test_app.py
```

The full registration lifecycle test talks to the blockchain, so Hardhat must be running and `.env` must point at a deployed contract.

## 3. Frontend (Vite)

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. Optional: `frontend/.env` with `VITE_API_BASE_URL=http://127.0.0.1:5000` (this is already the default in `src/services/api.ts`).

### MetaMask

1. Install the [MetaMask](https://metamask.io/download/) browser extension.
2. Click **Connect MetaMask** on `/login`. Approve the account request.
3. Approve adding **Hardhat Localhost** (chain id `31337`, RPC `http://127.0.0.1:8545`) when prompted.
4. For local ETH, import Hardhat account `#0` (private key above) into MetaMask. Never use that key on a public network.

If the extension is missing, the login button opens the MetaMask download page instead of faking a session.

## Environment variables

### `backend/.env`

| Variable | Default | Purpose |
|---|---|---|
| `DEBUG` | `False` | Include exception details in 500 responses when true |
| `SECRET_KEY` | `change-me` | Flask secret |
| `MONGO_URI` | `mongodb://localhost:27017` | Mongo connection. On failure the API uses SQLite |
| `DATABASE_NAME` | `geoledger` | Mongo database name |
| `UPLOAD_FOLDER` | `uploads` | Document storage directory |
| `MAX_CONTENT_LENGTH` | `16777216` | Upload cap (16 MB) |
| `BLOCKCHAIN_RPC_URL` | `http://127.0.0.1:8545` | EVM JSON-RPC |
| `BLOCKCHAIN_CONTRACT_ADDRESS` | _(required for chain calls)_ | Deployed `GeoLedger` address |
| `BLOCKCHAIN_PRIVATE_KEY` | _(required for chain writes)_ | Registrar key used by the backend |

Example:

```
DEBUG=true
SECRET_KEY=dev-secret
MONGO_URI=mongodb://localhost:27017
DATABASE_NAME=geoledger
UPLOAD_FOLDER=uploads
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
BLOCKCHAIN_CONTRACT_ADDRESS=0xe7f1725e7734ce288f8367e1bb143e90bb3f0512
BLOCKCHAIN_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### `frontend/.env`

| Variable | Default | Purpose |
|---|---|---|
| `VITE_API_BASE_URL` | `http://127.0.0.1:5000` | Flask origin |
| `VITE_CHAIN_ID` | `31337` | Network MetaMask should use |
| `VITE_CHAIN_NAME` | `Hardhat Localhost` | Label shown when adding the chain |
| `VITE_RPC_URL` | `http://127.0.0.1:8545` | RPC URL added to MetaMask |

## Allowed upload types

`pdf`, `png`, `jpg`, `jpeg`, `doc`, `docx`, `txt` (`Config.ALLOWED_DOCUMENT_EXTENSIONS`).

## Common issues

| Symptom | Likely cause |
|---|---|
| `Unable to connect to blockchain` (503) | Hardhat node is not running, or `BLOCKCHAIN_RPC_URL` is wrong |
| `Blockchain contract address is not configured` (500) | Missing `BLOCKCHAIN_CONTRACT_ADDRESS` |
| `GeoLedger contract artifact not found` (500) | Deploy (or copy ABI) so `backend/blockchain/GeoLedger.json` exists |
| Empty map / GIS 200 with `"status": "generated"` | Survey number is not in `demo_parcels.json`; a synthetic parcel was returned |
| Frontend lists empty while the API has data | `VITE_API_BASE_URL` does not match the Flask host/port |
| Mongo ignored, `geoledger.db` created | Mongo ping failed; SQLite fallback is working as designed |
