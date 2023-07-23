"use client";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import CellActions from "./Cell-Actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type CategoryColumn = {
  id: string;
  name: string;
  billboardLabel: string;
  createdAt: string;
  ImageUrl: string;
};

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "billboardLabel",
    header: "Billboard",
  },

  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    header: "Preview",
    id: "preview",
    cell: ({ row }) => {
      const data = row.original;
      return (
        <>
          <Image src={data.ImageUrl} alt={data.name} width={70} height={5} />
        </>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
];
