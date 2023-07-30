"use client";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Store } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import React from "react";

import {
  Check,
  ChevronsUpDown,
  PlusCircle,
  Store as StoreIcon,
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type StoreDropdownItems = {
  items: Store[];
};
const StoreDropdown = ({ items = [] }: StoreDropdownItems) => {
  const [open, setOpen] = React.useState(false);
  const storemodal = useStoreModal();
  const params = useParams();
  const router = useRouter();
  const formmattedItems = items.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const currentStore = formmattedItems.find(
    (item) => item.value === params.StoreId
  );
  const onStoreSelect = (store: { label: string; value: string }) => {
    setOpen(false);
    router.push(`/${store.value}`);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          <StoreIcon className="h-6 w-4" />
          {currentStore?.label}
          <ChevronsUpDown className="ml-2 h-4 w-4  shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] ml-4">
        <Command>
          <CommandList>
            <CommandEmpty>No Other Store found....</CommandEmpty>
            <CommandInput placeholder="Search store..." />
            <CommandGroup heading="Stores">
              {formmattedItems.map((item) => (
             
                  <CommandItem
                    key={item.value}
                    onSelect={() => onStoreSelect(item)}
                    className="text-sm"
                  >
                    <StoreIcon className="h-5 w-4 mr-2" />
                    {item.label}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        currentStore?.value === item.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  storemodal.onOpen();
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StoreDropdown;
