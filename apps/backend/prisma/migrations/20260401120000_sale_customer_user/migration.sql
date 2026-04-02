-- AlterTable
ALTER TABLE "Sale" ADD COLUMN "customerUserId" TEXT;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_customerUserId_fkey" FOREIGN KEY ("customerUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "Sale_customerUserId_idx" ON "Sale"("customerUserId");
