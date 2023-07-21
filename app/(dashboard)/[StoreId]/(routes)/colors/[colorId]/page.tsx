import prisma from "@/prisma/client"
import ColorForm from "./components/color-form";


const ColorPage = async ({
  params,
}: {
  params: { colorId: string };
}) => {
  const color = await prisma.colors.findUnique({
    where: {
      id: params.colorId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialdata={color} />
      </div>
    </div>
  );
};

export default ColorPage;
