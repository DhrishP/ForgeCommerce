import prisma from "@/prisma/client";

export async function dataExists(StoreId: string) {
  if (!StoreId) return null;

  const bills = await prisma.billBoard.count({
    where: {
      StoreId,
    },
  });

  const categories = await prisma.categories.count({
    where: {
      StoreId,
    },
  });
  const colors = await prisma.colors.count({
    where: {
      StoreId,
    },
  });
  const sizes = await prisma.sizes.count({
    where: {
      StoreId,
    },
  });
  return bills >= 3 && categories >= 3 && colors >= 3 && sizes >= 3
    ? true
    : false;
}
