-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'CASHIER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "sname" VARCHAR(128) NOT NULL,
    "lname" VARCHAR(128) NOT NULL,
    "sex" "Sex" NOT NULL DEFAULT 'OTHER',
    "username" VARCHAR(32) NOT NULL,
    "password" VARCHAR(128) NOT NULL,
    "email" VARCHAR(128) NOT NULL,
    "phone" VARCHAR(15) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedat" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
