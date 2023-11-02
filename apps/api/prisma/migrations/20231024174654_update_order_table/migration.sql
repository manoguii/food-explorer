/*
  Warnings:

  - Added the required column `orderDetails` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "orderDetails" TEXT NOT NULL;
