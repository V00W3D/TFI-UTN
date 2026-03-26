# QART — System Context & Development Rules

## 1. System Vision & Strategy

### Purpose

QART is a high-performance, modular platform designed for a **realistic digital restaurant experience**. It bridges the gap between a "MercadoLibre-style marketplace" and a premium food delivery platform, focusing on author gastronomy and human-centric UX.

### Core Pillars

- **Craftable Dishes**: Layered customization (burgers, sandwiches) with strict validation.
- **Order Lifecycle**: Real-time tracking from creation to delivery.
- **Human-Centric UI**: Formal, professional, and narrative-driven aesthetic.
- **SDK-First Architecture**: ~80% of business logic resides in a shared, typesafe SDK.

---

## 2. Monorepo Architecture Map

### `/apps/backend` (Bun + Express + SDK)

- `src/index.ts`: Entry point. Orchestrates the bootstrap via `api.init().start()`.
- `src/env.ts`: Strict environment validation layer using Zod.
- `src/tools/`: SDK-Express bridge.
  - `api.ts`: Singleton for the Express `app` and SDK `api` instance.
  - `db.ts`: Prisma PostgreSQL adapter and connection pool management.
  - `ErrorTools.ts`: Normalized error pipeline (Zod -> Prisma -> SDK).
- `src/middleware/`: Security guards.
  - `auth.middleware.ts`: Dual-token rotation (CupCake/Cake).
  - `role.middleware.ts`: RBAC (Role-Based Access Control).
- `src/modules/`: Business domains (e.g., `IAM`).
  - `handlers/`: SDK-typed endpoint definitions.
  - `services/`: Functional business logic (no classes).

### `/apps/frontend` (React + Vite + Tailwind v4)

- Implements the same modular pattern as the backend.
- Uses `@app/sdk/ApiClient` for typesafe communication.

### `/packages/contracts` (Zod)

- Source of truth for all data shapes, enums, and API endpoints.

### `/packages/sdk` (Shared Core)

- `ApiServer.ts`: Factory for typesafe Express servers.
- `ApiClient.ts`: Proxy-based API consumer for the frontend.
- `ErrorCodes.ts`: Standardized error identifiers and AppError primitives.

---

## 3. Backend Operational Flow

### Initialization Flow

1. Load and validate `env.ts`.
2. Configure Express `app` in `tools/api.ts` (Helmet, CORS, Cookies).
3. Bind the `prismaAdapter` in `tools/db.ts` to ensure database health.
4. Mount module routers (e.g., `IAMRouter`) into the SDK.
5. SDK starts the listener in `index.ts`.

### Request/Response Lifecycle

1. **Transport**: Raw Express request hits the listener.
2. **Auth**: `authMiddleware` verifies/rotates CupCake/Cake cookies; populates `req.user`.
3. **Guard**: `roleMiddleware` verifies RBAC requirements if defined.
4. **Validation**: SDK validates `input` against the Zod contract.
5. **Logic**: `Handler` calls `Service` (pure async function).
6. **Persistence**: `Service` consumes `prisma` directly from `tools/db.ts`.
7. **Error**: If anything throws, `ErrorTools.catch` normalizes it for the client.

---

## 4. Development Standards & Rules

### Coding Philosophy

- **Strict DRY**: Leverage the SDK and shared utilities to minimize boilerplate.
- **Compactness**: Favor concise, functional code with early returns and guard clauses.
- **Documentation**: Professional JSDoc in every file explaining the **"Why"** and **"How"**.
- **Typing**: Zero `any` usage. Rely on SDK `InferRequest`/`InferSuccess` for contract safety.

### Import Rules (Backend)

- **No Extensions**: Imports must NEVER include extensions like `.js` or `.ts`.
- **Absolute Paths**: Use paths relative to `src` (e.g., `../../tools/api`) or workspace aliases.
- **Workspace Aliases**: `@app/sdk` and `@app/contracts` are the only valid cross-package aliases.

### Module Structure (Canonical)

Every module must reside in `src/modules/{Domain}` and follow this structure:

- `handlers/`: Individual files per endpoint (e.g., `LoginHandler.ts`).
- `services/`: Functional logic files (e.g., `LoginService.ts`).
- `index.ts`: Exports the aggregated router via `api.router([...handlers])`.

### Security: CupCake & Cake

- **CupCake**: Access token (1h). Stored in HttpOnly, Secure, SameSite:Strict cookie.
- **Cake**: Refresh token (7d). Used by `authMiddleware` to regenerate CupCake automatically.
- **req.user**: Populated from JWT payload. No database query performed for "Me" requests.

---

## 5. Metadata & Metrics Header

Every source file must begin with a metadata block for tracking:

```ts
/**
 * @file [Filename]
 * @author Victor
 * @description [Brief description of responsibility]
 * @remarks [Design decisions / Architecture notes]
 *
 * Metrics:
 * - LOC: [Number]
 * - Experience Level: [Junior/Mid/Senior]
 * - Estimated Time: [Interval]
 * - FPA/PERT/Planning Poker: [Values]
 */
```
