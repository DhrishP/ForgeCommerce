import prisma from "@/prisma/client";

export async function billsExist(StoreId: string) {
  if (!StoreId) return null;

  const count = await prisma.billBoard.count({
    where: {
      StoreId,
    },
  });

  return count >= 3 ? true : false;
}
