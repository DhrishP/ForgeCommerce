import { CategoryForm } from "./components/catogories-form";
import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { categories, billboards } from "@/db/schema";

const CategoryPage = async ({
  params,
}: {
  params: { CategoriesId: string; StoreId: string };
}) => {
  const findCategories = await db
    .select()
    .from(categories)
    .where(eq(categories.id, params.CategoriesId));

  const billboardsData = await db.select().from(billboards).where(eq(billboards.storeId, params.StoreId))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm billboards={billboardsData} initialData={findCategories[0]} />
      </div>
    </div>
  );
};

export default CategoryPage;
