"use client";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "../../components/app-components/modal";
export const StoreModal = () => {
  const storeModal = useStoreModal();

  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >HEllo</Modal>
  );
};
