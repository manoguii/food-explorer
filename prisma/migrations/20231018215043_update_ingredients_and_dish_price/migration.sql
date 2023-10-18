/*
  Warnings:

  - You are about to drop the column `title` on the `ingredients` table. All the data in the column will be lost.
  - Changed the type of `price` on the `dishes` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `name` to the `ingredients` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ingredients" DROP CONSTRAINT "ingredients_dish_id_fkey";

-- AlterTable
ALTER TABLE "dishes" DROP COLUMN "price",
ADD COLUMN     "price" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ingredients" DROP COLUMN "title",
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "dish_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ingredients" ADD CONSTRAINT "ingredients_dish_id_fkey" FOREIGN KEY ("dish_id") REFERENCES "dishes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
