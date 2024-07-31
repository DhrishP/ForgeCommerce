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
    "Free Arrivals": "https://res.cloudinary.com/duvuaoxpz/image/upload/v1690808793/ll3rlnvbtto96gnhl5cx.png",
    "New Arrivals": "https://res.cloudinary.com/duvuaoxpz/image/upload/v1690808807/qj1xmvpabx4stnu4ixk0.png",
    "Winter Collection": "https://res.cloudinary.com/duvuaoxpz/image/upload/v1690750877/mefshoqkahgpwj7zp3gy.png",
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
      triggerButtonText="Add Sample Data"
    />
  );
};

export default SampleDataModal;
