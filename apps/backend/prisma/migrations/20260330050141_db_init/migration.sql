-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'STAFF', 'AUTHORITY');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "CustomerTier" AS ENUM ('REGULAR', 'VIP', 'PREMIUM');

-- CreateEnum
CREATE TYPE "StaffPost" AS ENUM ('COOK', 'CASHIER', 'WAITER', 'BARISTA', 'CLEANER', 'DELIVERY');

-- CreateEnum
CREATE TYPE "AuthorityRank" AS ENUM ('SUPERVISOR', 'MANAGER', 'DIRECTOR', 'OWNER');

-- CreateEnum
CREATE TYPE "IngredientCategory" AS ENUM ('PROTEIN_ANIMAL', 'PROTEIN_PLANT', 'VEGETABLE', 'FRUIT', 'LEGUME', 'GRAIN', 'BREAD', 'DAIRY', 'FAT', 'SAUCE', 'CONDIMENT', 'SWEETENER', 'BEVERAGE', 'OTHER');

-- CreateEnum
CREATE TYPE "PreparationMethod" AS ENUM ('RAW', 'GRILLED', 'FRIED', 'BAKED', 'ROASTED', 'SAUTEED', 'BOILED', 'STEAMED', 'SMOKED', 'PICKLED', 'FERMENTED');

-- CreateEnum
CREATE TYPE "PlateType" AS ENUM ('STARTER', 'MAIN', 'DESSERT', 'SIDE', 'SNACK', 'DRINK');

