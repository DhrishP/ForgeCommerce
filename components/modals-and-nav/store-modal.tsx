"use client";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "./modal";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(1),
});
export const StoreModal = () => {
  const [loading, setloading] = useState(false);
  const storeModal = useStoreModal();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setloading(true);
      const datapush = await axios.post("/api/store", values);
      if (datapush) {
        window.location.assign(`/${datapush.data.id}`);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setloading(false);
    }
  };
  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder="E-commerce"
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
              disabled={loading}
              variant={"outline"}
              onClick={storeModal.onClose}
            >
              Cancel
            </Button>
            <Button
              className="hover:bg-white hover:text-black"
              disabled={loading}
              type="submit"
            >
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
