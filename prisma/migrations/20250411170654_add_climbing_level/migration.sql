/*
  Warnings:

  - You are about to drop the column `level` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ClimbingLevelName" AS ENUM ('PRINCIPIANTE', 'INTERMEDIO', 'AVANZADO', 'EXPERTO', 'PRO');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "level",
ADD COLUMN     "climbingLevelId" INTEGER;

-- CreateTable
CREATE TABLE "ClimbingLevel" (
    "id" SERIAL NOT NULL,
    "name" "ClimbingLevelName" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClimbingLevel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClimbingLevel_name_key" ON "ClimbingLevel"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_climbingLevelId_fkey" FOREIGN KEY ("climbingLevelId") REFERENCES "ClimbingLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
