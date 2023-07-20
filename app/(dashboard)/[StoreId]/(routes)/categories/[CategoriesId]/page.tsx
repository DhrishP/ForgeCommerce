

import prisma from "@/prisma/client";
import { CategoryForm } from "./components/catogories-form";


const CategoryPage = async ({
  params
}: {
  params: { CategoriesId: string, StoreId: string }
}) => {
  const categories = await prisma.categories.findUnique({
    where: {
      id: params.CategoriesId
    }
  });

  const billboards = await prisma.billBoard.findMany({
    where: {
      StoreId: params.StoreId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm billboards={billboards} initialData={categories} />
      </div>
    </div>
  );
}

export default CategoryPage;