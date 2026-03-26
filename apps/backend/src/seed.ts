import { prisma } from '@tools/db';

async function main() {
  console.log('🌱 Starting Database Seeding...');

  // 1. Create Base Ingredients with Nutritional Values
  const bun = await prisma.ingredient.upsert({
    where: { name: 'Pan de Papa Artesanal' },
    update: {},
    create: {
      name: 'Pan de Papa Artesanal',
      flavor: 'SWEET',
      calories: 150,
      proteins: 5,
      carbs: 28,
      fats: 2,
    },
  });

  const beef = await prisma.ingredient.upsert({
    where: { name: 'Medallón Smashed 100g' },
    update: {},
    create: {
      name: 'Medallón Smashed 100g',
      flavor: 'UMAMI',
      calories: 250,
      proteins: 18,
      carbs: 0,
      fats: 20,
    },
  });

  const cheddar = await prisma.ingredient.upsert({
    where: { name: 'Queso Cheddar Fundido' },
    update: {},
    create: {
      name: 'Queso Cheddar Fundido',
      flavor: 'SALTY',
      calories: 120,
      proteins: 7,
      carbs: 1,
      fats: 10,
    },
  });

  // 2. Create QART Signature Plates
  await prisma.plate.create({
    data: {
      name: 'Double Smash QART',
      description: 'Doble medallón smashed con costra perfecta y cuádruple cheddar derretido.',
      price: 12.5,
      type: 'MAIN',
      flavor: 'UMAMI',
      calories: 850,
      proteins: 52,
      carbs: 30,
      fats: 58,
      recommendations: 1250,
      notRecommendations: 12,
      avgRating: 4.8,
      ratingsCount: 850,
      ingredients: {
        create: [
          { ingredient: { connect: { id: bun.id } } },
          { ingredient: { connect: { id: beef.id } } },
          { ingredient: { connect: { id: cheddar.id } } },
        ],
      },
    },
  });

  await prisma.plate.create({
    data: {
      name: 'Spicy Truffle Mushroom',
      description: 'Medallón jugoso, hongos portobello, alioli de trufa blanca.',
      price: 14.0,
      type: 'MAIN',
      flavor: 'UMAMI',
      calories: 720,
      proteins: 40,
      carbs: 35,
      fats: 45,
      recommendations: 980,
      notRecommendations: 45,
      avgRating: 4.5,
      ratingsCount: 600,
      ingredients: {
        create: [
          { ingredient: { connect: { id: bun.id } } },
          { ingredient: { connect: { id: beef.id } } },
        ],
      },
    },
  });

  await prisma.plate.create({
    data: {
      name: 'The Vegan Crunch',
      description: 'Not-Burger crujiente con aderezo ranch vegano.',
      price: 11.8,
      type: 'MAIN',
      flavor: 'SALTY',
      calories: 600,
      proteins: 25,
      carbs: 45,
      fats: 30,
      recommendations: 500,
      notRecommendations: 8,
      avgRating: 4.9,
      ratingsCount: 410,
    },
  });

  console.log('✅ Seeding Complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
