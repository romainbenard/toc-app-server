-- CreateEnum
CREATE TYPE "OcdCategory" AS ENUM ('CHECKING', 'ORGANISATION', 'CONTAMINATION', 'INTRUSIVE_THOUGHT');

-- CreateEnum
CREATE TYPE "OcdLocation" AS ENUM ('HOME', 'WORK', 'PUBLIC_TRANSPORT', 'OUTDOOR');

-- CreateTable
CREATE TABLE "Ocd" (
    "id" TEXT NOT NULL,
    "category" "OcdCategory" NOT NULL,
    "description" TEXT,
    "intensity" INTEGER NOT NULL,
    "repetition" INTEGER,
    "timeLost" INTEGER,
    "location" "OcdLocation" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Ocd_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ocd" ADD CONSTRAINT "Ocd_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
