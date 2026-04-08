# QART — SYSTEM CONTEXT (TFI · IEEE 830 READY)

---

## 0. PURPOSE OF THIS FILE

This file is the **single source of truth for AI agents**.

Goals:

- Enforce architectural consistency
- Auto-generate structured metadata in code
- Enable **automatic IEEE 830 PDF documentation generation**

⚠️ Every generated code MUST include metadata compatible with TFI sections.

---

## 1. SYSTEM OVERVIEW (IEEE 830 · 1.1 / 1.3)

### System Name

QART

### System Type

Web Application (Frontend + Backend API)

### Purpose

Digital restaurant platform focused on:

- Realistic ordering experience
- Modular architecture
- Author gastronomy UX

### Core Features (Mapped to TFI Requirements)

- Authentication + ABM Users (RF-01 → RF-06)
- Role System (RF-07 → RF-10)
- PDF Generation (RF-11 → RF-14)
- Report Export (RF-15 → RF-17)
- Domain CRUD (RF-18 → RF-20)

---

## 2. ARCHITECTURE (IEEE 830 · 12.1)

### Stack

- Backend: Bun + Express + Prisma
- Frontend: React + Vite + Tailwind
- Contracts: Zod
- SDK: Shared typesafe core

### Architecture Style

- Modular Monorepo
- SDK-First (~80% logic shared)
- Functional Architecture (NO classes)

### Flow

Client → API → Service → DB → Response

---

## 3. PROJECT RULES (CRITICAL)

### 3.1 Code Philosophy

- Functional programming ONLY
- ❌ NO classes
- ❌ NO function keyword
- ✅ ONLY arrow functions → `const fn = () => {}`
- Early returns + guard clauses
- Zero `any`
- DRY enforced via SDK

---

### 3.2 Imports

- NO file extensions
- Use absolute paths or aliases:
  - `@app/sdk`
  - `@app/contracts`

---

### 3.3 Module Structure

```text
modules/{Domain}/
  handlers/
  services/
  index.ts
```

---

## 4. SECURITY MODEL (TFI REQUIRED)

### Tokens

- CupCake → Access Token (1h)
- Cake → Refresh Token (7d)

### Rules

- Stored in HttpOnly cookies
- Auto-rotation in middleware
- `req.user` comes ONLY from JWT

---

## 5. AI METADATA SYSTEM (CRITICAL FOR PDF)

⚠️ THIS IS THE CORE OF THE SYSTEM

Every file MUST start with:

```ts
/**
 * @file [Name]
 * @module [Domain]
 * @description [What it does]
 *
 * @tfi
 * section: [IEEE 830 section reference]
 * rf: [RF-XX]
 * rnf: [RNF-XX if applies]
 *
 * @business
 * inputs: [data in]
 * outputs: [data out]
 * rules: [business rules]
 *
 * @technical
 * dependencies: [services/db/sdk]
 * flow: [step-by-step logic]
 *
 * @estimation
 * complexity: [Low/Medium/High]
 * fpa: [EI/EO/EQ/ILF/EIF]
 * story_points: [1-13]
 * estimated_hours: [number]
 *
 * @testing
 * cases: [TC-XX references]
 *
 * @notes
 * decisions: [why this approach]
 */
```

Additional mandatory interpretation for metadata fields:

- `@technical.dependencies` MUST list the real technical dependencies used by the file.
  - Include external libraries/packages actually imported in the file.
  - Include internal files/modules directly consumed by the file when relevant.
  - When useful for traceability, also mention the main file/module that consumes or wires this file.
  - Avoid placeholders such as `dependencias locales del archivo`.
- `@technical.flow` MUST describe the concrete process executed by the file.
  - Write the real sequence of steps performed by the file.
  - Prefer 3 to 6 short actions in order.
  - Mention validation, transformations, delegation, persistence, rendering, or returned output when applicable.
  - Avoid generic phrases such as `inicializa, transforma y expone la logica del modulo`.
- `@business.inputs`, `@business.outputs`, `@business.rules`, and `@notes.decisions` should be specific to the file responsibility and must not be left as generic template text.

---

## 6. REQUIREMENTS MAPPING (IEEE 830 · 11)

### Functional (MANDATORY)

- RF-01 → Register
- RF-02 → Login
- RF-03 → Logout
- RF-04 → Delete Account
- RF-05 → Update Profile
- RF-06 → Password Recovery
- RF-07 → Roles (user/admin)
- RF-08 → Admin full access
- RF-09 → User restricted access
- RF-10 → Role-based protection
- RF-11 → Generate PDF
- RF-12 → Store PDFs
- RF-13 → Admin reports
- RF-14 → Professional format
- RF-15 → Display reports
- RF-16 → Export (PDF/Excel/CSV)
- RF-17 → Access reports
- RF-18 → CRUD entities
- RF-19 → Filtering/search
- RF-20 → Activity history

