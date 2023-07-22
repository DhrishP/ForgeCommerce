import prisma from "@/prisma/client";
import {ProductForm} from "./components/product-form";

const ProductIdPage = async ({
  params,
}: {
  params: { productId: string; StoreId: string };
}) => {
  const product = await prisma.products.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      Image: true,
    },
  });

  const sizes = await prisma.sizes.findMany({
    where: {
      StoreId: params.StoreId,
    },
  });
  const categories = await prisma.categories.findMany({
    where: {
      StoreId: params.StoreId,
    },
  });
  const colors = await prisma.colors.findMany({
    where: {
      StoreId: params.StoreId,
    },
  });
  return (
    <div className="flex flex-col ">
      <div className="flex-1 px-8 py-6">
        <ProductForm initialData={product} colors={colors} sizes={sizes} categories={categories} />
      </div>
    </div>
  );
};

export default ProductIdPage;
