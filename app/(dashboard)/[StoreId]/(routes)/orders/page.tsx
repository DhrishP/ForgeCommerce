import React from "react";
import Orders from "./components/orders";
import prisma from "@/prisma/client";
import { formatter } from "@/lib/utils";

const OrdersPage = async ({ params }: { params: { StoreId: string } }) => {
  const FindOrders = await prisma.order.findMany({
    where: {
      StoreId: params.StoreId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  const FilterData = FindOrders.map((order) => ({
    id: order.id,
    phone: order.phone,
    isPaid: order.isPaid,
    product: order.orderItems.map((item) => item.product.name).join(", "),
    address: order.address,
    totalPrice: formatter.format(
      order.orderItems.reduce((total, item) => {
        return total + Number(item.product.price);
      }, 0)
    ),
    createdAt:order.createdAt.toLocaleDateString()
  }));
  
  return (
    <div className="flex flex-col">
      <div className="flex-1 py-6 px-8">
        <Orders OrdersData={FilterData} />
      </div>
    </div>
  );
};

export default OrdersPage;