-- CreateEnum
CREATE TYPE "FlavorProfile" AS ENUM ('SWEET', 'SALTY', 'ACID', 'BITTERSWEET', 'UMAMI', 'SPICY', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD', 'CHEF');

-- CreateEnum
CREATE TYPE "PlateSize" AS ENUM ('SMALL', 'REGULAR', 'LARGE', 'XL');

-- CreateEnum
CREATE TYPE "AdjustmentType" AS ENUM ('ADDITION', 'REMOVAL', 'SUBSTITUTION');

-- CreateEnum
CREATE TYPE "Allergen" AS ENUM ('GLUTEN', 'MILK', 'EGG', 'PEANUT', 'TREE_NUT', 'SOY', 'SESAME', 'FISH', 'SHELLFISH', 'MUSTARD', 'CELERY', 'SULFITES');

-- CreateEnum
CREATE TYPE "DietaryTag" AS ENUM ('VEGETARIAN', 'VEGAN', 'GLUTEN_FREE', 'DAIRY_FREE', 'NUT_FREE', 'LOW_CARB', 'KETO_COMPATIBLE', 'PALEO_COMPATIBLE', 'PESCATARIAN');

-- CreateEnum
CREATE TYPE "NutritionTag" AS ENUM ('HIGH_PROTEIN', 'HIGH_FIBER', 'HIGH_HEALTHY_FATS', 'LOW_SUGAR', 'LOW_SODIUM', 'WHOLE_FOOD', 'MINIMALLY_PROCESSED', 'ENERGY_DENSE', 'SATIATING');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "sname" VARCHAR(128),
    "lname" VARCHAR(128) NOT NULL,
    "sex" "Sex" NOT NULL DEFAULT 'OTHER',
    "username" VARCHAR(32) NOT NULL,
    "password" VARCHAR(128) NOT NULL,
    "email" VARCHAR(128) NOT NULL,
    "phone" VARCHAR(15),
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerProfile" (
    "userId" TEXT NOT NULL,
    "tier" "CustomerTier" NOT NULL DEFAULT 'REGULAR',

    CONSTRAINT "CustomerProfile_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "StaffProfile" (
    "userId" TEXT NOT NULL,
    "post" "StaffPost" NOT NULL,

    CONSTRAINT "StaffProfile_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "AuthorityProfile" (
    "userId" TEXT NOT NULL,
    "rank" "AuthorityRank" NOT NULL,

    CONSTRAINT "AuthorityProfile_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "description" VARCHAR(255),
    "category" "IngredientCategory" NOT NULL,
    "subCategory" VARCHAR(64),
    "primaryFlavor" "FlavorProfile",
    "nutritionBasisGrams" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "calories" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "proteins" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "carbs" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fats" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "fiber" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sugars" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sodium" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "saturatedFat" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "transFat" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "monounsaturatedFat" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "polyunsaturatedFat" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "allergens" "Allergen"[],
    "dietaryTags" "DietaryTag"[],
    "nutritionTags" "NutritionTag"[],
    "notes" VARCHAR(255),
    "extraAttributes" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngredientVariant" (
    "id" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "description" VARCHAR(255),
    "preparationMethod" "PreparationMethod" NOT NULL DEFAULT 'RAW',
    "preparationNotes" VARCHAR(255),
    "portionGrams" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "yieldFactor" DOUBLE PRECISION NOT NULL DEFAULT 1,
    "overrideCalories" DOUBLE PRECISION,
    "overrideProteins" DOUBLE PRECISION,
    "overrideCarbs" DOUBLE PRECISION,
    "overrideFats" DOUBLE PRECISION,
    "overrideFiber" DOUBLE PRECISION,
    "overrideSugars" DOUBLE PRECISION,
    "overrideSodium" DOUBLE PRECISION,
    "overrideSaturatedFat" DOUBLE PRECISION,
    "overrideTransFat" DOUBLE PRECISION,
    "overrideMonounsaturatedFat" DOUBLE PRECISION,
    "overridePolyunsaturatedFat" DOUBLE PRECISION,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IngredientVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "description" TEXT,
    "type" "PlateType" NOT NULL,
    "flavor" "FlavorProfile" NOT NULL,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'MEDIUM',
    "prepTimeMinutes" INTEGER,
    "cookTimeMinutes" INTEGER,
    "yieldServings" INTEGER NOT NULL DEFAULT 1,
    "assemblyNotes" TEXT,
    "allergens" "Allergen"[],
    "dietaryTags" "DietaryTag"[],
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeItem" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "quantityGrams" DOUBLE PRECISION NOT NULL,
    "prepNotes" VARCHAR(255),
    "isOptional" BOOLEAN NOT NULL DEFAULT false,
    "isMainComponent" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RecipeItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plate" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "description" TEXT,
    "recipeId" TEXT NOT NULL,
    "size" "PlateSize" NOT NULL DEFAULT 'REGULAR',
    "servedWeightGrams" DOUBLE PRECISION,
    "costPrice" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "menuPrice" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "avgRating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ratingsCount" INTEGER NOT NULL DEFAULT 0,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "dislikesCount" INTEGER NOT NULL DEFAULT 0,
    "calculatedCalories" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "calculatedProteins" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "calculatedCarbs" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "calculatedFats" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "calculatedFiber" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "calculatedSugars" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "calculatedSodium" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "calculatedSaturatedFat" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "calculatedTransFat" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "calculatedMonounsaturatedFat" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "calculatedPolyunsaturatedFat" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "allergens" "Allergen"[],
    "dietaryTags" "DietaryTag"[],
    "nutritionTags" "NutritionTag"[],
    "nutritionNotes" VARCHAR(255),
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlateAdjustment" (
    "id" TEXT NOT NULL,
    "plateId" TEXT NOT NULL,
    "recipeItemId" TEXT,
    "variantId" TEXT,
    "adjustmentType" "AdjustmentType" NOT NULL,
    "quantityGrams" DOUBLE PRECISION,
    "notes" VARCHAR(255),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PlateAdjustment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plateId" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL,
    "comment" VARCHAR(500),
    "recommends" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(32) NOT NULL,
    "description" VARCHAR(128),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlateTag" (
    "plateId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "PlateTag_pkey" PRIMARY KEY ("plateId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_name_key" ON "Ingredient"("name");

-- CreateIndex
CREATE INDEX "IngredientVariant_ingredientId_preparationMethod_idx" ON "IngredientVariant"("ingredientId", "preparationMethod");

-- CreateIndex
CREATE UNIQUE INDEX "IngredientVariant_ingredientId_name_key" ON "IngredientVariant"("ingredientId", "name");

-- CreateIndex
CREATE INDEX "RecipeItem_variantId_idx" ON "RecipeItem"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeItem_recipeId_sortOrder_key" ON "RecipeItem"("recipeId", "sortOrder");

-- CreateIndex
CREATE INDEX "Plate_recipeId_idx" ON "Plate"("recipeId");

-- CreateIndex
CREATE INDEX "Plate_isAvailable_menuPrice_idx" ON "Plate"("isAvailable", "menuPrice");

-- CreateIndex
CREATE INDEX "PlateAdjustment_plateId_sortOrder_idx" ON "PlateAdjustment"("plateId", "sortOrder");

-- CreateIndex
CREATE INDEX "PlateAdjustment_plateId_adjustmentType_idx" ON "PlateAdjustment"("plateId", "adjustmentType");

-- CreateIndex
CREATE INDEX "PlateAdjustment_recipeItemId_idx" ON "PlateAdjustment"("recipeItemId");

-- CreateIndex
CREATE INDEX "PlateAdjustment_variantId_idx" ON "PlateAdjustment"("variantId");

-- CreateIndex
CREATE INDEX "Review_plateId_rating_idx" ON "Review"("plateId", "rating");

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_plateId_key" ON "Review"("userId", "plateId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "PlateTag_tagId_idx" ON "PlateTag"("tagId");

-- AddForeignKey
ALTER TABLE "CustomerProfile" ADD CONSTRAINT "CustomerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffProfile" ADD CONSTRAINT "StaffProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorityProfile" ADD CONSTRAINT "AuthorityProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IngredientVariant" ADD CONSTRAINT "IngredientVariant_ingredientId_fkey" FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeItem" ADD CONSTRAINT "RecipeItem_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeItem" ADD CONSTRAINT "RecipeItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "IngredientVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Plate" ADD CONSTRAINT "Plate_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlateAdjustment" ADD CONSTRAINT "PlateAdjustment_plateId_fkey" FOREIGN KEY ("plateId") REFERENCES "Plate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlateAdjustment" ADD CONSTRAINT "PlateAdjustment_recipeItemId_fkey" FOREIGN KEY ("recipeItemId") REFERENCES "RecipeItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlateAdjustment" ADD CONSTRAINT "PlateAdjustment_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "IngredientVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_plateId_fkey" FOREIGN KEY ("plateId") REFERENCES "Plate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlateTag" ADD CONSTRAINT "PlateTag_plateId_fkey" FOREIGN KEY ("plateId") REFERENCES "Plate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlateTag" ADD CONSTRAINT "PlateTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
