# Testing

El monorepo usa `Vitest` como runner principal.

## Comandos

```bash
bun run test
bun run test:frontend
bun run test:backend
bun run test:shared

bun run test:coverage
bun run --cwd apps/frontend test:coverage
bun run --cwd apps/backend test:coverage
bun x vitest run -c packages/vitest.config.ts --coverage
```

## Cobertura actual

- `apps/frontend`
  - Utilidades puras
  - Mapeos de enums
  - Lógica de búsqueda y pricing visible
  - Componentes React con Testing Library

- `apps/backend`
  - Middleware de autenticación
  - Normalización de errores
  - Helpers de catálogo

- `packages`
  - Contratos Zod
  - SDK de nutrición
  - SDK de pricing

## Archivos de configuración

- `apps/frontend/vitest.config.ts`
- `apps/backend/vitest.config.ts`
- `packages/vitest.config.ts`

## Setup de entorno

- Frontend: `apps/frontend/src/test/setup.ts`
- Backend: `apps/backend/src/test/setup.ts`

## Próximos tests recomendados

- Integración de rutas del frontend con `react-router-dom`
- Handlers/backend services con mocks de Prisma
- Flujos completos de formularios críticos
- Casos de error en contratos y adapters del SDK
- Cobertura de stores y estados globales