---

### Non Functional

- RNF-01 → Performance (<2s)
- RNF-02 → Security (JWT + hashing)
- RNF-03 → Usability
- RNF-04 → Scalability
- RNF-05 → Maintainability
- RNF-08 → Error handling
- RNF-09 → PDF quality
- RNF-10 → DB normalized (3NF)

---

## 7. DATABASE RULES (IEEE 830 · 13)

- Must be normalized to 3NF
- PK + FK required
- No duplicated data
- Clear entity separation

---

## 8. TESTING REQUIREMENTS (IEEE 830 · 16)

Each feature MUST define:

- Unit tests
- Integration tests
- Role validation
- PDF validation
- Export validation

All logic must map to at least one TC (Test Case).

---

## 9. KANBAN + TRACEABILITY (IEEE 830 · 10 / 15)

Each implementation must include:

- Task reference (KANBAN ID)
- Related RF
- Related TC
- Estimated effort

---

## 10. HARD RULES FOR AI AGENTS

### 10.1 Mandatory Workflow after each change:
- **ALWAYS** perform a typecheck (`bun run typecheck:backend` or `bun run typecheck:frontend` as applicable).
- **ALWAYS** run unit tests in the affected areas to ensure no regressions.
- **NEVER** commit/finish a task without verifying these two steps.

### ALWAYS:
- Add metadata block
- Map to RF or RNF
- Define inputs/outputs
- Explain logic briefly
- Add estimation

### NEVER:

- Use `function` keyword
- Use classes
- Skip metadata
- Use `any`
- Ignore business rules
- Write unstructured code

---

## 11. OUTPUT FORMAT (STRICT)

When generating code:

1. Metadata block
2. Implementation
3. No explanations outside code

---

## 12. FINAL GOAL

The system must allow automatic generation of:

- IEEE 830 documentation
- PDF reports
- Technical documentation
- Testing traceability

Using ONLY code metadata.

---

## 13. REAL REPOSITORY CONTEXT (EXPLICIT IMPLEMENTATION MAP)

This section does NOT weaken the mandatory rules above.

Its purpose is to give agents exact code references so they can apply the mandatory rules correctly in the current monorepo.

### 13.1 Workspace Layout

Root workspace:

- `apps/backend`
- `apps/frontend`
- `packages/contracts`
- `packages/sdk`

Declared in:

- `package.json`

Shared TypeScript strictness:

- `tsconfig.base.json`

Current authored audit scope used for repository analysis:

- Included: `apps/**`, `packages/**`
- Excluded: `**/node_modules/**`, `**/dist/**`, `**/prisma/generated/**`, `**/*.d.ts`

Measured source count during audit:

- Authored TS/TSX files in scope: `153`

### 13.2 Contracts Package

Primary entrypoint:

- `packages/contracts/index.ts`

Current responsibility:

- imports `collectContracts` from `@app/sdk`
- aggregates:
  - `IAMContract`
  - `CUSTOMERContract`
- exports:
  - `contracts`
  - `AppContracts`

Exact files:

- `packages/contracts/IAMContract.ts`
- `packages/contracts/CUSTOMERContract.ts`

`packages/contracts/IAMContract.ts` currently defines:

- `LoginInputSchema`
- `ProfileSchema`
- `AuthUserSchema`
- `LoginContract`
- `RegisterContract`
- `LogoutContract`
- `MeContract`
- `UpdateMeContract`
- `RequestTokenContract`
- `VerifyUpdateContract`

`packages/contracts/CUSTOMERContract.ts` currently defines:

- public plate/catalog schemas
- review/order/history/address schemas
- customer endpoints:
  - `GET /customers/plates`
  - `GET /customers/featured`
  - `GET /customers/search`
  - `POST /customers/reviews`
  - `POST /customers/orders`
  - `GET /customers/history`
  - `GET /customers/addresses`
  - `POST /customers/addresses`
  - `PUT /customers/addresses`

### 13.3 SDK Package

Primary entrypoint:

- `packages/sdk/index.ts`

Environment-specific subpath entrypoints:

- `@app/sdk/ApiClient`
- `@app/sdk/ApiServer`

Exact responsibilities by file:

- `packages/sdk/Contracts.ts`
  - defines `Contract`, `AnyContract`, `InferRequest`, `InferSuccess`
  - defines `defineEndpoint`
  - defines `collectContracts`
