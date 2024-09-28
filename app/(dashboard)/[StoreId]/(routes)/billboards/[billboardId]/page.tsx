import React from "react";
import BillBoardForm from "./components/billboard-form";
import { db } from "@/db/drizzle";
import { billboards } from "@/db/schema";
import { eq } from "drizzle-orm";

const BillBoardId = async ({ params }: { params: { billboardId: string } }) => {
  const billboard = await db
    .select()
    .from(billboards)
    .where(eq(billboards.id, params.billboardId));
  return (
    <div className="flex flex-col ">
      <div className="flex-1 px-8 py-6">
        <BillBoardForm initialdata={billboard[0]} />
      </div>
    </div>
  );
};

export default BillBoardId;
