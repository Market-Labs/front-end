# MarketGo Fake API Server

This folder contains the local `json-server` data used to demo and test the MarketGo frontend without a deployed backend.

It provides mock data for:

- Dashboard indicators and recent activity.
- IAM users, roles and permissions.
- Profiles for minimarkets and providers.
- Products, inventory, requisitions, procurements and suppliers.
- Conservation monitoring, alerts, notifications and activity history.

## Run From Frontend Root

Install dependencies and run Vite with the fake API:

```sh
npm install
npm run dev:mock
```

The frontend runs at:

```txt
http://127.0.0.1:5173
```

The fake API runs at:

```txt
http://localhost:3000
```

## Run Only The Fake API

From the frontend root:

```sh
npm run server
```

Or from this `server` folder:

```sh
npm install
npm run dev
```

## API Routes

The mock server maps the MarketGo frontend contract to local `json-server` resources.

| Capability | Endpoint | Adapter |
| --- | --- | --- |
| Sign-in / sign-up | `/api/v1/auth/*` | `IamApi` |
| Users | `/api/v1/minimarkets/{minimarketId}/users` | `IamApi` |
| Profiles | `/api/v1/profiles` | `ProfilesApi` |
| Dashboard | `/api/v1/minimarkets/{minimarketId}/dashboard` | `DashboardApi` |
| Analytics | `/api/v1/minimarkets/{minimarketId}/analytics` | `AnalyticsApi` |
| Inventory | `/api/v1/minimarkets/{minimarketId}/inventory` | `InventoryApi` |
| Products | `/api/v1/products` | `ProductsApi` |
| Requisitions | `/api/v1/minimarkets/{minimarketId}/requisitions` | `RequisitionApi` |
| Purchase orders | `/api/v1/minimarkets/{minimarketId}/purchase-orders` | `ProcurementsApi` |
| Suppliers | `/api/v1/suppliers` | `SuppliersApi` |
| Conservation monitoring | `/api/v1/minimarkets/{minimarketId}/conservation/monitoring` | `ConservationApi` |
| Communication messages | `/api/v1/minimarkets/{minimarketId}/communication/messages` | `CommunicationApi` |
| Alerts | `/api/v1/minimarkets/{minimarketId}/communication/alerts` | `CommunicationApi` |

The default frontend `minimarketId` is:

```txt
minimarket-demo
```

You can override it with:

```env
VITE_MINIMARKET_ID=your-minimarket-id
```

The local data and route aliases live in:

```txt
db.json
routes.json
```

## Production Note

Do not deploy this folder as the production backend. It is only for frontend demos and educational testing. Production builds should point `VITE_API_BASE_URL` to the real MarketGo backend when it is available.
