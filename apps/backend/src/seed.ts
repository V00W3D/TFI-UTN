/**
 * @file seed.ts
 * @author Victor
 * @description Automatically enforced JSDoc header according to context.md guidelines.
 * @param null
 * @returns null
 * @example null
 * @remarks This file is part of the QART monorepo architecture.
 *
 * Metrics:
 * - LOC: 50
 * - Experience Level: Junior
 * - Estimated Time: 30m
 * - FPA: 1
 * - PERT: 1
 * - Planning Poker: 1
 */
import argon2 from 'argon2';
import { prisma } from '@tools/db';
import { PlateType, FlavorProfile } from '../prisma/generated/client';

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

const hash = (pwd: string) => argon2.hash(pwd, { type: argon2.argon2id });

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const NAMES = ['Juan', 'Pedro', 'Lucas', 'Mateo', 'Santi', 'Tomi'] as const;
const LNAMES = ['Gomez', 'Perez', 'Diaz', 'Fernandez'] as const;

const PLATE_NAMES = [
  'Burger explosiva',
  'Pizza volcánica',
  'Helado nuclear',
  'Papas del infierno',
  'Wrap cósmico',
  'Milanesa suprema',
  'Tacos galácticos',
  'Ensalada zen',
  'Sandwich brutal',
  'Brownie oscuro',
] as const;

const TYPES: readonly PlateType[] = ['MAIN', 'DESSERT', 'SNACK'];

const FLAVORS: readonly FlavorProfile[] = ['SWEET', 'SALTY', 'UMAMI', 'ACID'];

const INGREDIENTS = [
  { name: 'Carne', flavor: 'UMAMI' as FlavorProfile },
  { name: 'Queso', flavor: 'UMAMI' as FlavorProfile },
  { name: 'Tomate', flavor: 'ACID' as FlavorProfile },
  { name: 'Lechuga', flavor: 'UNKNOWN' as FlavorProfile },
  { name: 'Chocolate', flavor: 'SWEET' as FlavorProfile },
];

const TAGS = ['Picante', 'Veggie', 'Fit', 'Dulce', 'Premium'] as const;

// ─────────────────────────────────────────────
// SEED
// ─────────────────────────────────────────────
async function main() {
  console.log('🌱 Seeding...');

  // ───────── USERS ─────────
  const basePassword = await hash('123456');

  const authority = await prisma.user.create({
    data: {
      username: 'admin',
      name: 'Admin',
      lname: 'Root',
      sex: 'OTHER',
      email: 'admin@test.com',
      password: basePassword,
      role: 'AUTHORITY',
      authority: { create: { rank: 'OWNER' } },
    },
  });

  await prisma.user.create({
    data: {
      username: 'staff',
      name: 'Staff',
      lname: 'Worker',
      sex: 'OTHER',
      email: 'staff@test.com',
      password: basePassword,
      role: 'STAFF',
      staff: { create: { post: 'COOK' } },
    },
  });

  const creators: { id: string }[] = [];

  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        username: `creator${i}`,
        name: pick(NAMES),
        lname: pick(LNAMES),
        sex: 'OTHER',
        email: `creator${i}@test.com`,
        password: basePassword,
        role: 'CUSTOMER',
        customer: { create: {} },
      },
      select: { id: true },
    });

    creators.push(user);

    await prisma.creatorStats.create({
      data: { userId: user.id },
    });
  }

  // ───────── INGREDIENTS ─────────
  const ingredientRecords = await Promise.all(
    INGREDIENTS.map((ing) =>
      prisma.ingredient.upsert({
        where: { name: ing.name },
        update: {},
        create: ing,
      }),
    ),
  );

  // ───────── TAGS ─────────
  const tagRecords = await Promise.all(
    TAGS.map((name) =>
      prisma.tag.upsert({
        where: { name },
        update: {},
        create: {
          name,
          isApproved: true,
          createdById: authority.id,
        },
      }),
    ),
  );

  // ───────── PLATES ─────────
  for (let i = 0; i < 12; i++) {
    const creator = creators[i % creators.length]!; // 🔥 assert seguro

    const plate = await prisma.plate.create({
      data: {
        name: pick(PLATE_NAMES),
        description: 'Plato generado automáticamente 🚀',
        source: 'C',
        type: pick(TYPES),
        flavor: pick(FLAVORS),
        creatorId: creator.id,
        avgRating: Math.random() * 5,
        ratingsCount: Math.floor(Math.random() * 50),
      },
    });

    // ingredientes
    for (const ing of ingredientRecords.slice(0, 3)) {
      await prisma.plateIngredient.create({
        data: {
          plateId: plate.id,
          ingredientId: ing.id,
        },
      });
    }

    // tags
    for (const tag of tagRecords.slice(0, 2)) {
      await prisma.plateTag.create({
        data: {
          plateId: plate.id,
          tagId: tag.id,
        },
      });

      await prisma.tag.update({
        where: { id: tag.id },
        data: { usageCount: { increment: 1 } },
      });
    }

    await prisma.creatorStats.update({
      where: { userId: creator.id },
      data: {
        totalPlates: { increment: 1 },
      },
    });
  }

  console.log('✅ Seed completa');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
