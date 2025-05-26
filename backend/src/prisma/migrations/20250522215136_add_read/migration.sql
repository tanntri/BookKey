-- CreateTable
CREATE TABLE "BookRead" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "BookRead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BookRead_bookId_userId_key" ON "BookRead"("bookId", "userId");

-- AddForeignKey
ALTER TABLE "BookRead" ADD CONSTRAINT "BookRead_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
