/*
  Warnings:

  - You are about to drop the column `user_id` on the `dishes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "dishes" DROP CONSTRAINT "dishes_user_id_fkey";

-- AlterTable
ALTER TABLE "dishes" DROP COLUMN "user_id";

-- CreateTable
CREATE TABLE "favorite_dishes" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "dish_id" TEXT NOT NULL,

    CONSTRAINT "favorite_dishes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "favorite_dishes_user_id_dish_id_key" ON "favorite_dishes"("user_id", "dish_id");

-- AddForeignKey
ALTER TABLE "favorite_dishes" ADD CONSTRAINT "favorite_dishes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_dishes" ADD CONSTRAINT "favorite_dishes_dish_id_fkey" FOREIGN KEY ("dish_id") REFERENCES "dishes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
