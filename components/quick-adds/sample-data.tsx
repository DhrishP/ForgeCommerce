"use client";
import React from "react";
import JsonEditorModal from "../editors/JSON-editor";
import {
  defaultBills,
  defaultCategories,
  defaultColors,
  defaultSizes,
} from "@/utils/quick-data";
import axios from "axios";
import { useParams } from "next/navigation";
type OnSubmitProps = {
  categories?: string[];
  colors?: Record<string, string>;
  sizes?: Record<string, string>;
  bills?: Record<string, string>;
};

const SampleDataModal = () => {
  const param = useParams();
  const onSubmit = async (data: OnSubmitProps) => {
    console.log(data);
    const putBills = await axios.post(`/api/${param.StoreId}/multipleBills`, {
      dataObj: data.bills,
    });
    if (putBills.status === 200) {
      console.log("Bills added successfully");
    } else {
      return;
    }
    const putCategories = await axios.post(
      `/api/${param.StoreId}/multipleCategories`,
      { nameArr: data.categories }
    );
    if (putCategories.status === 200) {
      console.log("Categories added successfully");
    } else {
      return;
    }
    const putColors = await axios.post(`/api/${param.StoreId}/multipleColors`, {
      dataObj: data.colors,
    });
    if (putColors.status === 200) {
      console.log("Colors added successfully");
    } else {
      return;
    }
    const putSizes = await axios.post(`/api/${param.StoreId}/multipleSizes`, {
      dataObj: data.sizes,
    });
    if (putSizes.status === 200) {
      console.log("Sizes added successfully");
    }
  };
  return (
    <JsonEditorModal
      title="Edit Store and Add Sample Data"
      description="Make changes to your profile and add sample data for categories,
                colors, and sizes in JSON format."
      fields={[
        {
          name: "categories",
          defaultValue: defaultCategories,
          label: "Categories{category names}",
        },
        {
          name: "colors",
          defaultValue: defaultColors,
          label: "Colors{colorname : colorcode}",
        },
        {
          name: "sizes",
          defaultValue: defaultSizes,
          label: "Sizes{sizename : size}",
        },
        {
          name: "bills",
          defaultValue: defaultBills,
          label: "Bills{billboard text : billboard url}",
        },
      ]}
      onSubmit={onSubmit}
      triggerButtonText="Add Quick Data⚡"
    />
  );
};

export default SampleDataModal;
