import React from "react";
import { UserButton, auth } from "@clerk/nextjs";
import MainNav from "./MainNav";
import StoreDropdown from "./StoreDropdown";
import { redirect } from "next/navigation";
import prisma from "@/prisma/client";
import { ThemeButton } from "./theme-button";

const Navbar = async () => {
  const { userId } = auth();
  let stores;
  if (!userId) {
    redirect("/sign-in");
  }

  stores = await prisma.store.findMany({
    where: {
      userId: userId,
    },
  });

  return (
    <>
      <div className="flex h-16 px-4 justify-between items-center border-b">
        <div className="flex space-x-4 items-center  ">
          <div>
            <StoreDropdown items={stores} />
          </div>
          <div className="">
            <MainNav />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeButton />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </>
  );
};

export default Navbar;
