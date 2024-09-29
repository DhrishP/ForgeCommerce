import prisma from "@/prisma/client";
import { DynamicAttributeForm } from "@/components/dynamic-attribute-form";

const DynamicAttributePage = async ({
  params,
}: {
  params: { dynamicPage: string; StoreId: string };
}) => {
  const dynamicPage = await prisma.dynamicPage.findFirst({
    where: {
      name: params.dynamicPage,
      StoreId: params.StoreId,
    },
    include: {
      attributes: true,
    },
  });
  const dynamicAttributes = await prisma.dynamicAttribute.findMany({
    where: {
      DynamicPageId: dynamicPage?.id,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <DynamicAttributeForm
          initialData={null}
          dynamicPage={dynamicPage || null}
         
          dynamicAttributes={dynamicAttributes || null}
        />
      </div>
    </div>
  );
};

export default DynamicAttributePage;
