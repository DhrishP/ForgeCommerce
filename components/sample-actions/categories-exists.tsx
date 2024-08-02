import prisma from "@/prisma/client";

export async function categoriesExist(StoreId: string) {
  if (!StoreId) return null;

  const count = await prisma.categories.count({
    where: {
      StoreId,
    },
  });

  return count >= 3 ? true : false;
}
