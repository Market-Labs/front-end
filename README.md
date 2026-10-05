# MarketGo Frontend

MarketGo Frontend is the Vue 3 single-page application for the MarketGo organic product management platform. It provides the web experience for IAM, profiles, dashboard, analytics, inventory, products, supply requests, shipping orders, suppliers, conservation monitoring, alerts and communication.

The application follows a DDD-oriented structure by bounded context. Each feature keeps its own `application`, `domain`, `infrastructure` and `presentation` layers. Shared HTTP behavior, layout, routing helpers, reusable UI and endpoint configuration are centralized in the `shared` context.

## Architecture

- `iam`: identity and access management, sign-in, sign-up, session, users, roles and permissions.
- `profiles`: minimarket and supplier profile lookup and update workflow.
- `dashboard`: role-based dashboard with inventory, supply requests, shipping orders, alerts and activity indicators.
- `analytics`: aggregate operational indicators, analytics and report generation.
- `inventory`: product inventory, lots, expiration tracking, stock updates, waste and sale management.
- `products`: organic product catalog with product data, expiration date, quantity, name, price and availability.
- `requisition`: supply request list, creation flow, supplier acceptance/rejection and conversion into shipping orders.
- `procurements`: supplier-facing shipping order creation, visualization, filtering, reception acceptance/rejection and status tracking.
- `suppliers`: supplier directory and supplier profile management.
- `conservation`: temperature and humidity monitoring for organic product conservation.
- `communication`: messages, system notifications, alert center and read/starred state transitions.
- `shared`: layout, reusable UI, route shell, HTTP client infrastructure, endpoint configuration and shared helpers.

## Layer Responsibilities

| Layer | Responsibility |
| --- | --- |
| `presentation` | Vue views, route modules and screen-level interaction handlers. |
| `application` | Pinia stores that coordinate UI use cases and state transitions. |
| `domain/model` | Frontend domain entities used to represent MarketGo business concepts. |
| `infrastructure` | API adapters, assemblers and HTTP integration logic. |
| `shared` | Cross-context infrastructure and shared presentation building blocks. |

Vue Single File Components keep `template`, `script setup` and `style scoped` in one `.vue` file. A view should be split into child components only when a table, dialog, form or repeated UI block has an independent responsibility or is reused by more than one screen.

## Main Business Flow

```text
Minimarket Administrator
        ↓
Creates Supply Request
        ↓
Supplier
        ↓
Reviews Supply Request
        ↓
Accepts / Rejects
        ↓
If Accepted
        ↓
Supplier Creates Shipping Order
        ↓
Minimarket Administrator
        ↓
Reviews Shipping Order
        ↓
Accepts / Rejects
        ↓
If Accepted
        ↓
Inventory is Updated
```

## Role-Based Behavior

The application uses the same general dashboard and layout for both roles. Available information and actions change according to the authenticated user's role.

| Role | Main actions |
| --- | --- |
| `Administrador de Minimarket` | Manage inventory, create supply requests, review shipping orders, accept/reject reception and update inventory. |
| `Proveedor Organico` | Review received supply requests, accept/reject them, create shipping orders and manage supplier-facing information. |

## API Integration

The frontend consumes MarketGo API routes through bounded-context adapters and shared endpoint configuration.

The Azure Static Web Apps workflow builds with `VITE_DATA_SOURCE=firebase`, using Firebase Authentication and Firestore. For the writable local fake API, run `npm run dev:mock` with neither `VITE_DEMO_MODE` nor `VITE_DATA_SOURCE` set.

## Firebase Pilot

The Firebase adapter is opt-in with `VITE_DATA_SOURCE=firebase`. It uses Firebase Authentication for sign-in and Cloud Firestore for app data. The web config in `src/shared/infrastructure/firebase-client.js` is a public client identifier, not an administrator credential. Do not put service-account keys or account passwords in Vite variables or in the repository.

1. In Firebase Console, enable **Authentication > Sign-in method > Email/Password**. Under **Authentication > Users > Add user**, create `administrador@marketgo.com` and `proveedor@marketgo.com` with private passwords. Never commit those passwords.
2. Deploy `firestore.rules` to project `marketgo-d9c75` with the Firebase CLI: `npx firebase-tools login`, then `npx firebase-tools deploy --only firestore:rules --project marketgo-d9c75`. Review the rules before using real customer data.
3. Authenticate the Firebase Admin SDK locally with Google Application Default Credentials (`gcloud auth application-default login`) using a project account authorized to write Firestore and read Firebase Auth users. Set `GOOGLE_CLOUD_PROJECT=marketgo-d9c75` in the shell, then run `npm run seed:firestore -- --apply`. A plain `npm run seed:firestore` is a no-write dry run; `--check` verifies the two Auth accounts without writing. The importer also accepts a temporary `MARKETGO_FIREBASE_ACCESS_TOKEN` from an authorized Firebase CLI session instead of ADC. Do not save this token in the repository or a Vite variable. It creates documents only when absent and never imports `authAccounts` or plaintext passwords from `server/db.json`.
4. Start Vite with `VITE_DATA_SOURCE=firebase` and without `VITE_DEMO_MODE`. Sign in as both roles and verify product lists, requests, shipping orders, inventory, and reports. In PowerShell: `$env:VITE_DATA_SOURCE='firebase'; Remove-Item Env:VITE_DEMO_MODE -ErrorAction SilentlyContinue; npm run dev`.
5. The Azure workflow already sets `VITE_DATA_SOURCE: 'firebase'`; a push to `main` deploys the Firebase-backed build through Azure Static Web Apps.

