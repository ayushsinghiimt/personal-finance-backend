/*
  Warnings:

  - Added the required column `categoryId` to the `AssetLiability` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AssetLiability" ADD COLUMN     "categoryId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AssetLiabilityCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FinancialType" NOT NULL,

    CONSTRAINT "AssetLiabilityCategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AssetLiability" ADD CONSTRAINT "AssetLiability_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "AssetLiabilityCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
