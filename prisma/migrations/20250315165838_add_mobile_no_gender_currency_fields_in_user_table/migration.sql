-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('₹', '$');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currency" "Currency" NOT NULL DEFAULT '₹',
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "mobileNo" TEXT;
