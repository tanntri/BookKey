-- CreateTable
CREATE TABLE "Library" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Library_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Library" ADD CONSTRAINT "Library_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
