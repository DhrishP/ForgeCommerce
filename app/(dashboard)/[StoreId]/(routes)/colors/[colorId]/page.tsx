import { db } from "@/db/drizzle";
import { colors } from "@/db/schema";
import { eq } from "drizzle-orm";
import ColorForm from "./components/color-form";


const ColorPage = async ({
  params,
}: {
  params: { colorId: string };
}) => {

  const color = await db.select().from(colors).where(eq(colors.id, params.colorId))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialdata={color} />
      </div>
    </div>
  );
};

export default ColorPage;
