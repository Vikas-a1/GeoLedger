# Frontend

Vite + React 19 + TypeScript. Entry: `frontend/src/main.tsx` → `frontend/src/App.tsx` → `frontend/src/app/App.tsx`.

Dev server: `npm run dev` (port 5173). API base: `import.meta.env.VITE_API_BASE_URL` or `http://127.0.0.1:5000` (`src/services/api.ts`).

## Routes

| Path | Screen | Notes |
|---|---|---|
| `/` | `Landing` | Public marketing page |
| `/login` | `Login` | Real MetaMask connect (`eth_requestAccounts`) → `/dashboard` |
| `/dashboard` | `Dashboard` | Counts from properties, applications, transactions |
| `/properties` | `MyProperties` | Owner inventory |
| `/properties/:propertyId` | `PropertyDetails` | Parcel + GIS |
| `/property/details` | `PropertyDetails` | Alternate path |
| `/search` | `PropertySearch` | Search + map |
| `/map` | `PropertySearch` | Same screen |
| `/applications` | `Applications` | Application list |
| `/applications/:applicationId` | `ApplicationDetails` | Status, docs, approve |
| `/applications/new` | `PropertyRegistration` | 4-step wizard |
| `/register` | redirect | → `/applications/new` |
| `/transfer` | `PropertyTransfer` | Ownership transfer form |
| `/verify` | `DocumentVerification` | Local SHA-256 + demo public verify |
| `/transactions` | `Transactions` | Ledger activity |
| `/notifications` | `Notifications` | |
| `/profile` | `Profile` | |
| `*` | redirect | → `/` |

`/` and `/login` are public. Every other route is wrapped in `RequireWallet` and redirects to `/login` until MetaMask is connected.

Authenticated chrome (`Layout`) is a desktop sidebar plus `MobileNav` below `lg`. Brand color is teal `#0F766E` on slate `#0F172A`.

## MetaMask

`WalletProvider` (`src/app/context/WalletContext.tsx`) owns the session:

1. `eth_requestAccounts` via the MetaMask provider (prefers `isMetaMask` when several wallets are injected)
2. `wallet_switchEthereumChain` / `wallet_addEthereumChain` for Hardhat Localhost (`31337`, `http://127.0.0.1:8545`)
3. `POST /auth/register` with the address (409 already-registered is ignored)
4. Restore on reload with `eth_accounts` if `localStorage` has `geoledger.wallet.connected`
5. Listen for `accountsChanged` and `chainChanged`

Registration and transfer forms use that address as `applicant_wallet` / `seller_wallet`. The sidebar and profile show the live account, network, and ETH balance. Disconnect clears the session and calls `wallet_revokePermissions` when MetaMask supports it.

## Registration wizard

`PropertyRegistration` steps:

1. Property details (survey, location, area, land type)
2. Owner information (name, wallet)
3. Document upload
4. Review and submit → `POST /applications`

## API client (`src/services/api.ts`)

Axios instance. Successful payloads unwrap `res.data.data`.

| Namespace | Methods |
|---|---|
| `api.properties` | `list`, `getBySurvey`, `create` |
| `api.applications` | `list`, `get`, `create`, `updateStatus`, `approve` |
| `api.documents` | `upload`, `getByApp`, `getByProperty`, `delete`, `getDownloadUrl` |
| `api.verification` | `verify`, `review` |
| `api.ownership` | `submitTransfer` / `transfer`, `getHistory` |
| `api.gis` | `getBySurvey` |
| `api.blockchain` | `getProperty`, `register`, `transfer`, `getTransactions` |
| `api.publicVerify` | `verifyProperty` |

## GIS map

Property search and details call `/gis/property/:surveyNumber` and render the returned GeoJSON `Polygon` with Leaflet. Demo parcels sit around Thandavapura (Mysuru). Unknown surveys still render because the API synthesizes a rectangle.

## Document hashing in the browser

`DocumentVerification` uses `crypto.subtle.digest("SHA-256")` on a user-selected file, then calls `GET /verify/property/SN-DEMO-001` as a demo of public records. Treat that screen as a UI prototype of hash verification, not a full client-side match against every stored hash.

## UI kit

`frontend/src/app/components/ui/` is a shadcn/Radix-style set (button, card, dialog, sidebar, …). Styling is Tailwind v4 via `@tailwindcss/vite` (`frontend/vite.config.ts`). Path alias: `@` → `./src`.

## Duplicate source tree

`frontend/src/components/` contains an older parallel copy of screens and UI primitives. The running app uses `frontend/src/app/`. Prefer editing `src/app/` unless you intend to delete the duplicate.

## Scripts

```bash
cd frontend
npm run dev       # Vite
npm run build     # tsc -b && vite build
npm run lint      # ESLint
npm run preview   # preview production build
```
