/*
  Warnings:

  - Added the required column `loginType` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LoginType" AS ENUM ('oauth', 'credentials');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "loginType" "LoginType" NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
