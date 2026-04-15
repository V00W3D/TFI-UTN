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

## 3. GLOBAL CODE RULES (CRITICAL)

### 3.1 Code Philosophy

- Functional programming ONLY
- ❌ NO classes
- ❌ NO `function` keyword
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
- Frontend: ALWAYS use `@/` for local frontend imports (tsconfig paths)
- ❌ NEVER use relative imports like `../../components/...`

---

### 3.3 Backend Module Structure

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

## 10. FRONTEND ARCHITECTURE RULES (CRITICAL)

### 10.1 Styling System (MANDATORY)

> `/styles/*` is the SINGLE SOURCE OF TRUTH for ALL styling. Nothing outside `/styles/*` is allowed to define styles.

- ❌ NO `.css` files
- ❌ NO inline Tailwind classes in JSX
- ❌ NO raw `className` strings inside `.tsx` or `.ts`
- ❌ NEVER define styles inside components
- ✅ ALL styles MUST come from `/styles/*`
- ✅ ALL styles MUST be static strings (Tailwind JIT safe)
- ❌ NO dynamic Tailwind generation:
  - `"bg-" + color`
  - Template strings with runtime values

---

### 10.2 Required Styling Libraries

- `clsx`
- `class-variance-authority (cva)`

Utility function (MANDATORY):

```ts
import clsx from 'clsx';
export const cn = (...inputs: any[]) => clsx(inputs);
```

ALL component styles MUST use `cva`:

```ts
import { cva } from 'class-variance-authority';

export const buttonStyles = cva('rounded font-medium transition', {
  variants: {
    variant: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-200 text-black',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});
```

ALL conditionals MUST use `cn()`:

```tsx
<div className={cn(baseStyle, isActive && activeStyle)} />
```

---

### 10.3 Component Style Usage

```tsx
import { buttonStyles } from '@/styles/components/button';

<button className={buttonStyles()} />;
```

---

### 10.4 Module Architecture (MANDATORY)

Each module MUST define:

- `${ModuleName}Route.tsx` — Uses react-router-dom (object-based). Orchestrates module routing and app integration.
- `${ModuleName}View.tsx` — Main UI of the module. MUST be composed from smaller components, NOT monolithic.

Rules:

- ❌ DO NOT create `pages/` folders
- ❌ DO NOT rely on layout systems unless strictly necessary
- ✅ Layout usage is OPTIONAL — prefer composition ALWAYS

---

### 10.5 Modularization Strategy

- Components MUST be split when they grow
- Each large component MUST live in its own folder
- Internal folder structure is flexible BUT MUST remain consistent across the project
- Extract subcomponents, hooks, and logic layers into separate files
- Large files MUST be split — no exceptions

---

### 10.6 Naming Rules (VERY IMPORTANT)

Names MUST be:

- Short
- Clear
- Expressive

Prefer:

- `UserForm.tsx`
- `AuthButton.tsx`
- `DashboardHeader.tsx`

Avoid:

- Long overdescriptive names
- Redundant naming patterns

> Consistency belongs to structure and content, NOT long file names.

---

### 10.7 Folder Rules

- DO NOT introduce a new global structure
- ADAPT to the existing structure
- SIMPLIFY where possible
- REMOVE unnecessary nesting
- KEEP naming consistent and semantic

---

### 10.8 Code Quality Rules

- Components must be predictable
- No hidden logic
- No duplicated UI patterns
- Reuse styles and patterns ALWAYS
- SDK contracts from `packages/*` MUST be followed — NEVER bypass SDK logic

---

### 10.9 AI Optimization Rules

The system MUST be deterministic, composable, and predictable.

An AI MUST:

- Select `cva` variants — NEVER invent inline styles
- Reuse existing tokens from `/styles/*`
- NEVER generate raw className strings

---

### 10.10 Non-Negotiable Frontend Checklist

