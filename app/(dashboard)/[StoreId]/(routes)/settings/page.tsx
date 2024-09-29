"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Trash as TrashIcon } from "lucide-react";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals-and-nav/Alert-modal";
import { Separator } from "@/components/ui/separator";
import UseOrigin from "@/hooks/origin-client";
import ApiBlock from "@/components/ui/api-block";
import AddDynamicPage from "@/components/AddDynamicPage";

type SettingsProps = {
  name: string;
  id: string;
};

const formSchema = z.object({
  updatedname: z.string().min(1),
});

const SettingsPage = ({ name, id }: SettingsProps) => {
  const [loading, setloading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const origin = UseOrigin();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      updatedname: name,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setloading(true);
      if (values.updatedname === name) {
        throw new Error("Same as previous name");
      }
      const Updatename = await axios.patch(`/api/store/${id}`, values);
      if (Updatename.status === 200) {
        toast.success("Name changed successfully");
        router.refresh();
      }
    } catch (err) {
      toast.error(`${err}`);
    } finally {
      setloading(false);
    }
  };

  const HandleDelete = async () => {
    try {
      setloading(true);
      await axios.delete(`/api/store/${id}`);
      toast.success("Store successfully deleted");
      router.push("/");
    } catch (err) {
      toast.error("Please delete all the products first");
    } finally {
      setloading(false);
    }
  };

  const handlePageAdded = (newPage: any) => { // will change later
    console.log('New page added:', newPage);
    toast.success(`New page "${newPage.name}" added successfully`);
    router.refresh();
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        loading={loading}
        onClose={() => {
          setOpen(false);
        }}
        onConfirm={HandleDelete}
      />
      <div className="flex-col space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading
            title="Settings"
            description="Manage store settings"
          />
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setOpen(true)}
          >
            <TrashIcon className="h-5 w-4" />
          </Button>
        </div>
        <Separator />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="updatedname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Store name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={loading}
              className="ml-auto"
              type="submit"
            >
              Save changes
            </Button>
          </form>
        </Form>
        <Separator />
        <ApiBlock
          title="NEXT_PUBLIC_API_URL"
          description={`${origin}/api/${id}`}
          variant="public"
        />
        <Separator />
        <Heading
          title="Add Dynamic Page"
          description="Create a new custom page with attributes"
        />
        <AddDynamicPage onPageAdded={handlePageAdded} />
      </div>
    </>
  );
};

export default SettingsPage;