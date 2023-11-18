import React from "react";
import { UserButton, auth } from "@clerk/nextjs";
import MainNav from "./MainNav";
import StoreDropdown from "./StoreDropdown";
import { redirect } from "next/navigation";
import prisma from "@/prisma/client";
import { ThemeButton } from "./theme-button";
import redis from "@/lib/redis";

const Navbar = async () => {
  const { userId } = auth();
  let stores;
  if (!userId) {
    redirect("/sign-in");
  }
  let cachedVAL:any | null = await redis.get(`storeNavbar:${userId}`);
  if (!cachedVAL) {
    stores = await prisma.store.findMany({
        where: {
          userId: userId,
        },
      });
      await redis.set(`storeNavbar:${userId}`, JSON.stringify(stores));
      await redis.expire(`storeNavbar:${userId}`, 60 * 60);
  } else {
    stores = cachedVAL;
  }

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
