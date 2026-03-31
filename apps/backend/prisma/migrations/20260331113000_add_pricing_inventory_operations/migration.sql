-- Create enums
CREATE TYPE "StorageType" AS ENUM ('AMBIENT', 'COLD', 'FREEZER', 'PRODUCE');
CREATE TYPE "PurchaseStatus" AS ENUM ('DRAFT', 'RECEIVED', 'CANCELLED');
CREATE TYPE "SaleStatus" AS ENUM ('OPEN', 'CONFIRMED', 'CANCELLED', 'REFUNDED');
CREATE TYPE "SaleChannel" AS ENUM ('COUNTER', 'TAKEAWAY', 'DELIVERY', 'ONLINE');

-- Alter Ingredient
ALTER TABLE "Ingredient"
ADD COLUMN "pricingBasisGrams" DOUBLE PRECISION NOT NULL DEFAULT 100,
ADD COLUMN "costPrice" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN "salePrice" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN "preferredSupplierId" TEXT,
ADD COLUMN "defaultStorageType" "StorageType" NOT NULL DEFAULT 'AMBIENT',
ADD COLUMN "maxStockGrams" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN "reorderPointGrams" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- Alter Plate
ALTER TABLE "Plate"
ADD COLUMN "netPrice" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN "taxAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN "profitAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN "profitMarginRate" DECIMAL(5,4) NOT NULL DEFAULT 0.3;

-- Create tables
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(96) NOT NULL,
    "description" VARCHAR(255),
    "contactName" VARCHAR(96),
    "email" VARCHAR(128),
    "phone" VARCHAR(32),
    "leadTimeDays" INTEGER,
    "notes" VARCHAR(255),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SupplierIngredient" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "supplierSku" VARCHAR(64),
    "purchaseUnitLabel" VARCHAR(32),
    "pricingBasisGrams" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "unitCostNet" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "minimumOrderGrams" DOUBLE PRECISION,
    "leadTimeDays" INTEGER,
    "isPreferred" BOOLEAN NOT NULL DEFAULT false,
    "lastQuotedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplierIngredient_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "StorageLocation" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "description" VARCHAR(255),
    "storageType" "StorageType" NOT NULL,
    "capacityGrams" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "notes" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorageLocation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "InventoryLevel" (
    "id" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "storageLocationId" TEXT NOT NULL,
    "currentQuantityGrams" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reservedQuantityGrams" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "maxQuantityGrams" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reorderPointGrams" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "averageUnitCost" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "lastPurchaseUnitCost" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryLevel_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TaxRule" (
    "id" TEXT NOT NULL,
    "key" VARCHAR(48) NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "description" VARCHAR(255),
    "rate" DECIMAL(8,4) NOT NULL DEFAULT 0,
    "includedInMenuPrice" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "sourceLabel" VARCHAR(96),
    "note" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxRule_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "documentNumber" VARCHAR(64),
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receivedAt" TIMESTAMP(3),
    "status" "PurchaseStatus" NOT NULL DEFAULT 'RECEIVED',
    "currencyCode" VARCHAR(3) NOT NULL DEFAULT 'ARS',
    "subtotalNet" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "notes" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PurchaseItem" (
    "id" TEXT NOT NULL,
    "purchaseId" TEXT NOT NULL,
    "ingredientId" TEXT NOT NULL,
    "storageLocationId" TEXT,
    "quantityGrams" DOUBLE PRECISION NOT NULL,
    "pricingBasisGrams" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "unitCostNet" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "taxRate" DECIMAL(8,4) NOT NULL DEFAULT 0,
    "lineNetAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "lineTaxAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "lineTotalAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PurchaseItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Sale" (
    "id" TEXT NOT NULL,
    "soldAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "SaleStatus" NOT NULL DEFAULT 'CONFIRMED',
    "channel" "SaleChannel" NOT NULL DEFAULT 'COUNTER',
    "currencyCode" VARCHAR(3) NOT NULL DEFAULT 'ARS',
    "subtotalNet" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "taxAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "notes" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SaleItem" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "plateId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitCostAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "unitNetAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "unitTaxAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "unitTotalAmount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "lineCostAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "lineNetAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "lineTaxAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "lineTotalAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SaleItem_pkey" PRIMARY KEY ("id")
);

-- Indexes
CREATE UNIQUE INDEX "Supplier_name_key" ON "Supplier"("name");
CREATE UNIQUE INDEX "SupplierIngredient_supplierId_ingredientId_key" ON "SupplierIngredient"("supplierId", "ingredientId");
CREATE INDEX "SupplierIngredient_ingredientId_idx" ON "SupplierIngredient"("ingredientId");
CREATE UNIQUE INDEX "StorageLocation_name_key" ON "StorageLocation"("name");
CREATE UNIQUE INDEX "InventoryLevel_ingredientId_storageLocationId_key" ON "InventoryLevel"("ingredientId", "storageLocationId");
CREATE INDEX "InventoryLevel_storageLocationId_idx" ON "InventoryLevel"("storageLocationId");
CREATE UNIQUE INDEX "TaxRule_key_key" ON "TaxRule"("key");
CREATE INDEX "Purchase_supplierId_purchasedAt_idx" ON "Purchase"("supplierId", "purchasedAt");
CREATE INDEX "PurchaseItem_purchaseId_idx" ON "PurchaseItem"("purchaseId");
CREATE INDEX "PurchaseItem_ingredientId_idx" ON "PurchaseItem"("ingredientId");
CREATE INDEX "PurchaseItem_storageLocationId_idx" ON "PurchaseItem"("storageLocationId");
CREATE INDEX "Sale_soldAt_status_idx" ON "Sale"("soldAt", "status");
CREATE INDEX "SaleItem_saleId_idx" ON "SaleItem"("saleId");
CREATE INDEX "SaleItem_plateId_idx" ON "SaleItem"("plateId");
CREATE INDEX "Ingredient_preferredSupplierId_idx" ON "Ingredient"("preferredSupplierId");

-- Foreign keys
ALTER TABLE "Ingredient"
ADD CONSTRAINT "Ingredient_preferredSupplierId_fkey"
FOREIGN KEY ("preferredSupplierId") REFERENCES "Supplier"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SupplierIngredient"
ADD CONSTRAINT "SupplierIngredient_supplierId_fkey"
FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SupplierIngredient"
ADD CONSTRAINT "SupplierIngredient_ingredientId_fkey"
FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "InventoryLevel"
ADD CONSTRAINT "InventoryLevel_ingredientId_fkey"
FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "InventoryLevel"
ADD CONSTRAINT "InventoryLevel_storageLocationId_fkey"
FOREIGN KEY ("storageLocationId") REFERENCES "StorageLocation"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Purchase"
ADD CONSTRAINT "Purchase_supplierId_fkey"
FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "PurchaseItem"
ADD CONSTRAINT "PurchaseItem_purchaseId_fkey"
FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PurchaseItem"
ADD CONSTRAINT "PurchaseItem_ingredientId_fkey"
FOREIGN KEY ("ingredientId") REFERENCES "Ingredient"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "PurchaseItem"
ADD CONSTRAINT "PurchaseItem_storageLocationId_fkey"
FOREIGN KEY ("storageLocationId") REFERENCES "StorageLocation"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "SaleItem"
ADD CONSTRAINT "SaleItem_saleId_fkey"
FOREIGN KEY ("saleId") REFERENCES "Sale"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "SaleItem"
ADD CONSTRAINT "SaleItem_plateId_fkey"
FOREIGN KEY ("plateId") REFERENCES "Plate"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
