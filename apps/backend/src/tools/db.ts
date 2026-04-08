/**
 * @file db.ts
 * @module Backend
 * @description Archivo db alineado a la arquitectura y trazabilidad QART.
 *
 * @tfi
 * section: IEEE 830 13
 * rf: RF-18
 * rnf: RNF-05
 *
 * @business
 * inputs: infraestructura compartida, variables de entorno y adapters del backend
 * outputs: helpers reutilizables para bootstrap, errores, DB o lectura de usuario
 * rules: centralizar infraestructura y evitar duplicacion entre modulos
 *
 * @technical
 * dependencies: client, @prisma/adapter-pg, env
 * flow: recibe configuracion o dependencias compartidas; resuelve la tarea transversal del backend; expone helpers reutilizables para el resto del servidor.
 *
 * @estimation
 * complexity: Medium
 * fpa: EQ
 * story_points: 3
 * estimated_hours: 2
 *
 * @testing
 * cases: TC-AUDIT-01
 *
 * @notes
 * decisions: la infraestructura comun se centraliza en tools para simplificar mantenimiento
 */
/**
 * 🚫🚫🚫 NO EDITAR — ARCHIVO CRÍTICO DE INFRAESTRUCTURA 🚫🚫🚫
 * Este archivo configura la conexión a base de datos.
 * Cualquier modificación puede romper TODO el backend.
 * Si necesitás cambios, crear un nuevo adapter o discutir antes.
 *
 * @file prisma.ts
 * @author Victor
 * @description Configuración global de Prisma usando adapter-pg para Bun.
 *
 * @remarks
 * - Diseñado para entorno Bun
 * - Usa PrismaPg adapter
 * - Implementa patrón Singleton
 *
 * @metrics
 * - LOC: ~40
 * - Experience Level: Junior
 * - Estimated Time: 30m
 * - FPA: 2
 * - PERT: 25m
 * - Planning Poker: 2
 */

import { PrismaClient } from '../../prisma/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { DATABASE_URL } from '../env';

/**
 * @description Adapter de PostgreSQL para Prisma compatible con Bun.
 */
const adapter = new PrismaPg({
  connectionString: DATABASE_URL,
});

/**
 * @description Prisma Client Global Singleton.
 */
export const prisma = new PrismaClient({
  adapter,
});

/**
 * @description SDK Database Adapter.
 */
export const prismaAdapter = {
  name: 'prisma',
  instance: prisma,
  url: DATABASE_URL,
  connect: async () => {
    await prisma.$connect();
  },

  disconnect: async () => {
    await prisma.$disconnect();
  },
};
