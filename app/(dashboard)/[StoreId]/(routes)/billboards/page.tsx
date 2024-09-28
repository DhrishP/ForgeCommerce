import React from "react";
import BillBoards from "./components/BillBoardDisplay";
import { db } from "@/db/drizzle";
import { billboards, stores } from "@/db/schema";
import { eq } from "drizzle-orm";

const BillboardPage = async ({ params }: { params: { StoreId: string } }) => {
  const FindBillboards = await db
    .select()
    .from(billboards)
    .where(eq(billboards.storeId, params.StoreId));

  return (
    <div className="flex flex-col">
      <div className="flex-1 py-6 px-8">
        <BillBoards
          BillboardData={FindBillboards}
        />
      </div>
    </div>
  );
};

export default BillboardPage;
