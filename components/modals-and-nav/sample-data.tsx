"use client";
import React from "react";
import JsonEditorModal from "../editors/JSON-editor";

const defaultCategories = JSON.stringify(
  ["T-Shirts", "Jeans", "Dresses", "Jackets", "Sweaters"],
  null,
  2
);

const defaultColors = JSON.stringify(
  {
    Red: "#FF0000",
    Blue: "#0000FF",
    Green: "#00FF00",
    Black: "#000000",
    White: "#FFFFFF",
  },
  null,
  2
);

const defaultSizes = JSON.stringify(
  {
    S: "Small",
    M: "Medium",
    L: "Large",
    XL: "Extra Large",
    XXL: "Double Extra Large",
  },
  null,
  2
);
const defaultBills = JSON.stringify(
  {
    Bill1: "Bill1",
    Bill2: "Bill2",
    Bill3: "Bill3",
    Bill4: "Bill4",
    Bill5: "Bill5",
  },
  null,
  2
);

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
          label: "Categories",
        },
        {
          name: "colors",
          defaultValue: defaultColors,
          label: "Colors",
        },
        {
          name: "sizes",
          defaultValue: defaultSizes,
          label: "Sizes",
        },
        {
          name: "bills",
          defaultValue: defaultBills,
          label: "Bills",
        },
      ]}
      onSubmit={(data) => {
        console.log(data);
      }}
      triggerButtonText="Add Sample Data"
    />
  );
};

export default SampleDataModal;