- `packages/sdk/ApiClient.ts`
  - creates the frontend runtime SDK from the contract tuple
  - attaches request stores and form stores
  - generates verb-prefixed collision-safe actions like `postAddresses` and `putAddresses`
- `packages/sdk/ApiServer.ts`
  - creates backend route handlers from the same contracts
  - validates inputs
  - runs auth/role middleware
  - validates outputs in non-prod
  - logs startup and requests
- `packages/sdk/FieldDef.ts`
  - defines `defineField`
  - centralizes reusable field validation metadata
- `packages/sdk/IAMFields.ts`
  - defines shared IAM field constraints
- `packages/sdk/CUSTOMERFields.ts`
  - defines shared customer/catalog field constraints
- `packages/sdk/FormStore.ts`
  - creates field/form stores used by the frontend SDK
- `packages/sdk/ErrorCodes.ts`
  - defines public errors and HTTP status mapping

### 13.4 Backend Integration

Main composition files:

- `apps/backend/src/tools/api.ts`
- `apps/backend/src/index.ts`

Module roots currently present:

- `apps/backend/src/modules/IAM`
- `apps/backend/src/modules/CUSTOMERS`

`apps/backend/src/tools/api.ts` currently:

- creates Express app
- configures `helmet`
- configures `cors`
- configures `cookie-parser`
- configures JSON/body parsing
- serves static assets from backend public directory
- creates `api` with `createServerApi(contracts, adapters)`

`apps/backend/src/index.ts` currently:

- imports `IAMRouter`
- imports `CUSTOMERSRouter`
- injects `prismaAdapter`
- starts the server through `api.init(...).start()`

Current backend module convention in use:

```text
modules/{Domain}/
  handlers/
  services/
  index.ts
```

### 13.5 Frontend Integration

Main composition files:

- `apps/frontend/src/tools/sdk.ts`
- `apps/frontend/src/tools/FormFactory.tsx`

Frontend module roots currently present:

- `apps/frontend/src/modules/IAM`
- `apps/frontend/src/modules/Landing`
- `apps/frontend/src/modules/Search`
- `apps/frontend/src/modules/Customer`

`apps/frontend/src/tools/sdk.ts` currently:

- creates `sdk = createClientApi(contracts, { ... })`
- creates `form = FormFactory(sdk)`

Design system / visual context sources:

- `apps/frontend/src/index.css`
- `apps/frontend/public/themes/*.css`

### 13.6 Import and Alias Reality

Workspace aliases in real use:

- `@app/sdk`
- `@app/sdk/ApiClient`
- `@app/sdk/ApiServer`
- `@app/contracts`

Backend local aliases from `apps/backend/tsconfig.json`:

- `@env`
- `@middleware/*`
- `@tools/*`
- `@modules/*`

### 13.7 Existing Reusable Factories and Shared Abstractions

If something repeats, agents should prefer extending these existing abstractions first:

- contract aggregation:
  - `packages/contracts/index.ts`
- endpoint builder:
  - `packages/sdk/Contracts.ts`
- field system:
  - `packages/sdk/FieldDef.ts`
  - `packages/sdk/IAMFields.ts`
  - `packages/sdk/CUSTOMERFields.ts`
- frontend SDK singleton:
  - `apps/frontend/src/tools/sdk.ts`
- frontend form system:
  - `apps/frontend/src/tools/FormFactory.tsx`
- reusable section composition:
  - `apps/frontend/src/components/shared/SectionFactory.tsx`
- settings shell:
  - `apps/frontend/src/modules/Landing/components/settings/SettingsLayout.tsx`

### 13.8 Audit Snapshot Against Mandatory Rules

This subsection is descriptive only. It does not override the mandatory rules in sections 3, 5, and 10.

Observed during repository-wide authored-code audit:

- Some authored files still use `function` declarations.
- One authored class exists:
  - `packages/sdk/ErrorCodes.ts` → `AppError`
- Some explicit `any` remains concentrated in:
  - `apps/frontend/src/tools/FormFactory.tsx`
- Metadata coverage is incomplete in current authored code.

Therefore:

- The mandatory rules above are the target standard.
- The repository is still being aligned to that standard.
- Future generated or modified code must follow the mandatory standard even if legacy files do not yet fully comply.

### 13.9 Validation Commands

Use these commands when applying or checking the mandatory rules:

- `bun run typecheck:frontend`
- `bun run typecheck:backend`
- `bunx eslint apps packages`
- `bun run build:frontend`
- `bun run build:backend`

### 13.10 Generated Code Exception

Do not manually normalize generated sources under:

- `apps/backend/prisma/generated/**`

Those files are implementation artifacts, not authored source-of-truth files.
