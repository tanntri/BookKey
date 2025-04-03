-- CreateTable
CREATE TABLE "book" (
    "id" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "book" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "book_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "book_isbn_key" ON "book"("isbn");
