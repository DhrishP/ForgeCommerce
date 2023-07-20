"use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Plus } from "lucide-react";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { BillBoard } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./data-table";
import { columns } from "./TableColumn";
import ApiList from "./ApiList";

type billboardsprops ={
  BillboardData :BillBoard[] 
}
const Billboards = ({BillboardData}:billboardsprops) => {
  const router = useRouter();
  const params = useParams();
  const FilteredData = BillboardData.map((bill)=>(
    {
      label:bill.label,
      createdAt:(bill.createdAt).toDateString(),
      id:bill.id,
      ImageUrl:bill.ImageUrl,
    }
  ))
  return (
    <>
    <div className="flex items-center justify-between">
      <div>
        <Heading
          title={`Billboards(${BillboardData.length})`}
          description="Create and manage billboards"
        />
      </div>
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
    <Separator/>
      <DataTable columns={columns} data={FilteredData}/>
      <div className="w-full mt-10 ml-2">
      <Heading title={'Api'} description="Api's to connected frontend and backend"/>
      <Separator/>
      <ApiList Entityname="billboards" EntityIdname="billboardId"/>
      </div>
    </>
  );
};

export default Billboards;
