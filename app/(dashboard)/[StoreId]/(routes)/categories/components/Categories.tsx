"use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Plus } from "lucide-react";
import React from "react";
import { useParams, useRouter } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { DataTable } from "../../../../../../components/ui/data-table";
import { CategoryColumn, columns } from "./column";
import ApiList from "../../../../../../components/ui/api-list";

type CategoriesProps = {
    CategoriesData : CategoryColumn[]
}

const Categories = ({CategoriesData}:CategoriesProps) => {
  const router = useRouter();
  const params = useParams();


  return (
    <>
    <div className="flex items-center justify-between">
      <div>
        <Heading
          title={`Categories(${CategoriesData.length})`}
          description="Create and manage Categories"
        />
      </div>
      <Button
        onClick={() => {
          router.push(`/${params.StoreId}/categories/new`);
        }}
        className="gap-x-2 hover:bg-secondary hover:text-primary"
      >
        <Plus className="h-5 w-4" />
        New
      </Button>
    </div>
    <Separator/>
      <DataTable searchKey="name" columns={columns} data={CategoriesData}/>
      <div className="w-full mt-10 ml-2">
      <Heading title={'Api'} description="Api's to connected frontend and backend"/>
      <Separator/>
      <ApiList Entityname="categories" EntityIdname="{CategoriesId}"/>
      </div>
    </>
  );
};

export default Categories;