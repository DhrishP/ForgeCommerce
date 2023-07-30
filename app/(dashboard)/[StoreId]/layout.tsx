import Navbar from "@/components/modals-and-nav/Navbar";
import prisma from "@/prisma/client";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function StoreIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const IsStore = await prisma.store.findFirst({
    where: {
      id: params.storeId,
      userId: userId,
    },
  });
  if (!IsStore) redirect("/");
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
