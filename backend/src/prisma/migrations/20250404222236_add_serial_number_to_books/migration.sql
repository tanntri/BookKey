/*
  Warnings:

  - A unique constraint covering the columns `[serialNumber]` on the table `Book` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "serialNumber" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Book_serialNumber_key" ON "Book"("serialNumber");
