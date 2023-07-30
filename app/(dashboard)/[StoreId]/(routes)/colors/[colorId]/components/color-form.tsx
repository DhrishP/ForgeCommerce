"use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Trash } from "lucide-react";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Colors } from "@prisma/client";
import { AlertModal } from "../../../../../../../components/modals-and-nav/Alert-modal";

type ColorsFormProps = {
  initialdata: Colors | null;
};
const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().min(1),
});

const ColorForm = ({ initialdata }: ColorsFormProps) => {
  const title = initialdata ? "Edit Color" : "Create color";
  const description = initialdata
    ? "Edit the properties of a color"
    : "Add a new color";
  const buttontag = initialdata ? "Change" : "Create";
  const toastMsg = initialdata ? "Edited the Color" : "Added new color";

  const [loading, setloading] = useState(false);
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialdata || {
      name: "",
      value: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setloading(true);
      if (initialdata) {
        await axios.patch(
          `/api/${params.StoreId}/colors/${params.colorId}`,
          values
        );
      } else {
        await axios.post(`/api/${params.StoreId}/colors`, values);
      }
      toast.success(toastMsg);
      router.refresh();
      router.push(`/${params.StoreId}/colors`);
    } catch (err) {
      toast.error(`${err}`);
    } finally {
      setloading(false);
    }
  };

  const Handledelete = async () => {
    try {
      setloading(true);
      await axios.delete(`/api/${params.StoreId}/colors/${params.colorId}`);
      toast.success("Color successfully deleted");
      router.refresh();
      router.push(`/${params.StoreId}/colors`);
    } catch (err) {
      toast.error(
        "Please delete all the categories before deleting this first"
      );
    } finally {
      setloading(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={Handledelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialdata && (
          <Button
            disabled={loading}
            variant="destructive"
            color="sm"
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
                      placeholder="Color name"
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
                    <div className="flex items-center gap-x-4">
                      <Input
                        disabled={loading}
                        placeholder="Color value"
                        {...field}
                      />
                      <div
                        className="border p-4 rounded-full"
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                  <div className="text-sm font-light">
                    You can also use{" "}
                    <a
                      href="https://www.color-hex.com/"
                      target={"_blank"}
                      className="font-semibold underline  cursor-pointer"
                    >
                      {" "}
                      hex{" "}
                    </a>
                    values
                  </div>
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {buttontag}
          </Button>
        </form>
      </Form>
      <Separator className="mx-6 mt-2 " />
    </>
  );
};

export default ColorForm;
