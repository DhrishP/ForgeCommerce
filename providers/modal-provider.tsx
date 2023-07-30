"use client";

import { StoreModal } from "@/components/modals-and-nav/store-modal";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
  const [isMounted, SetisMounted] = useState(false);

  useEffect(() => {
    SetisMounted(true); //Until this lifecycle is runned , there shouldnt be any difference between server and client side components hence we are passingn null back
  }, []);

  if (!isMounted) {
    return null; //this is used to not cause hydration as the provider is a client component
  }

  return <StoreModal />;
};
