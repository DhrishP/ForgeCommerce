"use client";
import React from "react";
import JsonEditorModal from "../editors/JSON-editor";
import { defaultSizes } from "@/utils/quick-data";
import axios from "axios";
import { useParams } from "next/navigation";
type OnSubmitProps = {
  categories?: string[];
  colors?: Record<string, string>;
  sizes?: Record<string, string>;
  bills?: Record<string, string>;
};

const SampleDataModalSizes = () => {
  const param = useParams();
  const onSubmit = async (data: OnSubmitProps) => {
    console.log(data);
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
      description="Make changes to your profile and add sample data for sizes in JSON format."
      fields={[
        {
          name: "sizes",
          defaultValue: defaultSizes,
          label: "Sizes{sizename : size}",
        },
      ]}
      onSubmit={onSubmit}
      triggerButtonText="Add Quick Data⚡"
    />
  );
};

export default SampleDataModalSizes;
