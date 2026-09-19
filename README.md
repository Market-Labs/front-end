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