"use client";
import React from "react";
import JsonEditorModal from "../editors/JSON-editor";
import { defaultCategories } from "@/utils/quick-data";
import axios from "axios";
import { useParams } from "next/navigation";
type OnSubmitProps = {
  categories?: string[];
  colors?: Record<string, string>;
  sizes?: Record<string, string>;
  bills?: Record<string, string>;
};

const SampleDataModalCat = () => {
  const param = useParams();
  
  const onSubmit = async (data: OnSubmitProps) => {
    const putCategories = await axios.post(
      `/api/${param.StoreId}/multipleCategories`,
      { nameArr: data.categories }
    );
    if (putCategories.status === 200) {
      console.log("Categories added successfully");
    } else {
      return;
    }
  };
  return (
    <JsonEditorModal
      title="Edit Store and Add Sample Data"
      description="Make changes to your profile and add sample data for categories in JSON format."
      fields={[
        {
          name: "categories",
          defaultValue: defaultCategories,
          label: "Categories{category names}",
        },
      ]}
      onSubmit={onSubmit}
      triggerButtonText="Add Quick Data⚡"
    />
  );
};

export default SampleDataModalCat;
