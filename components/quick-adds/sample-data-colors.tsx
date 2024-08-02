"use client";
import React from "react";
import JsonEditorModal from "../editors/JSON-editor";
import { defaultColors } from "@/utils/quick-data";
import axios from "axios";
import { useParams } from "next/navigation";
type OnSubmitProps = {
  categories?: string[];
  colors?: Record<string, string>;
  sizes?: Record<string, string>;
  bills?: Record<string, string>;
};

const SampleDataModalColors = () => {
  const param = useParams();
  const onSubmit = async (data: OnSubmitProps) => {
    const putColors = await axios.post(`/api/${param.StoreId}/multipleColors`, {
      dataObj: data.colors,
    });
    if (putColors.status === 200) {
      console.log("Colors added successfully");
    } else {
      return;
    }
  };
  return (
    <JsonEditorModal
      title="Edit Store and Add Sample Data"
      description="Make changes to your profile and add sample data for 
                colors in JSON format."
      fields={[
        {
          name: "colors",
          defaultValue: defaultColors,
          label: "Colors{colorname : colorcode}",
        },
      ]}
      onSubmit={onSubmit}
      triggerButtonText="Add Quick Data⚡"
    />
  );
};

export default SampleDataModalColors;
