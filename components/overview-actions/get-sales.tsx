import prisma from "@/prisma/client";


export default async function getSales(StoreId: string) {
  if (!StoreId) return null;


  const res = await prisma.order.findMany({
    where: {
      isPaid: true,
      StoreId,
    },
    select: {
      Email: true,
      id: true,
      name: true,
    },
  });



  return res.length;
}
