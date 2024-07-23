export type StoreItemType = {
  name: string;
  description: string;
  cost: number[];
  acquired: number;
};

export const StoreItems = {
  Terminal: [
    { name: "Basic Movement", description: "", cost: [100], acquired: 0 },
    { name: "Auto Complete", description: "", cost: [100], acquired: 0 },
    { name: "Help Command", description: "", cost: [100], acquired: 0 },
    { name: "Command History", description: "", cost: [100], acquired: 0 },
  ],
  GUI: [{ name: "Basic Buttons", description: "", cost: [100], acquired: 0 }],
  "KB+M": [{ name: "Turn & Move", description: "", cost: [100], acquired: 0 }],
  Sensor: [
    { name: "Radius", description: "", cost: [100], acquired: 0 },
    { name: "Auto Refresh Rate", description: "", cost: [100], acquired: 0 },
    { name: "Detect Objects", description: "", cost: [100], acquired: 0 },
  ],
  Map: [
    { name: "Current Location", description: "", cost: [100], acquired: 0 },
    { name: "Direction", description: "", cost: [100], acquired: 0 },
    { name: "Add Wall on Click", description: "", cost: [100], acquired: 0 },
    {
      name: "Auto add Wall on Wall Bump",
      description: "",
      cost: [100],
      acquired: 0,
    },
    {
      name: "Example to test scroll",
      description: "",
      cost: [100, 100, 100, 100, 100],
      acquired: 0,
    },
    {
      name: "Example to test scroll",
      description: "",
      cost: [100, 100, 100, 100, 100],
      acquired: 0,
    },
    {
      name: "Example to test scroll",
      description: "",
      cost: [100, 100, 100, 100, 100],
      acquired: 0,
    },
  ],
  Camera: [
    {
      name: "Number of Rays",
      description: "",
      cost: [100, 200, 300],
      acquired: 0,
    },
    { name: "FoV", description: "", cost: [100, 200], acquired: 0 },
    { name: "Distance", description: "", cost: [100], acquired: 0 },
    { name: "Color", description: "", cost: [100], acquired: 0 },
    { name: "Auto Refresh Rate", description: "", cost: [100], acquired: 0 },
    { name: "KB+M Integration", description: "", cost: [100], acquired: 0 },
    {
      name: "Example to test scroll",
      description: "",
      cost: [100, 100, 100, 100, 100],
      acquired: 0,
    },
    {
      name: "Example to test scroll",
      description: "",
      cost: [100, 100],
      acquired: 0,
    },
    {
      name: "Example to test scroll",
      description: "",
      cost: [100, 100, 100, 100],
      acquired: 0,
    },
  ],
  "ROB-I": [
    { name: "Move Speed", description: "", cost: [100], acquired: 0 },
    { name: "Turn Speed", description: "", cost: [100], acquired: 0 },
    { name: "Durability", description: "", cost: [100], acquired: 0 },
    { name: "Fuel Capacity", description: "", cost: [100], acquired: 0 },
  ],
  "Add-ons": [{ name: "Claw", description: "", cost: [100], acquired: 0 }],
};
