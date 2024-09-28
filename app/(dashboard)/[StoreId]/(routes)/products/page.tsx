import React from "react";
import { formatter } from "@/lib/utils";
import Products from "./components/products";
import { db } from "@/db/drizzle";
import { products, categories, sizes, colors } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

const BillboardPage = async ({ params }: { params: { StoreId: string } }) => {
  const FindProduct = await db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
      archived: products.archived,
      featured: products.featured,
      createdAt: products.createdAt,
      categories: {
        name: categories.name,
      },
      size: {
        name: sizes.name,
      },
      color: {
        value: colors.value,
      },
    })
    .from(products)
    .leftJoin(categories, eq(products.categoriesId, categories.id))
    .leftJoin(sizes, eq(products.sizesId, sizes.id))
    .leftJoin(colors, eq(products.colorId, colors.id))
    .where(eq(products.storeId, params.StoreId))
    .orderBy(desc(products.updatedAt));

  const FilteredData = FindProduct.map((product) => ({
    id: product.id,
    name: product.name,
    price: formatter.format(parseFloat(product.price)),
    archived: product.archived ?? false,
    featured: product.featured ?? false,
    categoryname: product.categories?.name ?? "N/A",
    size: product.size?.name ?? "N/A",
    color: product.color?.value ?? "N/A",
    createdAt: product.createdAt?.toLocaleDateString() ?? "N/A",
  }));
  return (
    <div className="flex flex-col">
      <div className="flex-1 py-6 px-8">
        <Products ProductsData={FilteredData} />
      </div>
    </div>
  );
};

export default BillboardPage;
