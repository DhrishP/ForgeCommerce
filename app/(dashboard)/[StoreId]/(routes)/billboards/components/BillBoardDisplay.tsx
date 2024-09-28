"use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { InferSelectModel } from "drizzle-orm";
import { billboards } from "@/db/schema";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "../../../../../../components/ui/data-table";
import { columns } from "./TableColumn";
import ApiList from "../../../../../../components/ui/api-list";
import axios from "axios";
import SampleDataModalBill from "@/components/quick-adds/sample-data-bill";

type billboardsprops = {
  BillboardData: InferSelectModel<typeof billboards>[];
};
const Billboards = ({ BillboardData }: billboardsprops) => {
  const router = useRouter();
  const params = useParams();
  const [billboards, setBillboards] = useState(BillboardData);
  const FilteredData = billboards.map((bill) => ({
    label: bill.label,
    createdAt: bill.createdAt ? bill.createdAt.toISOString() : "",
    id: bill.id,
    ImageUrl: bill.imageUrl,
  }));

  // useEffect(() => { //future useEffect for state persistent issue

  //   const fetchBillboards = async () => {
  //     try {
  //       const response = await axios.get(`/api/${params.StoreId}/billboards`);
  //       setBillboards(response.data);
  //     } catch (error) {
  //       console.error("Failed to fetch billboards:", error);
  //     }
  //   };

  //   fetchBillboards();
  // }, [params.StoreId]);

  const onDeleteSelected = async (ids: string[]) => {
    try {
      console.log(ids, "ids deleted");
      const res = await axios.delete(
        `/api/${params.StoreId}/billboards/multidelete`,
        {
          data: { idsArr: ids },
        }
      );
      setBillboards((prevBillboards) =>
        prevBillboards.filter(
          (billboard) => !ids.includes(billboard.id.toString())
        )
      );
      return "true";
    } catch (err) {
      console.log(err);
      return "Check if the billboard attached to categories,products is deleted and try again";
    }
  };
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <Heading
            title={`Billboards(${BillboardData.length})`}
            description="Create and manage billboards"
          />
        </div>
        <div className="flex items-center justify-center space-x-2">
          <SampleDataModalBill />
          <Button
            onClick={() => {
              router.push(`/${params.StoreId}/billboards/new`);
            }}
            className="gap-x-2 hover:bg-secondary hover:text-primary"
          >
            <Plus className="h-5 w-4" />
            New
          </Button>
        </div>
      </div>
      <Separator />
      <DataTable
        onDeleteSelected={onDeleteSelected}
        searchKey="label"
        columns={columns}
        data={FilteredData}
      />
      <div className="w-full mt-10 ml-2">
        <Heading
          title={"Api"}
          description="Api's to connected frontend and backend"
        />
        <Separator />
        <ApiList Entityname="billboards" EntityIdname="billboardId" />
      </div>
    </>
  );
};

export default Billboards;
