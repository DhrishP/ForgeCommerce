import React from "react";

import prisma from "@/prisma/client";
import Sizes from "./components/Sizes";

const SizesPage = async ({ params }: { params: { StoreId: string } }) => {
  const FindSizes = await prisma.sizes.findMany({
    where: {
      StoreId: params.StoreId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  
  const FilteredData = FindSizes.map((size)=>(
    {
        id:size.id,
        name:size.name,
        value:size.value,
        createdAt:size.createdAt.toLocaleDateString()
    }
  ))
  return (
    <div className="flex flex-col">
      <div className="flex-1 py-6 px-8">
        <Sizes SizesData={FilteredData}  />
      </div>
    </div>
  );
};

export default SizesPage;