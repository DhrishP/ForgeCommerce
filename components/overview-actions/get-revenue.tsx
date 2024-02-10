import prisma from "@/prisma/client";


export default async function getRevenue(StoreId: string) {
  if (!StoreId) return null;

  const orders = await prisma.order.findMany({
    where: {
      StoreId,
      isPaid: true,
    },
    include: {
      orderItems: true,
    },
  });
  const productIds = orders.flatMap((item) =>
    item.orderItems.map((o) => o.productId)
  );
  const findProduct = await prisma.products.findMany({
    where: {
      id: {
        in: [...productIds],
      },
    },
    select: {
      price: true,
    },
  });
  const total = findProduct.reduce((initial, curritem) => {
    return initial + curritem.price.toNumber();
  }, 0);
  return total;
}
