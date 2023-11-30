/*
  Warnings:

  - Added the required column `name` to the `Ocd` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ocd" ADD COLUMN     "name" TEXT NOT NULL;
