# Contributing Guidelines

Thank you for your interest in contributing to the **MarketGo Frontend** project. This repository is an educational frontend implementation based on Domain-Driven Design (DDD), bounded contexts, Vue 3, and a mock API for the MarketGo organic product management platform.

---

## 1. Code of Conduct & Standards

To maintain code quality and architectural consistency, all contributions must follow these principles:

### Domain-Driven Design (DDD)

- Each bounded context must remain inside its own feature folder:
    - `iam`
    - `profiles`
    - `dashboard`
    - `analytics`
    - `inventory`
    - `products`
    - `requisition`
    - `procurements`
    - `suppliers`
    - `conservation`
    - `communication`
    - `shared`
- Each feature should preserve the current layered structure:
    - `application`
    - `domain`
    - `domain/model`
    - `infrastructure`
    - `presentation`
    - `presentation/views`
- Domain entities and models must be placed in `domain/model`.
- API adapters and assemblers must be placed in `infrastructure`.
- Stores and application orchestration must be placed in `application`.
- Views and UI components must be placed in `presentation`.

### Frontend Architecture

- Reuse existing components, stores, routes, services, models, and styles whenever possible.
- Do not rebuild the application from scratch.
- Keep feature logic inside its corresponding bounded context.
- Use `shared` only for reusable layout, infrastructure, helpers, or cross-cutting UI elements.
- Keep role-based behavior aligned with the authenticated user role:
    - `Administrador de Minimarket`
    - `Proveedor Organico`

### UI and i18n

- All visible text must support Spanish and English through the existing i18n files.
- Do not hardcode user-facing labels inside views if they can be translated.
- Keep the existing MarketGo layout, visual style, spacing, and component structure consistent.
- Tables, buttons, statuses, menus, cards, and form labels must work correctly when switching languages.

### Mock API

- Fake API data must be maintained in `server/db.json`.
- Mock routes must be maintained in `server/routes.json`.
- Frontend endpoints must stay centralized in the shared API endpoint configuration.
- Mock data should reflect the current MarketGo domain model and user stories.

---

## 2. Git Workflow & Branching

We follow a structured Git branching model:

- `main`: Production-ready stable branch.
- `develop`: Integration branch for completed frontend work.
- `feature/<name>`: Dedicated branch for each bounded context or feature.
- `release/vX.Y.Z`: Preparation branch for releases.

Current feature branches follow the MarketGo bounded contexts:

- `feature/iam`
- `feature/profiles`
- `feature/dashboard`
- `feature/analytics`
- `feature/inventory`
- `feature/products`
- `feature/requisition`
- `feature/procurements`
- `feature/suppliers`
- `feature/conservation`
- `feature/communication`
- `feature/shared`

### Commit Message Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat(requisition): add supply request workflow`
- `feat(procurements): add shipping order reception flow`
- `fix(i18n): translate datatable status labels`
- `docs(readme): update local setup instructions`
- `refactor(shared): simplify layout navigation rules`
- `test(inventory): add stock update behavior tests`

---

## 3. Build & Verification Commands

Before opening a pull request, verify the project locally:

```bash
# 1. Install dependencies
npm install

# 2. Run the mock API
npm run server

# 3. Run the frontend locally
npm run dev

# 4. Run frontend and mock API together
npm run dev:mock

# 5. Build production bundle
npm run build
```
## 4. Pull Request Checklist
Before submitting a pull request, confirm that:
- The change belongs to the correct bounded context.
- The existing folder architecture was preserved.
- Spanish and English translations were updated.
- The fake API was updated if the UI depends on mock data.
- npm run build completes successfully.
- No unrelated files are included in the commit.
- Role-based behavior was verified for both administrator and supplier users.