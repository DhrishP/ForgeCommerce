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
import { useParams, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Products, Image, Colors, Sizes, Categories } from "@prisma/client";
import ImageUpload from "@/components/ui/Image-upload";
import { AlertModal } from "../../../../../../../components/app-components/Alert-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type ProductFormProps = {
  initialdata:
    | (Products & {
        Image: Image[];
      })
    | null;
  categories: Categories[];
  colors: Colors[];
  sizes: Sizes[];
};
const formSchema = z.object({
  name: z.string().min(1),
  price: z.coerce.number().min(1),
  images: z.object({ url: z.string() }).array(),
  Featured: z.boolean().default(false).optional(),
  Archived: z.boolean().default(false).optional(),
  StoreId: z.string().min(1),
  CategoriesId: z.string().min(1),
  sizesId: z.string().min(1),
  colorId: z.string().min(1),
});

const ProductForm = ({
  initialdata,
  categories,
  sizes,
  colors,
}: ProductFormProps) => {
  const title = initialdata ? "Edit Product" : "Create product";
  const description = initialdata
    ? "Edit the properties of a product"
    : "Add a new product";
  const buttontag = initialdata ? "Change" : "Create";
  const toastMsg = initialdata ? "Edited the Product" : "Added new product";

  const [loading, setloading] = useState(false);
  const [open, setOpen] = useState(false);
  const params = useParams();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialdata
      ? {
          ...initialdata,
          price: parseFloat(String(initialdata?.price)),
        }
      : {
          name: "",
          images: [],
          price: 0,
          CategoriesId: "",
          colorId: "",
          sizesId: "",
          Featured: false,
          Archived: false,
        },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setloading(true);
      if (initialdata) {
        await axios.patch(
          `/api/${params.StoreId}/products/${params.productId}`,
          values
        );
      } else {
        await axios.post(`/api/${params.StoreId}/products`, values);
      }
      toast.success(toastMsg);
      router.refresh();
      router.push(`/${params.StoreId}/products`);
    } catch (err) {
      toast.error(`${err}`);
    } finally {
      setloading(false);
    }
  };

  const Handledelete = async () => {
    try {
      setloading(true);
      await axios.delete(`/api/${params.StoreId}/products/${params.productId}`);
      toast.success("Product successfully deleted");
      router.refresh();
      router.push(`/${params.StoreId}/products`);
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
      <Separator />
      <div className=" pl-6 flex items-center justify-between mt-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 w-full"
          >
            <FormField
              control={form.control}
              name="images"
              render={(
                { field } //field passes imageurl array
              ) => (
                <FormItem>
                  <FormLabel className="font-bold text-primary">
                    Images
                  </FormLabel>
                  <FormControl>
                    <ImageUpload
                      disabled={loading}
                      onChange={(url) => {
                        field.onChange([...field.value, { url }]); //Updates the array with the current url
                      }}
                      onRemove={(url) =>
                        field.onChange([
                          ...field.value.filter(
                            (current) => current.url !== url
                          ),
                        ])
                      }
                      values={field.value.map((image) => image.url)} //If we want multiple images then we can pass here a single value in array is passed
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="md:grid md:grid-cols-3 gap-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-primary">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={loading}
                        placeholder="Product Name.."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-primary">
                      Price(In USD)
                    </FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="4.99" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="CategoriesId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a category"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sizesId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Size</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a size"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sizes.map((size) => (
                          <SelectItem key={size.id} value={size.id}>
                            {size.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="colorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <Select
                      disabled={loading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select a color"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {colors.map((color) => (
                          <div key={color.id} className="flex items-center  ">
                            
                            <SelectItem value={color.id}>
                              {color.name}
                            </SelectItem>
                            <div
                              style={{ backgroundColor: color.name }}
                              className="h-6 w-6 rounded-full border"
                            ></div>
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
              control={form.control}
              name="Featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-semibold">
                      Featured
                    </FormLabel>
                    <FormDescription className="text-gray-500">
                      This product will appear on the home page
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
               <FormField
              control={form.control}
              name="Archived"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-semibold">
                      Archived
                    </FormLabel>
                    <FormDescription className="text-gray-500">
                      This product will not appear anywhere in the store
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            </div>
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

export default ProductForm;
