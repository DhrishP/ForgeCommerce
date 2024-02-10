import prisma from "@/prisma/client";

import { Data } from "../ui/recent-sales";

export default async function getUserinfo(StoreId: string) {
  if (!StoreId) return null;

  const userInfo = await prisma.order.findMany({
    where: {
      StoreId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const userData = userInfo.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.Email,
    pricePaid: user.orderItems.reduce((inital, item) => {
      return inital + item.product.price.toNumber();
    }, 0),
  }));
  if (!userData) return null;


  return userData;
}
