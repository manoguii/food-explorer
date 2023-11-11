-- CreateEnum
CREATE TYPE "Label" AS ENUM ('TABLE', 'DELIVERY', 'TAKEOUT');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "label" "Label" NOT NULL DEFAULT 'TABLE',
ADD COLUMN     "priority" "Priority" NOT NULL DEFAULT 'LOW';
