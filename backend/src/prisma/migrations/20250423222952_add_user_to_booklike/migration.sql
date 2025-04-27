/*
  Warnings:

  - A unique constraint covering the columns `[bookIsbn,userId]` on the table `BookLike` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `BookLike` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "BookLike_bookIsbn_key";

-- AlterTable
ALTER TABLE "BookLike" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "BookLike_bookIsbn_userId_key" ON "BookLike"("bookIsbn", "userId");

-- AddForeignKey
ALTER TABLE "BookLike" ADD CONSTRAINT "BookLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
