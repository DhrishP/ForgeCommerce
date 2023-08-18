"use client";
import {
  ArchiveRestore,
  CopyIcon,
  Edit3Icon,
  Magnet,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParams, useRouter } from "next/navigation";
import { FilteredDataProps } from "./column";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { AlertModal } from "../../../../../../components/modals-and-nav/Alert-modal";
type CellActionsProps = {
  data: FilteredDataProps;
};

const CellActions = ({ data }: CellActionsProps) => {
  const [loading, setloading] = useState(false);
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const HandleEdit = () => {
    router.push(`/${params.StoreId}/products/${data.id}`);
  };
  const Handledelete = async () => {
    try {
      setloading(true);
      await axios.delete(`/api/${params.StoreId}/products/${data.id}`);
      toast.success("Product successfully deleted");
      router.refresh();
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setloading(false);
      setOpen(false);
    }
  };
  const HandleFeature = async () => {
    try {
      await axios.patch(`/api/${params.StoreId}/products/${data.id}`, {
        featured: true,
        archived: false,
      });
      toast.success("Product successfully featured");
      router.refresh();
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setloading(false);
      setOpen(false);
    }
  };
  const HandleArchive = async () => {
    try {
      await axios.patch(`/api/${params.StoreId}/products/${data.id}`, {
        archived: true,
        featured: false,
      });
      toast.success("Product successfully archived");
      router.refresh();
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setloading(false);
      setOpen(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        loading={loading}
        onClose={() => {
          setOpen(false);
        }}
        onConfirm={Handledelete}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(data.id);
              toast.success("copied to clipboard");
            }}
          >
            <CopyIcon className="h-4 w-4 mr-2" />
            Copy ID
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              HandleEdit();
            }}
          >
            <Edit3Icon className="h-4 w-4 mr-2" />
            <h2> Edit</h2>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              HandleFeature();
            }}
            className="cursor-pointer"
          >
            <Magnet className="h-4 w-4 mr-2" />
            Feature
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              HandleArchive();
            }}
            className="cursor-pointer"
          >
            <ArchiveRestore className="h-4 w-4 mr-2" />
            Archive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellActions;
