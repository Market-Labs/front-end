# MarketGo Fake API Server

This folder contains the local `json-server` data used to demo and test the MarketGo frontend without a deployed backend.

It provides mock data for:

- Dashboard indicators and recent activity.
- IAM users, roles and permissions.
- Two local sign-in accounts for the administrator and supplier demos.
- Profiles for minimarkets and providers.
- Products, inventory, requisitions, procurements, sales, waste and suppliers.
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
| Demo sign-in accounts | `/api/v1/auth/accounts` | `IamApi` |
| Users | `/api/v1/minimarkets/{minimarketId}/users` | `IamApi` |
| Profiles | `/api/v1/profiles` | `ProfilesApi` |
| Dashboard | `/api/v1/minimarkets/{minimarketId}/dashboard` | `DashboardApi` |
| Analytics | `/api/v1/minimarkets/{minimarketId}/analytics` | `AnalyticsApi` |
| Inventory | `/api/v1/minimarkets/{minimarketId}/inventory` | `InventoryApi` |
| Inventory item | `/api/v1/minimarkets/{minimarketId}/inventory/{id}` (PATCH, DELETE) | `InventoryApi` |
| Retail sales | `/api/v1/minimarkets/{minimarketId}/sales` (GET, POST) | `SalesApi` |
| Waste | `/api/v1/minimarkets/{minimarketId}/waste` (GET, POST) | `InventoryApi` |
| Products | `/api/v1/products` (GET, POST), `/api/v1/products/{id}` (GET, PATCH, DELETE) | `ProductsApi` |
| Requisitions | `/api/v1/minimarkets/{minimarketId}/requisitions` | `RequisitionApi` |
| Requisition review | `/api/v1/minimarkets/{minimarketId}/requisitions/{id}` (PATCH) | `RequisitionApi` |
| Purchase orders | `/api/v1/minimarkets/{minimarketId}/purchase-orders` | `ProcurementsApi` |
| Order reception | `/api/v1/minimarkets/{minimarketId}/purchase-orders/{id}` (PATCH) | `ProcurementsApi` |
| Suppliers | `/api/v1/suppliers` | `SuppliersApi` |
| Conservation monitoring | `/api/v1/minimarkets/{minimarketId}/conservation/monitoring` | `ConservationApi` |
| Communication messages | `/api/v1/minimarkets/{minimarketId}/communication/messages` | `CommunicationApi` |
| Alerts | `/api/v1/minimarkets/{minimarketId}/communication/alerts` | `CommunicationApi` |
| Supplier dashboard, analytics, products, inventory, conservation and alerts | `/api/v1/suppliers/{supplierId}/*` | Role-specific adapters |

The supplier product route filters the same `products` collection by `supplierId`; there is no separate supplier catalog. Existing product IDs use category prefixes (`VGT`, `FRT`, `LCT`, `ORG`) and five digits. The frontend assigns the next ID in each category when creating a product.

The create forms for inventory, requisitions, purchase orders, suppliers, sales and waste, plus review actions and user role/status updates, write to their mapped collections in `db.json`. Accepting a shipment adds its items to minimarket stock; a retail sale or waste record subtracts from stock. Supplier sales are derived from received shipping orders, not duplicated in `retailSales`. The six analytics reports read those collections and can be exported as PDF or XLSX. These multi-request changes use best-effort rollback, not a database transaction. `json-server` may reformat this file when it persists a change. This demo server does not enforce authentication or authorization; role restrictions in the UI are not a security boundary.

Demo credentials are `admi@marketgo.com` / `admi` and `proveedor@marketgo.com` / `proveedor`. The frontend compares them in JavaScript; this is not secure authentication. The fake API exposes these passwords as plain data and must never be deployed publicly.

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