- `/styles/*` is the ONLY styling source
- NEVER use inline Tailwind classes
- ALWAYS import styles from `/styles/*`
- ALWAYS use `cva` for component styles
- ALWAYS use `cn()` for conditional classes
- NEVER define styles inside components
- ALWAYS use absolute imports with `@/`
- Components MUST remain modular
- `View` files MUST be composed, NOT monolithic
- Avoid layout systems unless strictly necessary
- Files MUST remain small and focused
- Avoid duplication at all costs
- Follow SDK contracts from `packages/*` at all times

---

## 11. MANDATORY AGENT WORKFLOW

### 11.1 After Every Change (NO EXCEPTIONS)

1. Run typecheck:
   - `bun run typecheck:backend` (if backend was touched)
   - `bun run typecheck:frontend` (if frontend was touched)
2. Run unit tests in affected areas — ensure zero regressions
3. ❌ NEVER commit or finish a task without completing steps 1 and 2

---

### 11.2 Frontend Migration Workflow (STRICT ORDER)

When refactoring or adding frontend styling:

1. Scan ALL `.tsx` and `.ts` files involved
2. Extract ALL `className` usages
3. Move ALL styles into `/styles/*` as `cva` definitions or tokens
4. Replace ALL usages with imported variables or `cva` variants
5. Validate UI visually — ensure ZERO regressions
6. Verify Tailwind JIT still detects ALL classes (no dynamic strings)
7. ONLY THEN delete any `.css` files that were fully migrated

---

### 11.3 Git Commit Rule (MANDATORY)

After completing any significant change:

```bash
git add .

git commit -m "refactor(scope): short description of change" \
-m "Detail line 1" \
-m "Detail line 2" \
-m "Detail line 3"
```

---

## 12. HARD RULES FOR AI AGENTS

### ALWAYS:

- Add metadata block to every file
- Map to RF or RNF
- Define inputs/outputs
- Explain logic briefly
- Add estimation
- Use `cva` for all component styles
- Use `cn()` for all conditional classes
- Import styles from `/styles/*`
- Use absolute imports with `@`
- Compose `View` files from smaller components
- Run typecheck after every change
- Run tests after every change

### NEVER:

- Use `function` keyword
- Use classes
- Skip metadata
- Use `any`
- Ignore business rules
- Write unstructured code
- Use inline Tailwind classes
- Define styles inside components
- Use relative imports
- Create `.css` files
- Use dynamic Tailwind class generation
- Bypass SDK contracts
- Create monolithic View files
- Commit without typecheck + test verification

---

## 13. OUTPUT FORMAT (STRICT)

When generating code:

1. Metadata block
2. Implementation
3. No explanations outside code

---

## 14. FINAL GOAL

The system must allow automatic generation of:

- IEEE 830 documentation
- PDF reports
- Technical documentation
- Testing traceability

Using ONLY code metadata.

Frontend must reach:

- Zero `.css` files
- Zero inline `className` strings
- Fully centralized styling system (`/styles/*`)
- Clean, modular, composable frontend
- Absolute import consistency
- AI-ready, deterministic architecture

---

## 15. REAL REPOSITORY CONTEXT (EXPLICIT IMPLEMENTATION MAP)

This section does NOT weaken the mandatory rules above.

Its purpose is to give agents exact code references so they can apply the mandatory rules correctly in the current monorepo.

### 15.1 Workspace Layout

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

### 15.2 Contracts Package

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

### 15.3 SDK Package

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

### 15.4 Backend Integration

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

### 15.5 Frontend Integration

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

### 15.6 Import and Alias Reality

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

### 15.7 Existing Reusable Factories and Shared Abstractions

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

### 15.8 Audit Snapshot Against Mandatory Rules

This subsection is descriptive only. It does not override the mandatory rules in sections 3, 5, 10, 11, and 12.

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

### 15.9 Validation Commands

Use these commands when applying or checking the mandatory rules:

- `bun run typecheck:frontend`
- `bun run typecheck:backend`
- `bunx eslint apps packages`
- `bun run build:frontend`
- `bun run build:backend`

### 15.10 Generated Code Exception

Do not manually normalize generated sources under:

- `apps/backend/prisma/generated/**`

Those files are implementation artifacts, not authored source-of-truth files.