In Firebase mode, users with `users:manage` can create accounts for their own minimarket or supplier. The app creates the Firebase Authentication account in a secondary client session, then its scoped Firestore profile; it removes the new Auth account if profile creation fails. Existing accounts can be deactivated, but the two original organization accounts are protected. This client-only provisioning is suitable for a course pilot; a production service should move account creation to a trusted backend.

`VITE_API_BASE_URL` must point to the API host root:

```env
VITE_API_BASE_URL=http://localhost:3000/
```

Frontend route fragments such as `api/v1/products` or `api/v1/auth/sign-in` are owned by:

```text
src/shared/infrastructure/api-endpoints.js
```

Bounded-context adapters should call those centralized endpoints instead of hard-coding `/api/v1/...` paths inside views or stores.

## Frontend Contract Coverage

| Frontend capability | Backend endpoint | Context adapter |
| --- | --- | --- |
| Health check | `/api/v1/health` | Shared API |
| Sign-in / sign-up | `/api/v1/auth/*` | `IamApi` |
| Users | `/api/v1/minimarkets/{minimarketId}/users` | `IamApi` |
| Profiles | `/api/v1/profiles` | `ProfilesApi` |
| Dashboard | `/api/v1/minimarkets/{minimarketId}/dashboard` | `DashboardApi` |
| Analytics | `/api/v1/minimarkets/{minimarketId}/analytics` | `AnalyticsApi` |
| Products | `/api/v1/products` | `ProductsApi` |
| Inventory | `/api/v1/minimarkets/{minimarketId}/inventory` | `InventoryApi` |
| Inventory search | `/api/v1/minimarkets/{minimarketId}/inventory/search` | `InventoryApi` |
| Lots | `/api/v1/minimarkets/{minimarketId}/lots` | `InventoryApi` |
| Expirations | `/api/v1/minimarkets/{minimarketId}/expirations` | `InventoryApi` |
| Supply requests | `/api/v1/minimarkets/{minimarketId}/requisitions` | `RequisitionApi` |
| Shipping orders | `/api/v1/minimarkets/{minimarketId}/purchase-orders` | `ProcurementsApi` |
| Suppliers | `/api/v1/suppliers` | `SuppliersApi` |
| Conservation monitoring | `/api/v1/minimarkets/{minimarketId}/conservation/monitoring` | `ConservationApi` |
| Alerts | `/api/v1/minimarkets/{minimarketId}/communication/alerts` | `CommunicationApi` |
| Messages | `/api/v1/minimarkets/{minimarketId}/communication/messages` | `CommunicationApi` |
| Activity history | `/api/v1/minimarkets/{minimarketId}/activity-history` | Dashboard / Shared |
| Waste | `/api/v1/minimarkets/{minimarketId}/waste` | Inventory API |
| Donations | `/api/v1/minimarkets/{minimarketId}/donations` | Inventory API |



## Development

Install dependencies:

```sh
npm install
```

Run the Vue development server:

```sh
npm run dev
```

Run the mock API:

```sh
npm run server
```

Run the mock API together with Vite:

```sh
npm run dev:mock
```

Build the production bundle:

```sh
npm run build
```

Preview the production bundle locally:

```sh
npm run preview
```

## Mock Server

The `server/` folder contains the local fake API used for frontend development and demonstrations.

- Mock data: `server/db.json`
- Mock routes: `server/routes.json`
- Mock server command: `npm run server`
- Frontend + mock command: `npm run dev:mock`

Use the mock server while the real backend is not available or when validating UI behavior locally.

## Verification

Local build verification:

```sh
npm run build
```

Local mock API health check:

```powershell
Invoke-WebRequest -Uri 'http://localhost:3000/api/v1/health' -UseBasicParsing
```

Expected mock health response:

```json
{
  "status": "ok",
  "service": "marketgo-fake-api"
}
```

Known Vite build warning:

- Some generated chunks may exceed 500 kB because PrimeVue, PrimeIcons and dashboard dependencies are bundled into the SPA.
- This is a bundle-size optimization warning, not a build failure.
