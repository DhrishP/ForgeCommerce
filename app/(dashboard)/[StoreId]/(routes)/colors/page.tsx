import React from "react";

import Colors from "./components/Colors";
import { db } from "@/db/drizzle";
import { colors } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

const ColorsPage = async ({ params }: { params: { StoreId: string } }) => {
  const FindColors = await db
    .select()
    .from(colors)
    .where(eq(colors.storeId, params.StoreId))
    .orderBy(desc(colors.updatedAt));

  const FilteredData = FindColors.map((color) => ({
    id: color.id,
    name: color.name,
    value: color.value,
    createdAt: color.createdAt ? color.createdAt.toDateString() : "",
  }));
  return (
    <div className="flex flex-col">
      <div className="flex-1 py-6 px-8">
        <Colors ColorsData={FilteredData} />
      </div>
    </div>
  );
};

export default ColorsPage;
