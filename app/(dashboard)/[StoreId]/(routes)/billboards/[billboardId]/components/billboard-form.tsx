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
import { Separator } from "@/components/ui/separator";
import AlertApi from "@/components/ui/alert-api";
import UseOrigin from "@/hooks/origin-client";
import { BillBoard } from "@prisma/client";

type BillBoardFormProps = {
 initialdata : BillBoard | null
};
const formSchema = z.object({
  label: z.string().min(1),
  Imageurl:z.string().min(1)
});



const BillBoardForm = ({initialdata}:BillBoardFormProps) => {
    const title = initialdata? "Edit Billboard":"Create billboard";
    const description = initialdata? "Edit a Billboard":"Add a new billboard";
    const buttontag = initialdata? "Edit":"Create";
    const toastMsg  = initialdata? "Edit Billboard":"Add new billboard";
    
    const [loading, setloading] = useState(false);
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const origin = UseOrigin()
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues:initialdata || {
        label:"",
        Imageurl:''
      },
    });
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
      try {
        setloading(true);
        
        const Updatename = await axios.patch(`/api/store/${initialdata?.id}`, values);
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
      try{
          setloading(true)
          await axios.delete(`/api/store/${initialdata?.id}`)
          toast.success('Store successfully deleted')
          router.push('/')
  
      }catch(err){
          toast.error('Please delete all the products first')
      }finally{
          setloading(false)
      }
    }
    return (
      <>

        <div className="flex  items-center justify-between pt-6 px-6">
          <div>
            <Heading
              title={title}
              description={description}
            />
          </div>
          {initialdata && <Button variant={"destructive"} size={"icon"}>
            <TrashIcon className="h-5 w-4" onClick={()=>{setOpen(true)}}/>
          </Button>}
        </div>
        <div className="pl-6 w-1/3 flex items-start mt-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-primary">Label</FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="billboard text..."
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
                 {buttontag}
                </Button>
              </div>
            </form>
          </Form>
      
    
        </div>
        <Separator   className="mx-6 mt-2 "/>
       
      </>
    )
}

export default BillBoardForm