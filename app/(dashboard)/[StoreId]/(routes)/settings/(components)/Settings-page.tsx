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
import { AlertModal } from "../../../../../../components/modals-and-nav/Alert-modal";
import { Separator } from "@/components/ui/separator";
import UseOrigin from "@/hooks/origin-client";
import ApiBlock from "@/components/ui/api-block";

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
        toast.success("Named changed succesfully");
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
      <div className="flex  items-center justify-between pt-6 px-6">
        <div>
          <Heading
            title={"Settings"}
            description={"To update and delete stores"}
          />
        </div>
        <Button variant={"destructive"} size={"icon"}>
          <TrashIcon
            className="h-5 w-4"
            onClick={() => {
              setOpen(true);
            }}
          />
        </Button>
      </div>
      <div className="pl-6 w-1/3 flex items-start mt-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            <FormField
              control={form.control}
              name="updatedname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold text-primary">Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Your updated name"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription></FormDescription>
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
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <Separator className="mx-6 mt-2 " />
      <ApiBlock
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${id}`}
        variant="public"
      />
    </>
  );
};

export default SettingsPage;
