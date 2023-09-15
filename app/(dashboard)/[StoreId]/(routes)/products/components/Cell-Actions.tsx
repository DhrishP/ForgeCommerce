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
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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
  const HandleDeFeature = async () =>{
    try {
      await axios.patch(`/api/${params.StoreId}/products/${data.id}`, {
        featured: true,    //USING TRUE HERE INSTEAD OF FALSE CUZ THE FALSE ONE IS USED IN HANDLEARCHIVE SO WE DE-FEATURE A PRODUCT WHEN BOTH ARE TRUE
        archived: true,  
      });
      toast.success("Product successfully De-featured");
      router.refresh();
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setloading(false);
      setOpen(false);
    }
  }
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
  const HandleDearchive = async () => {
    try {
      await axios.patch(`/api/${params.StoreId}/products/${data.id}`, {
        archived: false,
        featured: false,
      });
      toast.success("Product successfully dearchived");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  }
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
          <DropdownMenuSub>
           <DropdownMenuSubTrigger>
            <Magnet className="h-4 w-4 mr-2"/>
            Feature
           </DropdownMenuSubTrigger>
           <DropdownMenuPortal>
            <DropdownMenuSubContent className="cursor-pointer">
              <DropdownMenuItem onClick={()=>{
                HandleFeature()
              }}>
                Feature
              </DropdownMenuItem>
              <DropdownMenuItem onClick={()=>{HandleDeFeature()}}>
                De-Feature
              </DropdownMenuItem>
            </DropdownMenuSubContent>
           </DropdownMenuPortal>
         </DropdownMenuSub>
         <DropdownMenuSub>
           <DropdownMenuSubTrigger>
            <ArchiveRestore className="h-4 w-4 mr-2"/>
            Archive
           </DropdownMenuSubTrigger>
           <DropdownMenuPortal>
            <DropdownMenuSubContent className="cursor-pointer">
              <DropdownMenuItem onClick={()=>{
                HandleArchive()
              }}>
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem onClick={()=>{HandleDearchive()}}>
                De-Archive
              </DropdownMenuItem>
            </DropdownMenuSubContent>
           </DropdownMenuPortal>
         </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellActions;
