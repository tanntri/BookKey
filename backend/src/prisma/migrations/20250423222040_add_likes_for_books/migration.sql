-- CreateTable
CREATE TABLE "BookLike" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookIsbn" TEXT NOT NULL,

    CONSTRAINT "BookLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookLike_bookIsbn_key" ON "BookLike"("bookIsbn");

-- AddForeignKey
ALTER TABLE "BookLike" ADD CONSTRAINT "BookLike_bookIsbn_fkey" FOREIGN KEY ("bookIsbn") REFERENCES "Book"("isbn") ON DELETE RESTRICT ON UPDATE CASCADE;
