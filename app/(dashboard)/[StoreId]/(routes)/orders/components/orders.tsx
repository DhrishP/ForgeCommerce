"use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Plus } from "lucide-react";
import React from "react";
import { useParams, useRouter } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { DataTable } from "../../../../../../components/ui/data-table";
import { OrderColumn, columns } from "./column";
import ApiList from "../../../../../../components/ui/api-list";

type OrdersProps = {
  OrdersData: OrderColumn[];
};

const Orders = ({ OrdersData }: OrdersProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Orders(${OrdersData.length})`}
          description="Create and manage Orders"
        />
      </div>
      <Separator />
      <DataTable searchKey="products" columns={columns} data={OrdersData} />
      <div className="w-full mt-10 ml-2">
      </div>
    </>
  );
};

export default Orders;
