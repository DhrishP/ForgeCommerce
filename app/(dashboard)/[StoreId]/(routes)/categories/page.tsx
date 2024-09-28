import React from "react";

import { db } from "@/db/drizzle";
import { categories, billboards } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import Categories from "./components/Categories";

const CategoriesPage = async ({ params }: { params: { StoreId: string } }) => {
  const findCategories = await db
    .select({
      id: categories.id,
      name: categories.name,
      createdAt: categories.createdAt,
      billboardId: categories.billboardId,
      billboardLabel: billboards.label,
      billboardImageUrl: billboards.imageUrl,
    })
    .from(categories)
    .leftJoin(billboards, eq(categories.billboardId, billboards.id))
    .where(eq(categories.storeId, params.StoreId))
    .orderBy(desc(categories.updatedAt));

  const filteredData = findCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    billboardLabel: cat.billboardLabel ?? "",
    ImageUrl: cat.billboardImageUrl ?? "",
    createdAt: cat.createdAt ? cat.createdAt.toLocaleDateString() : "",
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 py-6 px-8">
        <Categories CategoriesData={filteredData} />
      </div>
    </div>
  );
};

export default CategoriesPage;
