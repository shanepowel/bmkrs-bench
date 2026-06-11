-- Category taxonomy fields for seed-categories
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "description" TEXT,
ADD COLUMN     "isLocal" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Skill" ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;
