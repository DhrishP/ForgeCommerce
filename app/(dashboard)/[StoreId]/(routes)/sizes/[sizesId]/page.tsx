import prisma from "@/prisma/client";
import SizeForm from "./components/sizes-form";


const SizePage = async ({
  params,
}: {
  params: { sizesId: string };
}) => {
  const sizes = await prisma.sizes.findUnique({
    where: {
      id: params.sizesId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialdata={sizes} />
      </div>
    </div>
  );
};

export default SizePage;
