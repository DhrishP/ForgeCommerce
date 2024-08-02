"use client";
import React from "react";
import JsonEditorModal from "../editors/JSON-editor";
import {
  defaultBills,
  defaultCategories,
  defaultColors,
  defaultSizes,
} from "@/utils/quick-data";

const SampleDataModal = () => {
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
      onSubmit={(data) => {
        console.log(data);
      }}
      triggerButtonText="Add Quick Data⚡"
    />
  );
};

export default SampleDataModal;
