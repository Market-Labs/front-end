# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-09-19

### Added

- Initial MarketGo frontend structure based on bounded contexts and DDD layers.
- Feature folders for `iam`, `profiles`, `dashboard`, `analytics`, `inventory`, `products`, `requisition`, `procurements`, `suppliers`, `conservation`, `communication`, and `shared`.
- Shared layout with sidebar navigation, topbar search, language switcher, and authenticated user summary.
- Role-based demo behavior for `Administrador de Minimarket` and `Proveedor Organico`.
- Supply request workflow for administrators and suppliers.
- Shipping order workflow connected to accepted supply requests.
- Fake API data for organic products, suppliers, inventory, alerts, analytics, supply requests, and shipping orders.
- Internationalization support for Spanish and English.
- Global search filtering across visible datatable content.
- MarketGo brand logo and tagline.

### Changed

- Updated the supply workflow to follow the current domain model:
  `Supply Request -> Supplier Review -> Shipping Order -> Admin Reception -> Inventory Update`.
- Renamed the frontend meaning of requisitions to supply requests.
- Updated procurements views to represent shipping orders.
- Updated the dashboard to show role-relevant indicators using the same layout.
- Updated sidebar navigation so available modules change according to the selected user role.
- Updated mock data to align with the MarketGo organic product management domain.
- Updated UI copy, status labels, and table headers for i18n consistency.

### Fixed

- Fixed incomplete module views for procurements, conservation, communication, and analytics.
- Fixed buttons that opened forms without proper role-aware behavior.
- Fixed analytics report cards so they display report-specific data.
- Fixed dashboard metric navigation to inventory, alerts, and shipping orders.
- Fixed alert count mismatch by aligning dashboard indicators with fake API data.
- Fixed untranslated datatable headers and status values across modules.
- Fixed search behavior so it filters the visible table data in each section.

### Security

- Added basic role-based UI restrictions for administrator-only and supplier-specific actions.
- Added route-level redirection to access denied when a role tries to access a hidden module.