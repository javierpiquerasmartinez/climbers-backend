/*
  Warnings:

  - You are about to drop the column `climbingStyles` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ClimbingStyleName" AS ENUM ('DEPORTIVA', 'BOULDER', 'VIA_LARGA', 'CLASICA', 'PSICOBLOC');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "climbingStyles";

-- CreateTable
CREATE TABLE "ClimbingStyle" (
    "id" SERIAL NOT NULL,
    "name" "ClimbingStyleName" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClimbingStyle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_UserClimbingStyles" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_UserClimbingStyles_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClimbingStyle_name_key" ON "ClimbingStyle"("name");

-- CreateIndex
CREATE INDEX "_UserClimbingStyles_B_index" ON "_UserClimbingStyles"("B");

-- AddForeignKey
ALTER TABLE "_UserClimbingStyles" ADD CONSTRAINT "_UserClimbingStyles_A_fkey" FOREIGN KEY ("A") REFERENCES "ClimbingStyle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserClimbingStyles" ADD CONSTRAINT "_UserClimbingStyles_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
