import React from "react";
import BillBoards from "./components/BillBoardDisplay";
import prisma from "@/prisma/client";

const BillboardPage = async ({ params }: { params: { StoreId: string } }) => {
  const FindBillboards = await prisma.billBoard.findMany({
    where: {
      StoreId: params.StoreId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return (
    <div className="flex flex-col">
      <div className="flex-1 py-6 px-8">
        <BillBoards BillboardData={FindBillboards} />
      </div>
    </div>
  );
};

export default BillboardPage;
