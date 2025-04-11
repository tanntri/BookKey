-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('BLOCK_CONTENT', 'ALL');

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "blockedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "permissions" "Permission"[];
