import prisma from "@/prisma/client";
import React from "react";
import BillBoardForm from "./components/billboard-form";

const BillBoardId = async ({ params }: { params: { billboardId: string } }) => {
  const billboard = await prisma.billBoard.findFirst({
    where: {
      id: params.billboardId,
    },
  });
  return (
    <div className="flex flex-col ">
      <div className="flex-1 px-8 py-6">
        <BillBoardForm initialdata={billboard} />
      </div>
    </div>
  );
};

export default BillBoardId;
