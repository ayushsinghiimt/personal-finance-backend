/*
  Warnings:

  - You are about to drop the column `createdAt` on the `AssetLiabilityCategory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AssetLiability" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "AssetLiabilityCategory" DROP COLUMN "createdAt";
