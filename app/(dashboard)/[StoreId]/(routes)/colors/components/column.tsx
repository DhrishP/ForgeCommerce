"use client";
import { ColumnDef } from "@tanstack/react-table";
import CellActions from "./Cell-Actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ColorsColumn = {
  id: string;
  name: string;
  value: string;
  createdAt: string;
};

export const columns: ColumnDef<ColorsColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
 
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => (
      <div className="grid grid-cols-2 lg:w-1/4 w-1/3">
        <div>{row.original.value}</div>
        <div
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.value }}
        ></div>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
];
