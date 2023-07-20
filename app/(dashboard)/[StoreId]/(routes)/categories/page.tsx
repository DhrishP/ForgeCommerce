import React from "react";

import prisma from "@/prisma/client";
import Categories from "./components/Categories";

const CategoriesPage = async ({ params }: { params: { StoreId: string } }) => {
  const FindCategories = await prisma.categories.findMany({
    where: {
      StoreId: params.StoreId,
    },
    include:{
        billboard:true
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  
  const FilteredData = FindCategories.map((cat)=>(
    {
        ImageUrl:cat.billboard.ImageUrl,
        id:cat.id,
        name:cat.name,
        billboardLabel:cat.billboard.label,
        createdAt:cat.createdAt.toLocaleDateString()

    }
  ))
  return (
    <div className="flex flex-col">
      <div className="flex-1 py-6 px-8">
        <Categories CategoriesData={FilteredData}  />
      </div>
    </div>
  );
};

export default CategoriesPage;