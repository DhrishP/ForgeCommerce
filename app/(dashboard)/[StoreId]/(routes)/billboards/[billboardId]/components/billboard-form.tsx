"use client";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Trash as TrashIcon } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { BillBoard } from "@prisma/client";
import ImageUpload from "@/components/ui/Image-upload";
import { AlertModal } from "../../../../../../../components/modals-and-nav/Alert-modal";

type BillBoardFormProps = {
  initialdata: BillBoard | null;
};
const formSchema = z.object({
  label: z.string().min(1),
  ImageUrl: z.string(),
});

const BillBoardForm = ({ initialdata }: BillBoardFormProps) => {
  const title = initialdata ? "Edit Billboard" : "Create billboard";
  const description = initialdata
    ? "Edit the properties of a billboard"
    : "Add a new billboard";
  const buttontag = initialdata ? "Change" : "Create";
  const toastMsg = initialdata ? "Edited the Billboard" : "Added new billboard";

  const [loading, setloading] = useState(false);
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialdata || {
      label: "",
      ImageUrl: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setloading(true);
      if (initialdata) {
        await axios.patch(
          `/api/${params.StoreId}/billboards/${params.billboardId}`,
          values
        );
      } else {
        await axios.post(`/api/${params.StoreId}/billboards`, values);
      }
      toast.success(toastMsg);
      router.refresh();
      router.push(`/${params.StoreId}/billboards`);
    } catch (err) {
      toast.error(`${err}`);
    } finally {
      setloading(false);
    }
  };

  const Handledelete = async () => {
    try {
      setloading(true);
      await axios.delete(
        `/api/${params.StoreId}/billboards/${params.billboardId}`
      );
      toast.success("Billboard successfully deleted");
      router.refresh();
      router.push(`/${params.StoreId}/billboards`);
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
        loading={loading}
        onClose={() => {
          setOpen(false);
        }}
        onConfirm={Handledelete}
      />
      <div className="flex  items-center justify-between pt-6 px-6">
        <div>
          <Heading title={title} description={description} />
        </div>
        {initialdata && (
          <Button variant={"destructive"} size={"icon"}>
            <TrashIcon
              className="h-5 w-4"
              onClick={() => {
                setOpen(true);
              }}
            />
          </Button>
        )}
      </div>
      <div className="pl-6 w-1/3 flex items-start mt-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="ImageUrl"
              render={(
                { field } //field passes imageurl array
              ) => (
                <FormItem>
                  <FormLabel className="font-bold text-primary">
                    Add an Background Image
                  </FormLabel>
                  <FormControl>
                    <ImageUpload
                      disabled={loading}
                      onChange={(url) => {
                        field.onChange(url); //Updates the array with the current url
                      }}
                      onRemove={() => {
                        field.onChange("");
                      }}
                      values={field.value ? [field.value] : []} //If we want multiple images then we can pass here a single value in array is passed
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-primary">
                    Label
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Billboard text.."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className={cn("flex ")}>
              <Button
                className="hover:bg-white hover:text-black hover:border-black border-2 px-3 "
                disabled={loading}
                type="submit"
              >
                {buttontag}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <Separator className="mx-6 mt-2 " />
    </>
  );
};

export default BillBoardForm;
