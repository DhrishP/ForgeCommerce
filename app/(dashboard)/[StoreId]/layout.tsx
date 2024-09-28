import Navbar from "@/components/modals-and-nav/Navbar";
import { db } from "@/db/drizzle";
import { stores } from "@/db/schema";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

export default async function StoreIdLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const isStore = await db
    .select()
    .from(stores)
    .where(eq(stores.id, params.storeId));

  if (!isStore) redirect("/");
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
