import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function RootLayout2({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const findStore = await prisma.store.findFirst({
    where: {
      userId: userId,
    },
  });
  if (findStore) {
    redirect(`/${findStore.id}`);
  }
  return <>{children}</>;
}
