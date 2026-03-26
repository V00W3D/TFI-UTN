# QART — System Context & Development Rules

## 1. PURPOSE

QART is a modular web platform focused on a **realistic digital restaurant experience**.

The system allows users to:

- order food
- customize certain dishes
- interact through reviews
- experience a modern, intuitive food ordering flow

The goal is to simulate a **"MercadoLibre-style marketplace" for food**, combined with the UX simplicity of food delivery platforms.

---

## 2. CORE FEATURES

### Ordering System

- Users can:
  - order food for dine-in or takeaway
  - choose payment method:
    - credit card
    - debit card
    - bank transfer
    - cash

### Order Flow

- Order lifecycle must include:
  - created
  - confirmed
  - in preparation
  - ready
  - delivered

- System must notify users when:
  - order is accepted
  - order is ready

---

### Craftable Dishes System (CORE FEATURE)

Certain dishes are customizable ("craftable"):

Initial scope:

- sandwiches
- burgers
- similar layered food

Users can:

- select ingredients
- build their own version of the dish

IMPORTANT:

- Crafting is LIMITED and structured
- Avoid infinite or unrealistic combinations
- System must validate ingredient combinations

Non-craftable dishes:

- traditional meals (e.g. stews, pasta)
- only minor variations allowed (optional)

---

### Reviews System

- Users can leave reviews on dishes

- Rating system:
  - decimal values (0–5)

- Reviews can be:
  - anonymous
  - user-linked (optional)

BUT:

- authentication is REQUIRED to post

NO heavy content filtering:

- freedom of expression is allowed

---

## 3. PRODUCT STRATEGY

Initial focus:

- simple restaurant experience
- strong UX
- stable ordering system

Future vision:

- evolve into SaaS restaurant platform
- support real restaurants
- scalable architecture

---

## 4. TECH STACK (MANDATORY)

### Backend

- Framework: NestJS
- Runtime: Bun
- Database: Prisma (SQL)
- Auth: JWT + Argon2
- Architecture: Modular

### Frontend

- React + Vite
- TailwindCSS v4 (QART Design System)

### Shared

- SDK (~80% logic)
- Contracts (Zod)

---

## 5. MONOREPO STRUCTURE

root/
apps/
frontend/
src/
modules/
backend/
src/
modules/
config/
tools/
prisma/
packages/
sdk/
contracts/

---

## 6. ARCHITECTURE RULES

- Strict modular structure: `src/modules/{MODULE}`

- Each module MUST include:
  - handlers
  - services
  - contracts
  - (frontend) components

- No direct cross-module dependencies

- Use contracts for communication

- SDK is the central shared layer

---

## 7. IMPORT RULES

- NEVER use `.js` extensions
- `@/*` only for local `src`
- Shared code via packages:
  - `@qart/sdk`
  - `@qart/contracts`

---

## 8. API DESIGN

- RESTful endpoints
- Standard response:

{
data?: any,
error?: {
message: string,
code: string
}
}
(if data is != null, is taken as success, else, if error, then is a failure)

- Required HTTP status codes:
  200, 201, 400, 401, 404, 500

---

## 9. REAL-TIME SYSTEM

Use WebSockets (NestJS Gateway)

Events:

- order_created
- order_updated
- order_ready

Purpose:

- real-time order tracking
- improved UX

---

## 10. DOCUMENTATION RULES

Each module MUST include:

### doc.md

- purpose
- responsibilities
- design decisions
- interactions

### tasks.md

id:
name:
status:
type:
completion:
area:
timeline:
responsible:

---

## 11. CODE DOCUMENTATION

All files MUST include JSDoc:

@file
@author Victor
@description
@param
@returns
@example
@remarks

Metrics MUST include:

- LOC
- Experience Level: Junior
- Estimated Time
- FPA
- PERT
- Planning Poker

---

## 12. DESIGN SYSTEM

- TailwindCSS v4
- Style: Formal, Professional, Human

Palette:

- Primary: Deep Plum
- Base: Cream
- Dark: Obsidian
- Accent: Aged Gold

Typography:

- Serif: Cormorant Garamond
- Sans: Inter / Outfit

UX:

- immersive
- narrative-driven
- elegant

---

## 13. TESTING

- Required
- Vitest
- React Testing Library

---

## 14. AUTH SYSTEM

- Local only
- JWT + COOKIES
  (work with JWT INSIDE COOKIES in the entire project)
- Argon2 (to hash principally)
- Custom roles (extensible)

---

## 15. DEVELOPMENT PRINCIPLES

- DRY (strict)
- Readability > cleverness
- Modular > monolithic
- Explicit > implicit
- Everything must be explainable

---

## 16. DEVELOPMENT BEHAVIOR (FOR AI)

- Always follow module structure
- Always generate doc.md and tasks.md
- Never skip documentation
- Never simplify architecture
- Always explain WHY
- Always reuse SDK and contracts
- Everytime a change is done, make a commit to the github repository:

https://github.com/V00W3D/QART.git

## (with profesional description and naming of the commits themselves.)

## 17. PRODUCT PHILOSOPHY

QART is NOT a social network.

QART is a **digital restaurant experience**.

Focus on:

- usability
- customization
- clarity
- real-world applicability

Avoid:

- toxic interactions
- ownership conflicts
- unnecessary complexity
