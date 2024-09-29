"use client";

import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import { AlertModal } from "@/components/modals-and-nav/Alert-modal";
import { DynamicAttribute, DynamicPage } from "@prisma/client";

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

type DynamicAttributeFormValues = z.infer<typeof formSchema>;

export const DynamicAttributeForm = ({
  initialData,
  dynamicPage,
}: {
  initialData: DynamicAttribute | null;
  dynamicPage: DynamicPage | null;
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? "Edit attribute" : "Create attribute";
  const description = initialData ? "Edit a attribute." : "Add a new attribute";
  const toastMessage = initialData
    ? "Attribute updated."
    : "Attribute created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<DynamicAttributeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (data: DynamicAttributeFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(
          `/api/${params.StoreId}/${params.dynamicPage}/${initialData.id}`,
          data
        );
      } else {
        await axios.post(`/api/${params.StoreId}/${params.dynamicPage}`, data);
      }
      router.refresh();
      router.push(`/${params.StoreId}/${params.dynamicPage}`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/${params.StoreId}/${params.dynamicPage}/${initialData?.id}`
      );
      router.refresh();
      router.push(`/${params.StoreId}/${params.dynamicPage}`);
      toast.success("Attribute deleted.");
    } catch (error: any) {
      toast.error(
        "Make sure you removed all products using this attribute first."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Attribute name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Attribute value"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
