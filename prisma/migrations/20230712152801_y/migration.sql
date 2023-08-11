-- AlterTable
ALTER TABLE "shopping_lists" DROP COLUMN "sort_order";

-- AlterTable
ALTER TABLE "shopping_list_ingredients" ADD COLUMN     "sort_order" SMALLINT NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "shopping_memos" ADD COLUMN     "sort_order" SMALLINT NOT NULL DEFAULT 0;

