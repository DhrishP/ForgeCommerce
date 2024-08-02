import prisma from "@/prisma/client";

export async function colorsExist(StoreId: string) {
  if (!StoreId) return 0;

  const count = await prisma.colors.count({
    where: {
      StoreId,
    },
  });

  return count;
}
